/**
 * appark.es/alta — el alta del comercio con la tarjeta registrada en Stripe.
 *
 * El primer mes es gratis: Stripe no cobra hasta el día 31. Lo que viaja a Stripe y
 * lo que espera el webhook del CRM (Appark-main, apps/crm/src/lib/alta.ts) es un
 * contrato: si cambia aquí, cambia allí.
 *
 * Sin imports de servidor: lo usan la página y la API.
 */

export type Tier = 'bronze' | 'silver' | 'gold'
export const TIERS: readonly Tier[] = ['bronze', 'silver', 'gold']

export function asTier(v: unknown): Tier | null {
  return typeof v === 'string' && (TIERS as readonly string[]).includes(v) ? (v as Tier) : null
}

/** Los mismos números que el servidor aplica (migración 0058) y que enseña la home. */
export const PLANS: Record<Tier, { standard: number; founder: number; pack: string; redemptionsWeek: number; maxPrizePoints: number }> = {
  bronze: { standard: 99, founder: 69, pack: 'appark_bronce', redemptionsWeek: 5, maxPrizePoints: 150 },
  silver: { standard: 199, founder: 139, pack: 'appark_plata', redemptionsWeek: 15, maxPrizePoints: 300 },
  gold: { standard: 399, founder: 279, pack: 'appark_oro', redemptionsWeek: 0, maxPrizePoints: 0 },
}

/** El precio fundador se puede activar hasta el 31-12-2026 (los cupones caducan entonces). */
export const FOUNDER_UNTIL = Date.UTC(2027, 0, 1)
export function isFounder(now = Date.now()): boolean {
  return now < FOUNDER_UNTIL
}

export const TRIAL_DAYS = 30

/** La versión de las condiciones de patrocinio que se aceptan (app/legal/patrocinio). */
export const TERMS_VERSION = '2026-10-15'

/**
 * Cuándo cobra Stripe por primera vez: a los 30 días, o el día que acababa la prueba
 * sin tarjeta de un comercio que ya estaba (si faltan más de 48 h; si no, hoy).
 */
export function firstChargeAt(now: number, existingTrialEnd?: string | null): { at: number; trial: boolean } {
  if (existingTrialEnd) {
    const end = Date.parse(existingTrialEnd)
    if (Number.isFinite(end) && end > now + 48 * 3600 * 1000) return { at: end, trial: true }
    if (Number.isFinite(end)) return { at: now, trial: false }
  }
  return { at: now + TRIAL_DAYS * 86400 * 1000, trial: true }
}

/** Códigos y tokens: solo lo que pueden ser. Lo demás se ignora. */
export function cleanCode(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const c = v.trim().toUpperCase()
  return /^[A-Z]{2,12}\d{2}$/.test(c) ? c : null
}
export function cleanToken(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim().toLowerCase()
  return /^[0-9a-f]{32}$/.test(t) ? t : null
}
export function cleanRef(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const r = v.replace(/\s+/g, '').toUpperCase()
  return /^[A-Z0-9]{4,12}$/.test(r) ? r : null
}

/** Las categorías de la app (sponsors.category). La página las enseña traducidas. */
export const CATEGORIES = ['restaurant', 'shop', 'services', 'leisure', 'beauty', 'fitness', 'health', 'automotive', 'other'] as const
export type Category = (typeof CATEGORIES)[number]

/** Los idiomas de Stripe Checkout: el catalán no está, va en castellano. */
export function checkoutLocale(lang: string): 'es' | 'en' | 'de' {
  return lang === 'en' ? 'en' : lang === 'de' ? 'de' : 'es'
}

/** «14 de noviembre» en la lengua de la página. */
export function longDate(ms: number, lang: string): string {
  const locale = lang === 'ca' ? 'ca-ES' : lang === 'en' ? 'en-GB' : lang === 'de' ? 'de-DE' : 'es-ES'
  return new Date(ms).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' })
}

/** El atribuido se recuerda 30 días: si vuelve más tarde, sigue siendo del mismo comercial. */
export const CODE_STORAGE_KEY = 'appark_alta_c'
export const CODE_TTL_MS = 30 * 86400 * 1000
