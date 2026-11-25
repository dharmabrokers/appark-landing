// ADAPTADA de Appark-main apps/mobile/src/services/vecino.ts (panel web, appark.es).
// La lógica que comparten tiene que dar lo mismo en la app y en la web: si cambias
// una regla allí, cámbiala aquí. Lo propio de la web (la captura con
// <input capture> + navigator.geolocation y los textos en español) está marcado.
/**
 * Comercio Vecino (F2 del modelo freemium, docs/MODELO-FREEMIUM.md §2 en
 * Appark-main): la lógica pura del alta gratis y del panel web, sin red ni
 * React, para poder probarla con `node --test`. vecinoApi.ts habla con el
 * servidor (migraciones 0122 y 0124-0128).
 *
 * Regla de todo el módulo: lo que llega raro del servidor se trata como «no se
 * sabe» y la pantalla no dibuja nada, en vez de inventar un número. Un cero
 * inventado le diría al comercio que nadie le ha visto.
 *
 * Sin imports: lo cargan las pruebas.
 */

const num = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v)
    ? v
    : typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))
      ? Number(v)
      : null
const str = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null)
const obj = (v: unknown): Record<string, unknown> | null =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null

// ============================================================================
// El interruptor (0122)
// ============================================================================

/**
 * flags.freemium_sponsors de quien tiene la sesión, a partir de my_flags() o
 * my_flag(). Solo `true` de verdad es encendido: sin la migración, sin red o con
 * cualquier otra cosa, apagado, y la web se comporta exactamente como antes.
 */
export function freemiumOnFrom(raw: unknown): boolean {
  if (raw === true) return true
  const o = obj(raw)
  return !!o && o.freemium_sponsors === true
}

// ============================================================================
// Lo que devuelven las funciones del servidor
// ============================================================================

/** my_weekly_quota() (0124). `cap` y `left` null = sin límite (Oro). */
export interface WeeklyQuota {
  tier: string
  cap: number | null
  used: number
  left: number | null
  base: number | null
  bonus: number
  custom: number | null
  /** Solo Bronce y Plata con el interruptor: el mínimo que pueden elegir. */
  customMin: number | null
  renewsAt: string | null
}

export function parseWeeklyQuota(raw: unknown): WeeklyQuota | null {
  const o = obj(raw)
  if (!o || !str(o.tier)) return null
  const used = num(o.used)
  if (used === null) return null
  return {
    tier: str(o.tier)!,
    cap: num(o.cap),
    used,
    left: num(o.left),
    base: num(o.base),
    bonus: num(o.bonus) ?? 0,
    custom: num(o.custom),
    customMin: num(o.custom_min),
    renewsAt: str(o.renews_at),
  }
}

/** my_lost_demand() (0125). */
export interface LostDemand {
  days: number
  quotaBlocked: number
  nearbyQualified: number
  avgDistanceM: number | null
}

export function parseLostDemand(raw: unknown): LostDemand | null {
  const o = obj(raw)
  if (!o) return null
  const qb = num(o.quota_blocked)
  const nq = num(o.nearby_qualified)
  if (qb === null || nq === null) return null
  return { days: num(o.days) ?? 30, quotaBlocked: qb, nearbyQualified: nq, avgDistanceM: num(o.avg_distance_m) }
}

/** my_poster_status() (0126). null si la sesión no es de un comercio. */
export interface PosterStatus {
  /** Estado de bo.posters: null si nunca ha subido ninguno. */
  status: string | null
  since: string | null
  expiresAt: string | null
  daysLeft: number | null
  canRenew: boolean
}

export function parsePosterStatus(raw: unknown): PosterStatus | null {
  const o = obj(raw)
  if (!o) return null
  return {
    status: str(o.status),
    since: str(o.since),
    expiresAt: str(o.expires_at),
    daysLeft: num(o.days_left),
    canRenew: o.can_renew === true,
  }
}

/** Los límites de un paquete en tier_catalog() (0124). */
export interface CatalogEntry {
  locations: number
  prizes: number
  redemptionsWeek: number
  maxPrizePoints: number
}

/**
 * tier_catalog() devuelve un objeto {bronze: {...}, silver: {...}, ...}; con el
 * interruptor encendido para quien pregunta, con los números del modelo nuevo y
 * `free`. 0 = sin límite, como en app_config.
 */
export function parseTierCatalog(raw: unknown): Partial<Record<'free' | 'bronze' | 'silver' | 'gold', CatalogEntry>> {
  const o = obj(raw)
  const out: Partial<Record<'free' | 'bronze' | 'silver' | 'gold', CatalogEntry>> = {}
  if (!o) return out
  for (const t of ['free', 'bronze', 'silver', 'gold'] as const) {
    const e = obj(o[t])
    if (!e) continue
    const prizes = num(e.prizes)
    const week = num(e.redemptions_week)
    if (prizes === null || week === null) continue
    out[t] = { locations: num(e.locations) ?? 0, prizes, redemptionsWeek: week, maxPrizePoints: num(e.max_prize_points) ?? 0 }
  }
  return out
}

// ============================================================================
// El cartel cada 60 días (§2.3)
// ============================================================================

export type PosterCardState =
  /** Nunca lo ha puesto, o se lo rechazamos: «Haz la foto». */
  | { kind: 'start'; rejected: boolean }
  /** Subido y esperando a la verificación (automática o a mano). */
  | { kind: 'pending' }
  /** Validado y con tiempo de sobra. */
  | { kind: 'verified'; daysLeft: number | null }
  /** Validado pero le quedan ≤14 días, o ya ha caducado: «Renueva la foto». */
  | { kind: 'renew'; daysLeft: number | null; expired: boolean }
  /** Cartel de antes del modelo nuevo, sin caducidad: nada que hacer. */
  | { kind: 'legacy' }

export function posterCard(p: PosterStatus): PosterCardState {
  if (p.status === 'pending') return { kind: 'pending' }
  if (p.status === 'verified' || p.since) {
    if (p.expiresAt === null && p.since) return { kind: 'legacy' }
    if (p.canRenew) return { kind: 'renew', daysLeft: p.daysLeft, expired: p.daysLeft !== null && p.daysLeft <= 0 }
    return { kind: 'verified', daysLeft: p.daysLeft }
  }
  return { kind: 'start', rejected: p.status === 'rejected' }
}

/**
 * La ruta del fichero dentro del bucket PRIVADO `carteles` (0130). Tiene que
 * casar con el patrón de sponsor_submit_poster: <uid>/<nombre>.<ext>, con el
 * nombre solo de [A-Za-z0-9._-]. Es también lo que se manda como p_photo_url. La web siempre sube JPEG (ver
 * POSTER_MAX_SIDE).
 */
export function posterPath(uid: string, now: number): string {
  return `${uid}/cartel_${now}.jpg`
}

/** El p_meta de sponsor_submit_poster. Solo lo que la ruta del CRM comprueba. */
export interface PosterMeta {
  lat: number
  lng: number
  accuracy_m: number | null
  taken_at: string
  source: 'camera'
  platform: 'web'
}

export function posterMeta(coords: { latitude: number; longitude: number; accuracy?: number | null }, takenAt: number): PosterMeta {
  return {
    lat: Math.round(coords.latitude * 1e6) / 1e6,
    lng: Math.round(coords.longitude * 1e6) / 1e6,
    accuracy_m: typeof coords.accuracy === 'number' && Number.isFinite(coords.accuracy) ? Math.round(coords.accuracy) : null,
    taken_at: new Date(takenAt).toISOString(),
    source: 'camera',
    platform: 'web',
  }
}

/**
 * WEB. Lo más largo que se sube: la foto se vuelve a codificar en JPEG en el
 * navegador (el sharp del CRM no abre HEIC, y así tampoco viajan los EXIF). La
 * ruta busca el QR hasta a 2800 px, así que no se baja de ahí.
 */
export const POSTER_MAX_SIDE = 2800

/** El tamaño al que se redimensiona, sin agrandar nunca. */
export function fitWithin(width: number, height: number, max = POSTER_MAX_SIDE): { width: number; height: number } {
  if (!(width > 0) || !(height > 0)) return { width: 0, height: 0 }
  const k = Math.min(1, max / Math.max(width, height))
  return { width: Math.round(width * k), height: Math.round(height * k) }
}

/**
 * Cuánto puede tener una posición (o la foto) para contar como «del momento».
 * La ruta del CRM rechaza fotos de hace más de 10 minutos y mide la distancia
 * a la puerta: una posición vieja haría que rechazara a quien sí está allí.
 */
export const POSTER_FIX_MAX_AGE_MS = 2 * 60_000

export function fixIsFresh(fixTimestamp: number | null | undefined, now: number): boolean {
  return typeof fixTimestamp === 'number' && now - fixTimestamp <= POSTER_FIX_MAX_AGE_MS && fixTimestamp <= now + 60_000
}

/** WEB. Más allá de esto el GPS no sirve para decir en qué puerta estás. */
export const POSTER_POOR_ACCURACY_M = 100

export type CaptureProblem =
  /** El archivo es de antes: no sale de la cámara en este momento (galería). */
  | 'old_photo'
  /** No hay posición. */
  | 'no_fix'
  /** La posición es de hace más de 2 minutos. */
  | 'old_fix'

/**
 * WEB. Lo que se comprueba antes de subir la foto del cartel.
 *
 * En el navegador no se puede obligar a usar la cámara: `capture="environment"`
 * la abre en el móvil, pero en el ordenador abre la carpeta. Una foto recién
 * hecha llega con `lastModified` de ahora; una de la galería, con la fecha en
 * que se hizo. No es infalible (la ruta del CRM vuelve a mirar la hora de
 * subida, la huella y el escaparate), pero corta el caso fácil.
 */
export function captureProblems(c: {
  fileLastModified: number | null | undefined
  fix: { timestamp: number; accuracy: number | null } | null
  now: number
}): CaptureProblem[] {
  const out: CaptureProblem[] = []
  if (!fixIsFresh(c.fileLastModified, c.now)) out.push('old_photo')
  if (!c.fix) out.push('no_fix')
  else if (!fixIsFresh(c.fix.timestamp, c.now)) out.push('old_fix')
  return out
}

/** WEB. Si la precisión del GPS es floja: se manda igual, pero se avisa. */
export function isPoorAccuracy(accuracy: number | null | undefined): boolean {
  return typeof accuracy !== 'number' || !Number.isFinite(accuracy) || accuracy > POSTER_POOR_ACCURACY_M
}

/** WEB. La hora de la foto: la del archivo si es de ahora mismo; si no, la de ahora. */
export function captureTime(fileLastModified: number | null | undefined, now: number): number {
  return fixIsFresh(fileLastModified, now) ? Math.min(fileLastModified as number, now) : now
}

/** Lo que dice /api/carteles/verificar. Cualquier cosa rara cuenta como revisión a mano. */
export type VerifyOutcome = { status: 'approved' | 'manual' | 'retry'; reason: string | null }

export function parseVerifyResponse(raw: unknown): VerifyOutcome {
  const o = obj(raw)
  const s = o ? o.status : null
  if (s === 'approved' || s === 'manual' || s === 'retry') {
    return { status: s, reason: str(o!.reason)?.slice(0, 200) ?? null }
  }
  return { status: 'manual', reason: null }
}

/**
 * El texto para el `reason` de un `retry`. La ruta manda un código, no una
 * frase: `qr_unreadable` o `too_close`. Uno que no se conozca cae en el texto
 * genérico; nunca se enseña en crudo.
 */
export function retryReasonText(reason: string | null): string {
  if (reason === 'qr_unreadable') return 'No se lee el QR del cartel: acércate un poco y que se vea entero. Haz otra foto.'
  if (reason === 'too_close') return 'Estás demasiado cerca: aléjate un poco para que se vea el escaparate. Haz otra foto.'
  return 'No hemos podido validarla. Prueba con otra foto.'
}

/** La URL de la ruta, de app_config. Solo https: si no, no se llama a nada. */
export function verifyUrlFrom(raw: unknown): string | null {
  const v = typeof raw === 'string' ? raw.replace(/^"|"$/g, '').trim() : null
  if (!v || !/^https:\/\/[^\s/]+\/\S*$/.test(v)) return null
  return v
}

// ============================================================================
// El premio del Vecino (§2.2 reglas 2 y 8)
// ============================================================================

/** Las reglas del paquete gratis. Los valores por defecto son los de la 0124. */
export interface FreePrizeRules {
  types: string[]
  minDiscountPct: number
  maxPoints: number
}

export const DEFAULT_FREE_RULES: FreePrizeRules = {
  types: ['product', 'service', '2x1', 'discount'],
  minDiscountPct: 30,
  maxPoints: 50,
}

/** tier_catalog().free (0124), o las de por defecto si no llega. */
export function freeRulesFrom(catalogFree: unknown): FreePrizeRules {
  const o = obj(catalogFree)
  if (!o) return DEFAULT_FREE_RULES
  const types =
    Array.isArray(o.prize_types) && o.prize_types.every((x) => typeof x === 'string') ? (o.prize_types as string[]) : DEFAULT_FREE_RULES.types
  return {
    types: types.length ? types : DEFAULT_FREE_RULES.types,
    minDiscountPct: num(o.min_discount_pct) ?? DEFAULT_FREE_RULES.minDiscountPct,
    maxPoints: num(o.max_prize_points) ?? DEFAULT_FREE_RULES.maxPoints,
  }
}

export interface PrizeLike {
  prize_type: string
  discount_pct: number | null
  points_cost: number
}

/** Lo que incumple el premio, en el orden en que lo mira prize_free_violation (0124). */
export type FreeViolation = 'type' | 'discount' | 'points'

export function freeViolations(p: PrizeLike, rules: FreePrizeRules = DEFAULT_FREE_RULES): FreeViolation[] {
  const out: FreeViolation[] = []
  if (!rules.types.includes(p.prize_type)) out.push('type')
  if (p.prize_type === 'discount' && (p.discount_pct ?? 0) < rules.minDiscountPct) out.push('discount')
  if (rules.maxPoints > 0 && p.points_cost > rules.maxPoints) out.push('points')
  return out
}

/**
 * «Ajustarlo en un toque»: los cambios mínimos para que el premio pausado
 * quepa en Vecino. null si ya cabe. Igual que en la app:
 * - tipo fuera del paquete (hoy solo `other`) → `product`;
 * - descuento por debajo del mínimo → el mínimo;
 * - más puntos que el máximo → el máximo (bajarle el precio al conductor nunca le perjudica).
 */
export function freePrizeFix(
  p: PrizeLike,
  rules: FreePrizeRules = DEFAULT_FREE_RULES,
): { patch: Partial<PrizeLike>; violations: FreeViolation[] } | null {
  const violations = freeViolations(p, rules)
  if (violations.length === 0) return null
  const patch: Partial<PrizeLike> = {}
  let type = p.prize_type
  if (violations.includes('type')) {
    type = rules.types.includes('product') ? 'product' : rules.types[0]
    patch.prize_type = type
  }
  if (type === 'discount' && (p.discount_pct ?? 0) < rules.minDiscountPct) patch.discount_pct = rules.minDiscountPct
  if (type !== 'discount' && p.discount_pct != null && violations.includes('type')) patch.discount_pct = null
  if (violations.includes('points')) patch.points_cost = rules.maxPoints
  return { patch, violations }
}

/** Los tipos que se ofrecen en el formulario de un Vecino. */
export function freePrizeTypes<T extends string>(all: readonly T[], rules: FreePrizeRules = DEFAULT_FREE_RULES): T[] {
  return all.filter((t) => rules.types.includes(t))
}

/** El texto de las reglas del premio de Vecino (el `vc_prize_rules_hint` de la app). */
export function freeRulesText(rules: FreePrizeRules = DEFAULT_FREE_RULES): string {
  return `Plan Vecino: producto, servicio, 2x1 o descuento de al menos el ${rules.minDiscountPct} %, hasta ${rules.maxPoints} puntos. Cada vale dura 24 h.`
}

// ============================================================================
// Demanda perdida (§2.2 regla 5)
// ============================================================================

/**
 * Ticket medio por categoría, en euros con IVA. Es una ESTIMACIÓN y la pantalla
 * lo dice siempre. Se cambia sin publicar nada con la clave de app_config
 * `sponsor.avg_ticket_eur` ({"restaurant": 18, ...}). Mismas cifras de partida
 * que la app, pendientes de que las valide Erik.
 */
export const DEFAULT_AVG_TICKET_EUR: Record<string, number> = {
  restaurant: 18,
  shop: 20,
  fitness: 10,
  beauty: 25,
  leisure: 15,
  services: 20,
  health: 25,
  automotive: 40,
  other: 15,
}

export function avgTicket(category: string | null | undefined, override?: unknown): number {
  const o = obj(override)
  const key = category && category in DEFAULT_AVG_TICKET_EUR ? category : 'other'
  const fromServer = o ? num(o[key]) : null
  if (fromServer !== null && fromServer > 0 && fromServer < 1000) return fromServer
  return DEFAULT_AVG_TICKET_EUR[key]
}

/**
 * Ventas no captadas: los que intentaron canjear y no pudieron, por el ticket
 * medio. Solo los intentos: los que aparcaron cerca no demuestran que fueran a
 * entrar. null si no hay nada que estimar.
 */
export function lostSalesEstimate(d: LostDemand | null, ticket: number): number | null {
  if (!d || d.quotaBlocked <= 0 || ticket <= 0) return null
  return Math.round(d.quotaBlocked * ticket)
}

/** Si la tarjeta de demanda perdida tiene algo que contar. */
export function hasLostDemand(d: LostDemand | null): boolean {
  return !!d && (d.quotaBlocked > 0 || d.nearbyQualified > 0)
}

// ============================================================================
// El tope semanal de Bronce y Plata (§2.2 regla 4)
// ============================================================================

/** El rango que se puede elegir, o null si este comercio no elige tope. */
export function weeklyLimitRange(q: WeeklyQuota | null): { min: number; max: number; value: number } | null {
  if (!q || (q.tier !== 'bronze' && q.tier !== 'silver')) return null
  if (q.customMin === null || q.base === null || q.base <= 0) return null
  const min = Math.min(q.customMin, q.base)
  const max = q.base
  const value = Math.min(max, Math.max(min, q.custom ?? max))
  return { min, max, value }
}

/** Lo que se manda a sponsor_set_weekly_limit: null cuando elige el máximo (sin tope propio). */
export function weeklyLimitToSend(value: number, range: { min: number; max: number }): number | null {
  const v = Math.min(range.max, Math.max(range.min, Math.round(value)))
  return v >= range.max ? null : v
}

// ============================================================================
// Invitar a otro comercio (§2.2 regla 7, 0126)
// ============================================================================

/** 'V' + 6 caracteres de un md5 en mayúsculas (my_sponsor_invite_code, 0126). */
export function isSponsorInviteCode(code: string): boolean {
  return /^V[0-9A-F]{6}$/.test(code.trim().toUpperCase())
}

/** Si este comercio aún puede decir quién le invitó (sponsor.invite_window_days desde el alta). */
export function inviteWindowOpen(createdAt: string | null | undefined, now: number, windowDays: number): boolean {
  if (!createdAt) return false
  const t = Date.parse(createdAt)
  return Number.isFinite(t) && t >= now - windowDays * 24 * 60 * 60_000
}

/**
 * WEB. El código del alta gratis: el del comercial (?c=CODIGO, que va a
 * claim_sponsor_free y atribuye la ficha a su dueño en bo) o el de otro comercio
 * que invita ('V…', que se canjea después con sponsor_accept_invite).
 */
export function splitAltaCode(raw: string | null | undefined): { seller: string | null; invite: string | null } {
  const c = (raw ?? '').replace(/\s+/g, '').toUpperCase()
  if (!c) return { seller: null, invite: null }
  if (isSponsorInviteCode(c)) return { seller: null, invite: c }
  return { seller: /^[A-Z]{2,12}\d{2}$/.test(c) ? c : null, invite: null }
}

/**
 * WEB. El código del alta al abrir la página, con un borrador guardado o sin él.
 * Prioridad: el `?c=` de la URL (el enlace que acaba de abrir), luego el que ya
 * estaba en el borrador y por último el recordado en `appark_alta_c` (30 días).
 * Un borrador viejo nunca debe tapar el enlace del comercial: sin código,
 * claim_sponsor_free no atribuye la ficha a nadie.
 * `url` y `remembered` llegan ya validados (código de comercial o 'V…').
 */
export function mergeAltaCode(c: { url: string | null | undefined; draft: unknown; remembered: string | null | undefined }): string {
  const norm = (v: unknown): string => (typeof v === 'string' ? v.replace(/\s+/g, '').toUpperCase() : '')
  return norm(c.url) || norm(c.draft) || norm(c.remembered)
}

// ============================================================================
// Errores del servidor → texto
// ============================================================================

/** Los códigos nuevos de 0124-0126, con el texto de la app (vecinoTexts.ts) en español. */
const ERRORS: [string, (raw: string) => string][] = [
  ['FREEMIUM_SIGNUP_OFF', () => 'El alta gratis aún no está abierta para tu cuenta.'],
  ['FREEMIUM_OFF', () => 'Esto aún no está disponible para tu negocio.'],
  ['DUPLICATE_NEARBY', () => 'Ya hay un negocio con ese nombre en esa misma puerta. Si es el tuyo, escríbenos a hola@appark.es.'],
  ['CONTACT_ALREADY_A_SPONSOR', () => 'Ese correo o teléfono ya tiene un negocio en Appark. Entra con esa cuenta o escríbenos a hola@appark.es.'],
  ['ALREADY_A_SPONSOR', () => 'Tu cuenta ya tiene un negocio: abre tu panel.'],
  ['BUSINESS_NAME_REQUIRED', () => 'Escribe el nombre de tu negocio.'],
  ['LOCATION_REQUIRED', () => 'Marca en el mapa dónde está tu puerta.'],
  ['ALTA_EMAIL_INVALID', () => 'Revisa el correo: no parece válido.'],
  ['PRIZE_TYPE_NOT_IN_PLAN', () => 'En el plan Vecino el premio es un producto, un servicio, un 2x1 o un descuento.'],
  ['PRIZE_DISCOUNT_MIN', (r) => `En el plan Vecino el descuento es de al menos el ${errorParams(r, 'PRIZE_DISCOUNT_MIN')[0] ?? 30} %.`],
  ['PRIZE_PAUSED_BY_REPORTS', () => 'Este premio está pausado por avisos de conductores: lo revisamos nosotros.'],
  ['FREE_VOUCHER_ACTIVE', () => 'Ya tienes un vale de 24 h sin usar. Úsalo o espera a que caduque para sacar otro.'],
  ['FREE_VOUCHER_BLOCKED', () => 'Has dejado caducar 2 vales de 24 h: durante unos días no puedes sacar más.'],
  ['CUSTOM_LIMIT_RANGE', (r) => {
    const [min, max] = errorParams(r, 'CUSTOM_LIMIT_RANGE')
    return min != null && max != null ? `Elige un número entre ${min} y ${max}.` : 'Ese número no está en el rango de tu paquete.'
  }],
  ['CUSTOM_LIMIT_NOT_IN_PLAN', () => 'Tu plan no tiene tope semanal propio.'],
  ['POSTER_PENDING', () => 'Ya tenemos una foto tuya en revisión.'],
  ['POSTER_NOT_DUE', () => 'Tu cartel sigue vigente: podrás renovarlo cuando le queden 14 días.'],
  ['INVALID_PHOTO', () => 'La foto no se ha guardado bien. Hazla otra vez.'],
  ['INVALID_META', () => 'La foto no se ha guardado bien. Hazla otra vez.'],
  ['NOT_A_VECINO', () => 'Esto es solo para el plan Vecino.'],
  ['TOO_MANY_REQUESTS', () => 'Ya nos lo has pedido hoy: te escribimos enseguida.'],
  ['INVITE_TOO_LATE', () => 'El código de invitación solo se puede usar durante tu primer mes en Appark.'],
  ['INVITE_CODE_INVALID', () => 'Ese código de invitación no existe. Revísalo con quien te lo dio.'],
  ['ALREADY_INVITED', () => 'Ya usaste un código de invitación.'],
]

/** El texto para un error de las funciones del Vecino, o null si no es uno de ellos. */
export function vecinoErrorText(raw: string): string | null {
  for (const [code, text] of ERRORS) if (raw.includes(code)) return text(raw)
  return null
}

/**
 * Igual, pero sabiendo si quien lo ve es un Vecino: PRIZE_POINTS_LIMIT y
 * PRIZE_LIMIT_REACHED tienen ya un texto en el panel que habla de Plata y Oro,
 * y a un Vecino hay que decirle su regla.
 */
export function vecinoPanelErrorText(raw: string, isVecino: boolean): string | null {
  if (isVecino && raw.includes('PRIZE_POINTS_LIMIT')) {
    return `En el plan Vecino el premio cuesta como mucho ${errorParams(raw, 'PRIZE_POINTS_LIMIT')[0] ?? DEFAULT_FREE_RULES.maxPoints} puntos.`
  }
  if (isVecino && raw.includes('PRIZE_LIMIT_REACHED')) return 'Tu plan admite un premio activo. Pausa el otro para publicar este.'
  return vecinoErrorText(raw)
}

/** Los números que trae un error parametrizado (PRIZE_DISCOUNT_MIN:30, CUSTOM_LIMIT_RANGE:3:10). */
export function errorParams(raw: string, code: string): number[] {
  const m = raw.match(new RegExp(`${code}((?::\\d+)+)`))
  if (!m) return []
  return m[1].split(':').filter(Boolean).map(Number)
}

// ============================================================================
// La subida de plan (§2.2 regla 9). En la web, con precio.
// ============================================================================

/** Lo que dice la tarjeta tras sponsor_upgrade_request, según por dónde le podemos escribir. */
export function upgradeSentText(r: { email: boolean; whatsapp: boolean }): string {
  if (r.email && r.whatsapp) return 'Te enviamos la propuesta por WhatsApp y correo en unos minutos.'
  if (r.email) return 'Te enviamos la propuesta por correo en unos minutos.'
  if (r.whatsapp) return 'Te enviamos la propuesta por WhatsApp en unos minutos.'
  return 'Te enviamos la propuesta: te escribirá tu comercial.'
}
