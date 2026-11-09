/**
 * Textos del panel web que dependen de datos: errores de la base, nombres de
 * paquetes y tipos de premio. Los mensajes de error son los de la app
 * (apps/mobile/src/services/api.ts), en español.
 *
 * Sin imports: lo cargan las pruebas de `node --test`.
 */

export const TIER_NAMES = { bronze: 'Bronce', silver: 'Plata', gold: 'Oro' } as const

export const PRIZE_TYPE_LABELS: Record<string, string> = {
  product: 'Producto',
  service: 'Servicio',
  discount: 'Descuento',
  '2x1': '2x1',
  other: 'Otro',
}

export const VOUCHER_STATUS: Record<string, string> = {
  active: 'Pendiente',
  redeemed: 'Canjeado',
  expired: 'Caducado',
}

const ERRORS: [string, string][] = [
  ['LOCATION_LIMIT_REACHED', 'Tu paquete incluye un número limitado de locales. Con Plata puedes tener 3 y con Oro, todos los que quieras.'],
  ['PRIZE_LIMIT_REACHED', 'Tu paquete incluye un número limitado de premios activos. Con Plata puedes tener 3 y con Oro, todos los que quieras.'],
  ['PRIZE_POINTS_LIMIT', 'Tu paquete limita cuántos puntos puede costar un premio. Con Plata llegas a 300 y con Oro, sin tope.'],
  ['SPONSOR_NOT_LIVE', 'Tu cuenta no está activa ahora mismo, así que no puedes publicar premios. Mira la pestaña «Plan».'],
  ['GOLD_TIER_REQUIRED', 'El banner en la app está incluido en el paquete Oro.'],
  ['GOLD_BANNER_AFTER_PAYMENT', 'El banner se publica a partir del primer cobro.'],
  ['TIER_VIA_BILLING', 'Ya tienes suscripción: el paquete se cambia desde «Facturas y método de pago».'],
  ['CODE_ALREADY_REDEEMED', 'Ese código ya se canjeó.'],
  ['CODE_EXPIRED', 'Ese código ha caducado.'],
  ['CODE_OTHER_SPONSOR', 'Ese código es de otro comercio.'],
  ['CODE_NOT_FOUND', 'No existe ningún vale con ese código.'],
  ['IMAGE_TOO_BIG', 'La imagen pesa más de 5 MB. Prueba con una más pequeña.'],
  ['IMAGE_NOT_SUPPORTED', 'Ese archivo no es una imagen JPG, PNG, GIF o WebP.'],
  ['NEED_POINT', 'Marca en el mapa dónde está el local.'],
]

/** El mensaje para el comercio a partir del error de Supabase (o de un Error propio). */
export function errorMessage(err: unknown, fallback = 'No se ha podido guardar. Inténtalo de nuevo.'): string {
  const msg = String((err as { message?: unknown } | null)?.message ?? err ?? '')
  for (const [code, text] of ERRORS) if (msg.includes(code)) return text
  return fallback
}

/** «12 nov., 10:30» en hora de Madrid. */
export function shortDateTime(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' })
}

/** «12 de noviembre» en hora de Madrid. */
export function longDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' })
}

/** Un número con separador de miles español. */
export function n(v: number | null | undefined): string {
  return (v ?? 0).toLocaleString('es-ES')
}
