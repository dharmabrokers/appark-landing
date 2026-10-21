/**
 * Cuotas de los paquetes de patrocinio, en un solo sitio.
 *
 * Las usan las tarjetas de paquetes y las preguntas frecuentes. Antes
 * estaban escritas a mano en SponsorsSection; con una segunda copia en
 * las preguntas, el día que cambie un precio la web diría dos cosas
 * distintas, y la que citaría un buscador sería justo la vieja.
 *
 * standardFee: precio estándar al mes, sin IVA.
 * founderFee:  precio fundador (30% menos) los 12 primeros meses de pago,
 *              para los comercios que se den de alta en 2026.
 */
export const PLAN_FEES = {
  bronze: { standardFee: 99, founderFee: 69 },
  silver: { standardFee: 199, founderFee: 139 },
  gold: { standardFee: 399, founderFee: 279 },
} as const

export type PlanKey = keyof typeof PLAN_FEES
