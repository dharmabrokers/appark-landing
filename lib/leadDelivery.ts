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

/**
 * Insert a row into a Supabase table via the REST API using the public
 * anon key. Relies on an RLS policy that allows `anon` INSERT on that
 * table (see supabase/migrations/0010_fix_sponsor_leads_anon_insert.sql
 * in the Appark-main repo). No service-role secret is needed here — the
 * anon key is already public. This is what lands leads directly in the
 * CRM pipeline instead of only emailing them.
 */
async function supabaseInsert(table: string, row: Record<string, unknown>): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return false
  try {
    const res = await fetch(`${url}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    })
    if (!res.ok) {
      console.error(`[leadDelivery] supabase insert into ${table} failed:`, res.status, await res.text().catch(() => ''))
      return false
    }
    return true
  } catch (err) {
    console.error(`[leadDelivery] supabase insert into ${table} threw:`, err)
    return false
  }
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
export async function deliverSponsorLead(data: {
  empresa: string
  email: string
  telefono?: string
  tipoNegocio?: string
  mensaje?: string
  language: string
}): Promise<LeadDeliveryResult> {
  const webhookUrl = process.env.N8N_SPONSOR_WEBHOOK_URL
  const hasEmail = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const configured = !!webhookUrl || hasEmail || hasSupabase

  const payload = { ...data, timestamp: new Date().toISOString(), source: 'appark.es', type: 'sponsor_contact' }

  // Row for the CRM pipeline (public.sponsor_leads). Column names must
  // match the table; `status: 'lead'` is the first pipeline stage.
  const leadRow = {
    empresa: data.empresa,
    email: data.email,
    telefono: data.telefono || null,
    tipo_negocio: data.tipoNegocio || null,
    mensaje: data.mensaje || null,
    language: data.language,
    source: 'appark.es',
    status: 'lead',
  }

  // Pretty rows for the internal notification email.
  const emailRows = {
    Empresa: data.empresa,
    email: data.email,
    'Teléfono': data.telefono,
    'Tipo de negocio': data.tipoNegocio,
    Mensaje: data.mensaje,
    Idioma: data.language,
  }

  const results = await Promise.all([
    hasSupabase ? supabaseInsert('sponsor_leads', leadRow) : Promise.resolve<boolean | null>(null),
    webhookUrl ? sendWebhook(webhookUrl, payload) : Promise.resolve<boolean | null>(null),
    hasEmail
      ? sendEmail('🤝 Nuevo interés de sponsor en Appark', emailRows)
      : Promise.resolve<boolean | null>(null),
  ])

  if (!configured) {
    console.error('[leadDelivery] NO delivery channel configured for sponsor lead:', payload)
  }

  const delivered = results.some((r) => r === true)
  return { delivered, configured }
}
