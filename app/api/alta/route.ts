import { NextResponse } from 'next/server'
import { altaSchema } from '@/lib/schemas'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { rpc, RpcError } from '@/lib/supabaseRpc'
import { createCheckoutSession, StripeError } from '@/lib/stripeApi'
import { PLANS, TERMS_VERSION, checkoutLocale, cleanCode, cleanRef, cleanToken, firstChargeAt, isFounder, longDate, type Tier } from '@/lib/alta'

/**
 * appark.es/alta → Stripe Checkout.
 *
 * 1. Guarda o actualiza la ficha del comercio en el CRM y la atribuye al comercial
 *    del enlace (alta_register, migración 0093).
 * 2. Crea la sesión de Checkout: suscripción mensual, 30 días de prueba (no cobra
 *    hasta el día 31), cupón fundador aplicado, IVA automático y CIF.
 * 3. Devuelve la URL de Stripe.
 *
 * La cuenta del comercio la crea el webhook del CRM cuando Stripe confirma el alta.
 *
 * Variables (Vercel):
 *   STRIPE_SECRET_KEY            clave RESTRINGIDA (solo Checkout Sessions: write)
 *   STRIPE_PRICE_BRONZE|SILVER|GOLD   opcionales; por defecto, los precios reales
 *   STRIPE_COUPON_BRONZE|SILVER|GOLD  opcionales; por defecto, appark_<tier>_fundador_13m
 *   STRIPE_TOS_CONSENT=1         pide además la casilla de Stripe (necesita la URL de
 *                                las condiciones en Stripe → Public details)
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PRICE_DEFAULTS: Record<Tier, string> = {
  bronze: 'price_1UDhJaPhytERRtFjcjetvskt',
  silver: 'price_1UDhJbPhytERRtFjgTt3l5uc',
  gold: 'price_1UDhJcPhytERRtFjWsZUex5m',
}
const COUPON_DEFAULTS: Record<Tier, string> = {
  bronze: 'appark_bronce_fundador_13m',
  silver: 'appark_plata_fundador_13m',
  gold: 'appark_oro_fundador_13m',
}
const envFor = (prefix: string, tier: Tier) => process.env[`${prefix}_${tier.toUpperCase()}`]

const SUBMIT_TEXT: Record<string, (d: string) => string> = {
  es: (d) => `Hoy no se te cobra nada. El primer cobro será el ${d}. Puedes cancelar antes con un clic desde el correo de Stripe.`,
  en: (d) => `You won't be charged today. Your first payment will be on ${d}. Cancel any time before with one click from the Stripe email.`,
  de: (d) => `Heute wird nichts abgebucht. Die erste Zahlung erfolgt am ${d}. Du kannst vorher mit einem Klick über die E-Mail von Stripe kündigen.`,
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
  const parsed = altaSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const d = parsed.data

  if (d.recaptchaToken && !(await verifyRecaptcha(d.recaptchaToken))) {
    return NextResponse.json({ error: 'recaptcha' }, { status: 400 })
  }

  const token = cleanToken(d.token)
  const code = cleanCode(d.code)
  const ref = cleanRef(d.referralCode)

  // 1. La ficha.
  let reg: { lead_id: string; sponsor_id: string | null; seller_code: string | null; trial_end: string | null }
  try {
    reg = await rpc('alta_register', {
      p: {
        empresa: d.empresa, email: d.email, telefono: d.telefono, contact_person: d.contactPerson,
        tipo: d.tipo, address: d.direccion, tax_id: d.cif, referral_code: ref, language: d.language,
        plan: d.plan, token, code,
      },
    })
  } catch (err) {
    const msg = err instanceof RpcError ? err.message : ''
    if (msg.includes('ALREADY_SUBSCRIBED')) return NextResponse.json({ error: 'already' }, { status: 409 })
    if (msg.includes('ALTA_')) return NextResponse.json({ error: 'invalid' }, { status: 400 })
    console.error('[alta] alta_register:', msg || err)
    return NextResponse.json({ error: 'server' }, { status: 502 })
  }

  // 2. Stripe.
  const tier = d.plan as Tier
  const now = Date.now()
  const charge = firstChargeAt(now, reg.trial_end)
  const founder = isFounder(now)
  const origin = new URL(req.url).origin
  const back = new URL('/alta', origin)
  back.searchParams.set('plan', tier)
  if (token) back.searchParams.set('t', token)
  if (code) back.searchParams.set('c', code)

  const metadata = {
    flow: 'alta',
    lead_id: reg.lead_id,
    sponsor_id: reg.sponsor_id ?? undefined,
    tier,
    pack: PLANS[tier].pack,
    seller_code: reg.seller_code ?? undefined,
    ref: ref ?? undefined,
    terms_version: TERMS_VERSION,
    trial_end: charge.trial ? String(Math.floor(charge.at / 1000)) : undefined,
    utm_source: d.utm?.source, utm_medium: d.utm?.medium, utm_campaign: d.utm?.campaign,
  }
  const locale = checkoutLocale(d.language)

  try {
    const session = await createCheckoutSession({
      mode: 'subscription',
      line_items: [{ price: envFor('STRIPE_PRICE', tier) || PRICE_DEFAULTS[tier], quantity: 1 }],
      subscription_data: {
        // Una fecha exacta, no "30 días": es la que se le enseña y la que guarda el CRM.
        trial_end: charge.trial ? Math.floor(charge.at / 1000) : undefined,
        // Sin tarjeta al acabar la prueba, la suscripción se cancela en vez de quedar a deber.
        trial_settings: charge.trial ? { end_behavior: { missing_payment_method: 'cancel' } } : undefined,
        metadata,
      },
      payment_method_collection: 'always',
      ...(founder
        ? { discounts: [{ coupon: envFor('STRIPE_COUPON', tier) || COUPON_DEFAULTS[tier] }] }
        : { allow_promotion_codes: true }),
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: 'required',
      customer_email: d.email,
      client_reference_id: reg.lead_id,
      metadata,
      locale,
      ...(process.env.STRIPE_TOS_CONSENT === '1' ? { consent_collection: { terms_of_service: 'required' } } : {}),
      custom_text: charge.trial
        ? { submit: { message: SUBMIT_TEXT[locale](longDate(charge.at, locale)) } }
        : undefined,
      expires_at: Math.floor(now / 1000) + 24 * 3600,
      success_url: `${origin}/alta/listo?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: back.toString(),
    })
    if (!session.url) throw new StripeError('Checkout sin URL', 502)
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[alta] Stripe:', err instanceof StripeError ? `${err.status} ${err.code ?? ''} ${err.message}` : err)
    return NextResponse.json({ error: 'stripe' }, { status: 502 })
  }
}
