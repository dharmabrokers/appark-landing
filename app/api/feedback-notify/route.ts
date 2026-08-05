import { NextResponse } from 'next/server'
import { deliverAppFeedback } from '@/lib/leadDelivery'

// SMTP (nodemailer) needs the Node.js runtime, not edge.
export const runtime = 'nodejs'

/**
 * Called by a Supabase Database Webhook on INSERT into public.app_feedback
 * (configured in the Supabase dashboard, not in this repo — see Database →
 * Webhooks). Not reCAPTCHA-gated like the public forms: this is a
 * server-to-server call, so it's a shared-secret header instead.
 */
export async function POST(req: Request) {
  const secret = process.env.SUPABASE_WEBHOOK_SECRET
  if (!secret || req.headers.get('x-webhook-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await req.json()) as { type?: string; table?: string; record?: Record<string, unknown> }

    if (body.type !== 'INSERT' || body.table !== 'app_feedback' || !body.record) {
      return NextResponse.json({ ignored: true })
    }

    await deliverAppFeedback(body.record)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
