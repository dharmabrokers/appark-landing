import { NextResponse } from 'next/server'
import { sponsorSchema } from '@/lib/schemas'
import { verifyRecaptcha } from '@/lib/recaptcha'

export async function POST(req: Request) {
  try {
    const body = await req.json() as unknown

    const parsed = sponsorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { empresa, email, telefono, tipoNegocio, mensaje, recaptchaToken } = parsed.data

    if (recaptchaToken) {
      const valid = await verifyRecaptcha(recaptchaToken)
      if (!valid) {
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
      }
    }

    const webhookUrl = process.env.N8N_SPONSOR_WEBHOOK_URL
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa,
          email,
          telefono,
          tipoNegocio,
          mensaje,
          timestamp: new Date().toISOString(),
          source: 'appark.es',
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
