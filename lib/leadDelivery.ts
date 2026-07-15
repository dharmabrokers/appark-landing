import nodemailer from 'nodemailer'

/**
 * Robust lead delivery. A lead must NEVER be silently dropped: we try
 * every configured channel and only report failure if a configured
 * channel errored and none succeeded.
 *
 * Channels (configure at least one in Vercel env):
 *  1. n8n webhook  → N8N_*_WEBHOOK_URL
 *  2. Email (SMTP) → SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
 *                    + LEADS_TO (inbox that receives every lead)
 *
 * Returns { delivered, configured } so the caller can decide the HTTP
 * status: configured-but-all-failed is a real 500; nothing-configured
 * is a setup error we log loudly but don't inflict on the visitor.
 */

export interface LeadDeliveryResult {
  delivered: boolean
  configured: boolean
}

let transporter: nodemailer.Transporter | null = null
function getTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null
  if (!transporter) {
    const port = parseInt(process.env.SMTP_PORT || '465', 10)
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = implicit TLS, 587 = STARTTLS
      auth: { user, pass },
    })
  }
  return transporter
}

async function sendWebhook(url: string, payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch {
    return false
  }
}

async function sendEmail(subject: string, rows: Record<string, unknown>): Promise<boolean> {
  const tx = getTransporter()
  const to = process.env.LEADS_TO || process.env.SMTP_USER
  if (!tx || !to) return false
  const from = process.env.SMTP_USER as string
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:520px">
      <h2 style="color:#0A2A36;margin:0 0 12px">${subject}</h2>
      <table style="width:100%;border-collapse:collapse">
        ${Object.entries(rows)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:7px 10px;background:#FBF6EE;font-weight:700;color:#0A2A36;border:1px solid #eadfce">${k}</td><td style="padding:7px 10px;border:1px solid #eadfce;color:#45626C">${String(v ?? '—')}</td></tr>`,
          )
          .join('')}
      </table>
    </div>`
  try {
    await tx.sendMail({ from: `Appark <${from}>`, to, replyTo: String(rows.email || from), subject, html })
    return true
  } catch (err) {
    console.error('[leadDelivery] email failed:', err)
    return false
  }
}

/** Deliver an early-access lead through every configured channel. */
export async function deliverEarlyAccessLead(data: {
  nombre: string
  email: string
  acceptsUpdates: boolean
  language: string
}): Promise<LeadDeliveryResult> {
  const webhookUrl = process.env.N8N_EARLY_ACCESS_WEBHOOK_URL
  const hasEmail = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  const configured = !!webhookUrl || hasEmail

  const payload = { ...data, timestamp: new Date().toISOString(), source: 'appark.es', type: 'early_access' }

  const results = await Promise.all([
    webhookUrl ? sendWebhook(webhookUrl, payload) : Promise.resolve<boolean | null>(null),
    hasEmail
      ? sendEmail('🎉 Nuevo registro en la lista de espera de Appark', {
          Nombre: data.nombre,
          email: data.email,
          Idioma: data.language,
          'Acepta comunicaciones': data.acceptsUpdates ? 'Sí' : 'No',
        })
      : Promise.resolve<boolean | null>(null),
  ])

  if (!configured) {
    console.error('[leadDelivery] NO delivery channel configured — set N8N_EARLY_ACCESS_WEBHOOK_URL or SMTP_* in Vercel env. Lead:', payload)
  }

  const delivered = results.some((r) => r === true)
  return { delivered, configured }
}

/** Deliver a sponsor-contact lead through every configured channel. */
export async function deliverSponsorLead(data: Record<string, unknown>): Promise<LeadDeliveryResult> {
  const webhookUrl = process.env.N8N_SPONSOR_WEBHOOK_URL
  const hasEmail = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  const configured = !!webhookUrl || hasEmail

  const payload = { ...data, timestamp: new Date().toISOString(), source: 'appark.es', type: 'sponsor_contact' }

  const results = await Promise.all([
    webhookUrl ? sendWebhook(webhookUrl, payload) : Promise.resolve<boolean | null>(null),
    hasEmail
      ? sendEmail('🤝 Nuevo interés de sponsor en Appark', data)
      : Promise.resolve<boolean | null>(null),
  ])

  if (!configured) {
    console.error('[leadDelivery] NO delivery channel configured for sponsor lead:', payload)
  }

  const delivered = results.some((r) => r === true)
  return { delivered, configured }
}
