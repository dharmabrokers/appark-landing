import { NextResponse } from 'next/server'
import { sponsorSchema } from '@/lib/schemas'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { deliverSponsorLead } from '@/lib/leadDelivery'

// SMTP (nodemailer) needs the Node.js runtime, not edge.
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown

    const parsed = sponsorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { empresa, email, telefono, tipoNegocio, mensaje, language, recaptchaToken } = parsed.data

    if (recaptchaToken) {
      const valid = await verifyRecaptcha(recaptchaToken)
      if (!valid) {
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
      }
    }

    const { delivered, configured } = await deliverSponsorLead({
      empresa,
      email,
      telefono,
      tipoNegocio,
      mensaje,
      language,
    })

    if (configured && !delivered) {
      return NextResponse.json({ error: 'Delivery failed' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
