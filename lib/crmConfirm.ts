/**
 * Pide al CRM que cree ya el comercio de un alta terminada (Appark-main,
 * apps/crm/src/app/api/alta/confirm). Normalmente el webhook de Stripe ya lo
 * ha hecho; esto es para que el acceso sea inmediato aunque el webhook
 * falle o llegue tarde. El CRM no se fía de nada: pregunta a Stripe por la
 * sesión antes de actuar.
 *
 * Nunca rompe la página: si el CRM no contesta, el webhook sigue ahí.
 */
const CRM_URL = (process.env.CRM_URL || 'https://appark-crm.vercel.app').replace(/\/+$/, '')

export async function confirmAltaInCrm(sessionId: string): Promise<boolean> {
  try {
    const res = await fetch(`${CRM_URL}/api/alta/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
      cache: 'no-store',
      signal: AbortSignal.timeout(9000),
    })
    const body = (await res.json().catch(() => null)) as { ready?: boolean; reason?: string } | null
    if (!body?.ready) console.error('[alta] confirm:', res.status, body?.reason ?? '')
    return !!body?.ready
  } catch (err) {
    console.error('[alta] confirm:', err)
    return false
  }
}
