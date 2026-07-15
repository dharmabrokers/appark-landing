import { NextResponse } from 'next/server'
import { earlyAccessSchema } from '@/lib/schemas'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { deliverEarlyAccessLead } from '@/lib/leadDelivery'

// SMTP (nodemailer) needs the Node.js runtime, not edge.
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown

    const parsed = earlyAccessSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { nombre, email, acceptsUpdates, language, recaptchaToken } = parsed.data

    if (!acceptsUpdates) {
      return NextResponse.json({ error: 'Consent required' }, { status: 400 })
    }

    if (recaptchaToken) {
      const valid = await verifyRecaptcha(recaptchaToken)
      if (!valid) {
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
      }
    }

    const { delivered, configured } = await deliverEarlyAccessLead({
      nombre,
      email,
      acceptsUpdates,
      language,
    })

    // A configured channel that failed to deliver is a real error the
    // visitor should see (so they can email us instead). Nothing
    // configured is our setup problem — logged loudly in leadDelivery;
    // don't punish the visitor for it.
    if (configured && !delivered) {
      return NextResponse.json({ error: 'Delivery failed' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
