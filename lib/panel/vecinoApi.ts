'use client'
import { panelDb } from './supabase'
import {
  DEFAULT_FREE_RULES, freemiumOnFrom, freeRulesFrom, parseLostDemand, parsePosterStatus, parseTierCatalog, parseVerifyResponse,
  parseWeeklyQuota, verifyUrlFrom, type CatalogEntry, type FreePrizeRules, type LostDemand, type PosterMeta, type PosterStatus,
  type VerifyOutcome, type WeeklyQuota,
} from './vecino'

/**
 * Comercio Vecino (F2): las llamadas al servidor desde la web, con el mismo
 * cliente y la misma sesión que el resto del panel (lib/panel/supabase.ts). Las
 * mismas funciones que la app (apps/mobile/src/services/vecinoApi.ts); ninguna
 * nueva. La lógica está en vecino.ts, que es pura y tiene pruebas.
 *
 * Las lecturas nunca lanzan: sin red, sin migración o con un error devuelven
 * null y la pantalla no dibuja esa pieza. Las acciones sí lanzan, para que
 * quien llama enseñe el error con su texto (vecinoErrorText).
 */

async function rpcRead<T>(fn: string, args: Record<string, unknown> | undefined, parse: (raw: unknown) => T | null): Promise<T | null> {
  try {
    const db = panelDb()
    const { data, error } = args ? await db.rpc(fn, args) : await db.rpc(fn)
    if (error) return null
    return parse(data)
  } catch {
    return null
  }
}

/**
 * flags.freemium_sponsors para quien tiene la sesión en el panel (my_flag, 0122).
 * Sin sesión, my_flag mira auth.uid() = null: solo da true con `all: true`.
 * Cualquier fallo es apagado.
 */
export async function fetchFreemiumOn(): Promise<boolean> {
  return (await rpcRead('my_flag', { p_key: 'freemium_sponsors' }, (raw) => freemiumOnFrom(raw))) ?? false
}

/** Los datos de app_config que usa el Vecino. Públicos y sin sesión (0002). */
export interface VecinoConfig {
  /** /api/carteles/verificar del CRM. null = no se llama y el cartel se revisa a mano. */
  verifyUrl: string | null
  /** {categoría: €} para la estimación de ventas no captadas, o null. */
  avgTicket: unknown
  /** Días para canjear el código de otro comercio (sponsor.invite_window_days, 0126). */
  inviteWindowDays: number
}

export const EMPTY_CONFIG: VecinoConfig = { verifyUrl: null, avgTicket: null, inviteWindowDays: 30 }

export async function fetchVecinoConfig(): Promise<VecinoConfig> {
  try {
    const { data, error } = await panelDb()
      .from('app_config')
      .select('key, value')
      .in('key', ['sponsor.poster_verify_url', 'sponsor.avg_ticket_eur', 'sponsor.invite_window_days'])
    if (error || !data) return EMPTY_CONFIG
    const map = new Map((data as { key: string; value: unknown }[]).map((r) => [r.key, r.value]))
    const days = Number(map.get('sponsor.invite_window_days'))
    return {
      verifyUrl: verifyUrlFrom(map.get('sponsor.poster_verify_url')),
      avgTicket: map.get('sponsor.avg_ticket_eur') ?? null,
      inviteWindowDays: Number.isFinite(days) && days > 0 ? days : EMPTY_CONFIG.inviteWindowDays,
    }
  } catch {
    return EMPTY_CONFIG
  }
}

export const fetchWeeklyQuota = (): Promise<WeeklyQuota | null> => rpcRead('my_weekly_quota', undefined, parseWeeklyQuota)

export const fetchLostDemand = (days: 7 | 30 | 90 = 7): Promise<LostDemand | null> => rpcRead('my_lost_demand', { p_days: days }, parseLostDemand)

export const fetchPosterStatus = (): Promise<PosterStatus | null> => rpcRead('my_poster_status', undefined, parsePosterStatus)

/** tier_catalog() (0124): las reglas del premio de Vecino y los límites de cada paquete. */
export async function fetchCatalog(): Promise<{ rules: FreePrizeRules; limits: Partial<Record<'free' | 'bronze' | 'silver' | 'gold', CatalogEntry>> }> {
  const raw = await rpcRead('tier_catalog', undefined, (r) => r)
  const free = raw && typeof raw === 'object' && 'free' in (raw as object) ? (raw as Record<string, unknown>).free : null
  return { rules: free ? freeRulesFrom(free) : DEFAULT_FREE_RULES, limits: parseTierCatalog(raw) }
}

/** sponsor_set_weekly_limit (0124). null quita el tope propio. */
export async function setWeeklyLimit(limit: number | null): Promise<WeeklyQuota | null> {
  const { data, error } = await panelDb().rpc('sponsor_set_weekly_limit', { p_limit: limit })
  if (error) throw error
  return parseWeeklyQuota(data)
}

/** sponsor_upgrade_request (0126): la propuesta con el enlace de pago llega por WhatsApp o correo (n8n). */
export async function requestUpgrade(tier: 'bronze' | 'silver' | 'gold' | null): Promise<{ email: boolean; whatsapp: boolean }> {
  const { data, error } = await panelDb().rpc('sponsor_upgrade_request', { p: tier ? { tier } : {} })
  if (error) throw error
  const d = (data ?? {}) as Record<string, unknown>
  return { email: d.email === true, whatsapp: d.whatsapp === true }
}

/** my_sponsor_invite_code (0126): el código propio ('V…'), que se crea la primera vez. */
export const fetchMyInviteCode = (): Promise<string | null> =>
  rpcRead('my_sponsor_invite_code', undefined, (raw) => (typeof raw === 'string' && raw ? raw : null))

/** sponsor_accept_invite (0126). Lanza INVITE_TOO_LATE, INVITE_CODE_INVALID o ALREADY_INVITED. */
export async function acceptSponsorInvite(code: string): Promise<void> {
  const { error } = await panelDb().rpc('sponsor_accept_invite', { p_code: code.trim().toUpperCase() })
  if (error) throw error
}

export interface PausedPrize {
  id: string
  title: string
  prize_type: string
  discount_pct: number | null
  points_cost: number
  pausedByTier: boolean
  pausedByReports: boolean
}

/** Los premios que pausó la bajada a Vecino (paused_by_tier) o los reportes (0125). */
export async function fetchPausedPrizes(sponsorId: string): Promise<PausedPrize[]> {
  try {
    const { data, error } = await panelDb()
      .from('prizes')
      .select('id, title, prize_type, discount_pct, points_cost, status, paused_by_tier, paused_by_reports_at')
      .eq('sponsor_id', sponsorId)
      .eq('status', 'paused')
    if (error || !data) return []
    return (data as Record<string, unknown>[])
      .filter((d) => d.paused_by_tier || d.paused_by_reports_at)
      .map((d) => {
        const t = d.title as Record<string, unknown> | string | null
        const title = t && typeof t === 'object' ? String(t.es ?? Object.values(t)[0] ?? 'Premio') : String(t ?? 'Premio')
        return {
          id: String(d.id),
          title,
          prize_type: String(d.prize_type ?? 'product'),
          discount_pct: d.discount_pct == null ? null : Number(d.discount_pct),
          points_cost: Number(d.points_cost ?? 0),
          pausedByTier: !!d.paused_by_tier,
          pausedByReports: !!d.paused_by_reports_at,
        }
      })
  } catch {
    return []
  }
}

/** «Ajustar y publicar»: el arreglo de freePrizeFix y vuelta a `active`. Los disparadores de la 0124 lo vuelven a comprobar. */
export async function publishFixedPrize(id: string, patch: Record<string, unknown>): Promise<void> {
  const { error } = await panelDb().from('prizes').update({ ...patch, status: 'active' }).eq('id', id)
  if (error) throw error
}

// ── Cartel ────────────────────────────────────────────────────

/**
 * Sube la foto (ya en JPEG) al bucket PRIVADO `carteles` (0130), en la carpeta
 * del comercio, y devuelve la ruta del objeto. No hay URL pública: el CRM la
 * descarga con la clave de servicio y la enseña con URL firmadas.
 * Necesita la 0130 ejecutada: sin el bucket, falla con «bucket not found».
 */
export async function uploadPosterPhoto(path: string, jpeg: Blob): Promise<string> {
  const { error } = await panelDb().storage.from('carteles').upload(path, jpeg, { contentType: 'image/jpeg', upsert: false })
  if (error) throw error
  return path
}

/** sponsor_submit_poster (0126/0130): p_photo_url es la ruta <uid>/<fichero> del bucket `carteles`. */
export async function submitPoster(photoUrl: string, meta: PosterMeta): Promise<void> {
  const { error } = await panelDb().rpc('sponsor_submit_poster', { p_photo_url: photoUrl, p_meta: meta })
  if (error) throw error
}

/** Cuánto se espera a la ruta del CRM (lleva una llamada a un modelo). */
export const VERIFY_TIMEOUT_MS = 30_000

/**
 * Avisa a /api/carteles/verificar del CRM de que hay foto nueva: cuerpo vacío y
 * el token de la sesión del comercio, igual que la app. La ruta ya admite CORS
 * desde https://appark.es y https://www.appark.es; desde otro origen (una vista
 * previa de Vercel, localhost) el navegador la bloquea y cuenta como revisión
 * manual. Sin URL, sin sesión, sin red o con cualquier respuesta que no sea un
 * 200: `manual`. Nunca lanza.
 */
export async function verifyPoster(url: string | null): Promise<VerifyOutcome> {
  if (!url) return { status: 'manual', reason: null }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS)
  try {
    const { data } = await panelDb().auth.getSession()
    const token = data.session?.access_token
    if (!token) return { status: 'manual', reason: null }
    const res = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
    if (res.status !== 200) return { status: 'manual', reason: null }
    return parseVerifyResponse(await res.json().catch(() => null))
  } catch {
    return { status: 'manual', reason: null }
  } finally {
    clearTimeout(timer)
  }
}

// ── Alta gratis ───────────────────────────────────────────────

export interface ClaimFreeInput {
  empresa: string
  category: string | null
  address: string | null
  telefono: string | null
  email: string
  contactPerson: string | null
  lat: number
  lng: number
  code: string | null
}

/**
 * claim_sponsor_free (0124) con la sesión recién abierta: ese usuario pasa a ser
 * el comercio. El servidor decide por auth.uid() si el alta gratis está abierta
 * (FREEMIUM_SIGNUP_OFF si no) y atribuye la ficha al comercial del código.
 */
export async function claimSponsorFree(input: ClaimFreeInput): Promise<void> {
  const { error } = await panelDb().rpc('claim_sponsor_free', {
    p: {
      empresa: input.empresa,
      category: input.category ?? 'other',
      address: input.address,
      telefono: input.telefono,
      contact_person: input.contactPerson,
      email: input.email,
      lat: input.lat,
      lng: input.lng,
      language: 'es',
      code: input.code,
    },
  })
  if (error) throw error
}
