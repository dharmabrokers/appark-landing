import { NextResponse } from 'next/server'
import { getCheckoutSession } from '@/lib/stripeApi'
import { asTier } from '@/lib/alta'
import { confirmAltaInCrm } from '@/lib/crmConfirm'

/**
 * Lo que enseña appark.es/alta/listo: si el alta se completó, el paquete, el día del
 * primer cobro y a qué correo entrar. El correo va enmascarado: la URL con el id de la
 * sesión no debería servir para leerlo entero.
 *
 * Si el alta está terminada, además pide al CRM que cree ya el comercio (ready): así
 * entra al momento aunque el webhook de Stripe tarde o falle.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function mask(email: string): string {
  const [user, domain] = email.split('@')
  if (!domain) return email
  return `${user.slice(0, 2)}${'•'.repeat(Math.max(1, user.length - 2))}@${domain}`
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('session_id') ?? ''
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return NextResponse.json({ ok: false }, { status: 400 })
  try {
    const s = await getCheckoutSession(id)
    if (s.metadata?.flow !== 'alta') return NextResponse.json({ ok: false }, { status: 404 })
    const trialEnd = Number(s.metadata?.trial_end)
    const complete = s.status === 'complete'
    // Que pueda entrar ya, sin depender de que el webhook haya llegado.
    const ready = complete ? await confirmAltaInCrm(id) : false
    return NextResponse.json(
      {
        ok: complete,
        ready,
        plan: asTier(s.metadata?.tier),
        firstChargeAt: Number.isFinite(trialEnd) && trialEnd > 0 ? trialEnd * 1000 : null,
        email: s.customer_details?.email ? mask(s.customer_details.email) : null,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    console.error('[alta] session:', err)
    return NextResponse.json({ ok: false }, { status: 502 })
  }
}
