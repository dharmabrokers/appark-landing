import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  freemiumOnFrom, parseWeeklyQuota, parseLostDemand, parsePosterStatus, parseTierCatalog, posterCard, posterPath, posterMeta,
  fitWithin, fixIsFresh, captureProblems, captureTime, isPoorAccuracy, parseVerifyResponse, retryReasonText, verifyUrlFrom,
  freeRulesFrom, freeViolations, freePrizeFix, freePrizeTypes, DEFAULT_FREE_RULES, avgTicket, lostSalesEstimate, hasLostDemand,
  weeklyLimitRange, weeklyLimitToSend, isSponsorInviteCode, inviteWindowOpen, splitAltaCode, vecinoErrorText,
  vecinoPanelErrorText, errorParams, upgradeSentText, mergeAltaCode, POSTER_FIX_MAX_AGE_MS,
} from './vecino.ts'

const NOW = Date.UTC(2026, 10, 24, 12, 0, 0)

// ── Interruptor ────────────────────────────────────────────────
test('el interruptor solo está encendido con un true de verdad', () => {
  assert.equal(freemiumOnFrom({ freemium_sponsors: true }), true)
  assert.equal(freemiumOnFrom(true), true)
  assert.equal(freemiumOnFrom({ freemium_sponsors: 'true' }), false)
  assert.equal(freemiumOnFrom({ freemium_drivers: true }), false)
  assert.equal(freemiumOnFrom(null), false)
  assert.equal(freemiumOnFrom([true]), false)
})

// ── Lecturas del servidor ─────────────────────────────────────
test('el cupo semanal se lee y lo raro es «no se sabe»', () => {
  const q = parseWeeklyQuota({ tier: 'free', cap: 2, used: 2, left: 0, base: 1, bonus: 1, custom: null, custom_min: null, renews_at: '2026-11-30T00:00:00Z' })
  assert.deepEqual(q, { tier: 'free', cap: 2, used: 2, left: 0, base: 1, bonus: 1, custom: null, customMin: null, renewsAt: '2026-11-30T00:00:00Z' })
  assert.equal(parseWeeklyQuota({ tier: 'free' }), null)
  assert.equal(parseWeeklyQuota('x'), null)
  assert.equal(parseWeeklyQuota({ tier: 'gold', cap: null, used: '3', left: null })?.used, 3)
})

test('la demanda perdida necesita sus dos cifras', () => {
  assert.deepEqual(parseLostDemand({ days: 7, quota_blocked: 6, nearby_qualified: 19, avg_distance_m: 120 }), { days: 7, quotaBlocked: 6, nearbyQualified: 19, avgDistanceM: 120 })
  assert.equal(parseLostDemand({ quota_blocked: 6 }), null)
  assert.equal(hasLostDemand(parseLostDemand({ quota_blocked: 0, nearby_qualified: 0 })), false)
  assert.equal(hasLostDemand(parseLostDemand({ quota_blocked: 0, nearby_qualified: 1 })), true)
})

test('tier_catalog es un objeto por paquete; los que no traen números se ignoran', () => {
  const c = parseTierCatalog({
    free: { locations: 1, prizes: 1, redemptions_week: 1, max_prize_points: 50, prize_types: ['product'] },
    bronze: { locations: 1, prizes: 3, redemptions_week: 10, max_prize_points: 150 },
    gold: { locations: 0, prizes: 0, redemptions_week: 0, max_prize_points: 0 },
    silver: { prizes: 'x' },
  })
  assert.deepEqual(c.free, { locations: 1, prizes: 1, redemptionsWeek: 1, maxPrizePoints: 50 })
  assert.equal(c.bronze?.redemptionsWeek, 10)
  assert.equal(c.gold?.prizes, 0)
  assert.equal(c.silver, undefined)
  assert.deepEqual(parseTierCatalog([{ tier: 'bronze' }]), {})
})

// ── Cartel ─────────────────────────────────────────────────────
test('la tarjeta del cartel sigue el estado del servidor', () => {
  const base = { status: null, since: null, expiresAt: null, daysLeft: null, canRenew: true }
  assert.deepEqual(posterCard(base), { kind: 'start', rejected: false })
  assert.deepEqual(posterCard({ ...base, status: 'rejected' }), { kind: 'start', rejected: true })
  assert.deepEqual(posterCard({ ...base, status: 'pending', canRenew: false }), { kind: 'pending' })
  assert.deepEqual(posterCard({ ...base, status: 'verified', since: 'x', expiresAt: 'y', daysLeft: 40, canRenew: false }), { kind: 'verified', daysLeft: 40 })
  assert.deepEqual(posterCard({ ...base, status: 'verified', since: 'x', expiresAt: 'y', daysLeft: 10 }), { kind: 'renew', daysLeft: 10, expired: false })
  assert.deepEqual(posterCard({ ...base, status: 'verified', since: 'x', expiresAt: 'y', daysLeft: -2 }), { kind: 'renew', daysLeft: -2, expired: true })
  assert.deepEqual(posterCard({ ...base, status: 'verified', since: 'x', canRenew: false }), { kind: 'legacy' })
  assert.equal(parsePosterStatus({ status: 'pending', can_renew: 'yes' })?.canRenew, false)
})

test('la ruta del cartel casa con el patrón de sponsor_submit_poster (0126)', () => {
  const uid = '1c31edbe-6179-42b0-8609-825fbe7da779'
  const path = posterPath(uid, NOW)
  assert.equal(path, `carteles/${uid}/cartel_${NOW}.jpg`)
  const url = `https://vsxldnwhwaanuvjwnwhl.supabase.co/storage/v1/object/public/creative-assets/${path}`
  const re = new RegExp(`^https://[a-z0-9]+\\.supabase\\.co/storage/v1/object/public/creative-assets/carteles/${uid}/[A-Za-z0-9._-]+\\.(jpg|jpeg|png|webp|heic)$`)
  assert.ok(re.test(url))
})

test('p_meta lleva la posición redondeada, la precisión y la hora de la foto', () => {
  const m = posterMeta({ latitude: 39.56961234567, longitude: 2.65023456789, accuracy: 12.6 }, NOW)
  assert.deepEqual(m, { lat: 39.569612, lng: 2.650235, accuracy_m: 13, taken_at: '2026-11-24T12:00:00.000Z', source: 'camera', platform: 'web' })
  assert.equal(posterMeta({ latitude: 1, longitude: 2, accuracy: null }, NOW).accuracy_m, null)
})

test('la foto se reduce a 2800 px como mucho y nunca se agranda', () => {
  assert.deepEqual(fitWithin(4032, 3024), { width: 2800, height: 2100 })
  assert.deepEqual(fitWithin(1200, 1600), { width: 1200, height: 1600 })
  assert.deepEqual(fitWithin(0, 100), { width: 0, height: 0 })
})

test('captura del momento: foto y GPS de los últimos 2 minutos', () => {
  const fresh = NOW - 30_000
  assert.deepEqual(captureProblems({ fileLastModified: fresh, fix: { timestamp: NOW - 5_000, accuracy: 15 }, now: NOW }), [])
  // Una foto de la galería llega con la fecha en que se hizo.
  assert.deepEqual(captureProblems({ fileLastModified: NOW - 3 * 86400_000, fix: { timestamp: NOW, accuracy: 15 }, now: NOW }), ['old_photo'])
  assert.deepEqual(captureProblems({ fileLastModified: undefined, fix: null, now: NOW }), ['old_photo', 'no_fix'])
  assert.deepEqual(captureProblems({ fileLastModified: fresh, fix: { timestamp: NOW - POSTER_FIX_MAX_AGE_MS - 1, accuracy: 5 }, now: NOW }), ['old_fix'])
  // Un reloj del archivo adelantado más de un minuto tampoco vale.
  assert.equal(fixIsFresh(NOW + 2 * 60_000, NOW), false)
})

test('la hora de la foto es la del archivo si es de ahora mismo', () => {
  assert.equal(captureTime(NOW - 20_000, NOW), NOW - 20_000)
  assert.equal(captureTime(NOW + 30_000, NOW), NOW)
  assert.equal(captureTime(NOW - 86400_000, NOW), NOW)
})

test('precisión floja: más de 100 m o sin dato', () => {
  assert.equal(isPoorAccuracy(20), false)
  assert.equal(isPoorAccuracy(150), true)
  assert.equal(isPoorAccuracy(null), true)
})

test('la respuesta de la ruta: solo approved/manual/retry; lo demás, revisión manual', () => {
  assert.deepEqual(parseVerifyResponse({ status: 'approved' }), { status: 'approved', reason: null })
  assert.deepEqual(parseVerifyResponse({ status: 'retry', reason: 'too_close' }), { status: 'retry', reason: 'too_close' })
  assert.deepEqual(parseVerifyResponse({ error: 'UNAUTHORIZED' }), { status: 'manual', reason: null })
  assert.deepEqual(parseVerifyResponse(null), { status: 'manual', reason: null })
  assert.match(retryReasonText('qr_unreadable'), /QR/)
  assert.match(retryReasonText('too_close'), /aléjate/)
  assert.match(retryReasonText('ai_screen'), /otra foto/)
})

test('la URL de la ruta solo vale en https', () => {
  assert.equal(verifyUrlFrom('https://appark-crm.vercel.app/api/carteles/verificar'), 'https://appark-crm.vercel.app/api/carteles/verificar')
  assert.equal(verifyUrlFrom('"https://appark-crm.vercel.app/api/carteles/verificar"'), 'https://appark-crm.vercel.app/api/carteles/verificar')
  assert.equal(verifyUrlFrom('http://appark-crm.vercel.app/x'), null)
  assert.equal(verifyUrlFrom(null), null)
  assert.equal(verifyUrlFrom({ url: 'https://x.y/z' }), null)
})

// ── Límites del Vecino ────────────────────────────────────────
test('las reglas del Vecino salen de tier_catalog().free o, si no, las de la 0124', () => {
  assert.deepEqual(freeRulesFrom(undefined), DEFAULT_FREE_RULES)
  assert.deepEqual(freeRulesFrom({ prize_types: ['product', '2x1'], min_discount_pct: 40, max_prize_points: 60 }), { types: ['product', '2x1'], minDiscountPct: 40, maxPoints: 60 })
  assert.deepEqual(freeRulesFrom({ prize_types: [] }).types, DEFAULT_FREE_RULES.types)
})

test('el premio de Vecino: producto, servicio, 2x1 o descuento ≥30 %, hasta 50 puntos', () => {
  assert.deepEqual(freeViolations({ prize_type: 'product', discount_pct: null, points_cost: 50 }), [])
  assert.deepEqual(freeViolations({ prize_type: 'discount', discount_pct: 30, points_cost: 10 }), [])
  assert.deepEqual(freeViolations({ prize_type: 'discount', discount_pct: 20, points_cost: 10 }), ['discount'])
  assert.deepEqual(freeViolations({ prize_type: 'other', discount_pct: null, points_cost: 80 }), ['type', 'points'])
  assert.deepEqual(freePrizeTypes(['product', 'service', 'discount', '2x1', 'other'] as const), ['product', 'service', 'discount', '2x1'])
})

test('ajustar el premio pausado hace los cambios mínimos', () => {
  assert.equal(freePrizeFix({ prize_type: 'service', discount_pct: null, points_cost: 40 }), null)
  assert.deepEqual(freePrizeFix({ prize_type: 'other', discount_pct: 10, points_cost: 120 })?.patch, { prize_type: 'product', discount_pct: null, points_cost: 50 })
  assert.deepEqual(freePrizeFix({ prize_type: 'discount', discount_pct: 15, points_cost: 30 })?.patch, { discount_pct: 30 })
})

// ── Demanda perdida ───────────────────────────────────────────
test('la estimación de ventas usa solo los intentos y el ticket de la categoría', () => {
  const d = { days: 7, quotaBlocked: 6, nearbyQualified: 19, avgDistanceM: null }
  assert.equal(lostSalesEstimate(d, avgTicket('restaurant')), 108)
  assert.equal(lostSalesEstimate({ ...d, quotaBlocked: 0 }, 18), null)
  assert.equal(avgTicket('restaurant', { restaurant: 22 }), 22)
  assert.equal(avgTicket('restaurant', { restaurant: 5000 }), 18)
  assert.equal(avgTicket('raro'), 15)
})

// ── Tope semanal ──────────────────────────────────────────────
test('Bronce y Plata eligen su tope entre el mínimo y el del paquete', () => {
  const q = { tier: 'bronze', cap: 10, used: 0, left: 10, base: 10, bonus: 0, custom: null, customMin: 3, renewsAt: null }
  assert.deepEqual(weeklyLimitRange(q), { min: 3, max: 10, value: 10 })
  assert.deepEqual(weeklyLimitRange({ ...q, custom: 5 }), { min: 3, max: 10, value: 5 })
  assert.equal(weeklyLimitRange({ ...q, tier: 'free' }), null)
  assert.equal(weeklyLimitRange({ ...q, customMin: null }), null)
  assert.equal(weeklyLimitToSend(10, { min: 3, max: 10 }), null)
  assert.equal(weeklyLimitToSend(1, { min: 3, max: 10 }), 3)
})

// ── Códigos ───────────────────────────────────────────────────
test('el código del alta: el del comercial va a la atribución; el de otro comercio, a la invitación', () => {
  assert.deepEqual(splitAltaCode('pedro07'), { seller: 'PEDRO07', invite: null })
  assert.deepEqual(splitAltaCode(' v1a2b3c '), { seller: null, invite: 'V1A2B3C' })
  assert.deepEqual(splitAltaCode('APK123456'), { seller: null, invite: null })
  assert.deepEqual(splitAltaCode(''), { seller: null, invite: null })
  assert.equal(isSponsorInviteCode('V12345G'), false)
})

test('un borrador guardado no tapa el enlace del comercial', () => {
  // Borrador vacío (p. ej. guardado desde la pantalla cerrada) + ?c= de la URL.
  assert.equal(mergeAltaCode({ url: 'PEDRO07', draft: '', remembered: null }), 'PEDRO07')
  // Borrador con un código y otro ?c=: gana el enlace que acaba de abrir.
  assert.equal(mergeAltaCode({ url: 'LUCIA12', draft: 'PEDRO07', remembered: 'PEDRO07' }), 'LUCIA12')
  // Borrador sin código, sin ?c=, con el recordado de 30 días.
  assert.equal(mergeAltaCode({ url: null, draft: undefined, remembered: 'PEDRO07' }), 'PEDRO07')
  // Sin URL, el del borrador manda sobre el recordado.
  assert.equal(mergeAltaCode({ url: null, draft: ' v1a2b3c ', remembered: 'PEDRO07' }), 'V1A2B3C')
  assert.equal(mergeAltaCode({ url: undefined, draft: 42, remembered: null }), '')
})

test('la invitación solo se canjea el primer mes', () => {
  const created = new Date(NOW - 10 * 86400_000).toISOString()
  assert.equal(inviteWindowOpen(created, NOW, 30), true)
  assert.equal(inviteWindowOpen(created, NOW, 7), false)
  assert.equal(inviteWindowOpen(null, NOW, 30), false)
})

// ── Errores ───────────────────────────────────────────────────
test('los errores nuevos tienen texto; los parametrizados, con su número', () => {
  assert.match(vecinoErrorText('FREEMIUM_SIGNUP_OFF') ?? '', /aún no está abierta/)
  assert.match(vecinoErrorText('P0001: CONTACT_ALREADY_A_SPONSOR') ?? '', /ya tiene un negocio/)
  assert.match(vecinoErrorText('PRIZE_DISCOUNT_MIN:35') ?? '', /35 %/)
  assert.match(vecinoErrorText('CUSTOM_LIMIT_RANGE:3:10') ?? '', /entre 3 y 10/)
  assert.equal(vecinoErrorText('PRIZE_LIMIT_REACHED'), null)
  assert.match(vecinoPanelErrorText('PRIZE_POINTS_LIMIT:50', true) ?? '', /50 puntos/)
  assert.equal(vecinoPanelErrorText('PRIZE_POINTS_LIMIT:150', false), null)
  assert.deepEqual(errorParams('x CUSTOM_LIMIT_RANGE:5:30 y', 'CUSTOM_LIMIT_RANGE'), [5, 30])
})

test('la confirmación de la subida de plan dice por dónde llega', () => {
  assert.match(upgradeSentText({ email: true, whatsapp: true }), /WhatsApp y correo/)
  assert.match(upgradeSentText({ email: false, whatsapp: false }), /comercial/)
})
