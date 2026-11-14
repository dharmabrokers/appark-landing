import { NextResponse } from 'next/server'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { CRM_URL } from '@/lib/colabora'

/**
 * appark.es/ronda → CRM (migración 0120 del CRM).
 *
 * Comprueba el reCAPTCHA y el campo trampa y pasa la solicitud al CRM, que la guarda y
 * avisa a Erik. Solo se reenvían los campos del formulario, nunca el cuerpo tal cual. La
 * respuesta nunca dice si la persona ya estaba: solo «recibido».
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FIELDS = ['full_name', 'email', 'phone', 'referrer', 'ticket_range', 'message', 'risk_ack', 'privacy'] as const
const FALLBACK = 'No se ha podido enviar. Escríbenos a hola@appark.es.'

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = ((await req.json()) ?? {}) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, mensaje: 'Petición incorrecta.' }, { status: 400 })
  }
  if (typeof body.website === 'string' && body.website.trim() !== '') return NextResponse.json({ ok: true })

  const token = typeof body.recaptchaToken === 'string' ? body.recaptchaToken : ''
  if (token && !(await verifyRecaptcha(token))) {
    return NextResponse.json({ ok: false, mensaje: 'No hemos podido comprobar que no eres un robot. Prueba otra vez.' }, { status: 400 })
  }

  const payload: Record<string, unknown> = {}
  for (const k of FIELDS) if (k in body) payload[k] = body[k]

  try {
    const res = await fetch(`${CRM_URL}/api/ronda`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: AbortSignal.timeout(9000),
    })
    const out = (await res.json().catch(() => null)) as { ok?: boolean; mensaje?: string } | null
    if (!res.ok || !out?.ok) {
      if (res.status >= 500) console.error('[ronda] CRM:', res.status, out?.mensaje ?? '')
      return NextResponse.json({ ok: false, mensaje: out?.mensaje ?? FALLBACK }, { status: res.status >= 400 ? res.status : 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[ronda] CRM:', err)
    return NextResponse.json({ ok: false, mensaje: FALLBACK }, { status: 502 })
  }
}
