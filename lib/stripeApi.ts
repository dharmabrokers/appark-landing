/**
 * Lo poco que la página de alta le pide a Stripe, por su API REST, sin SDK.
 *
 * STRIPE_SECRET_KEY es una clave RESTRINGIDA (rk_...): solo «Checkout Sessions: write».
 * Aunque se filtrara, no sirve para cobrar, devolver ni leer clientes.
 * En la vista previa de Vercel va la de pruebas (rk_test_...).
 */

type Params = Record<string, unknown>

/** {a: {b: [1]}} → a[b][0]=1, como lo espera Stripe. */
export function formEncode(params: Params, prefix = ''): string[] {
  const out: string[] = []
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue
    const key = prefix ? `${prefix}[${k}]` : k
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item !== null && typeof item === 'object') out.push(...formEncode(item as Params, `${key}[${i}]`))
        else out.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(item))}`)
      })
    } else if (typeof v === 'object') {
      out.push(...formEncode(v as Params, key))
    } else {
      out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`)
    }
  }
  return out
}

export class StripeError extends Error {
  status: number
  code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

async function call<T>(method: 'GET' | 'POST', path: string, params?: Params): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new StripeError('STRIPE_SECRET_KEY sin configurar', 500)
  const body = params ? formEncode(params).join('&') : undefined
  const url = method === 'GET' && body ? `https://api.stripe.com/v1/${path}?${body}` : `https://api.stripe.com/v1/${path}`
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': '2026-08-26.dahlia',
    },
    body: method === 'POST' ? body : undefined,
    cache: 'no-store',
  })
  const json = (await res.json().catch(() => ({}))) as { error?: { message?: string; code?: string } } & T
  if (!res.ok) throw new StripeError(json.error?.message ?? `Stripe ${res.status}`, res.status, json.error?.code)
  return json
}

export interface CheckoutSession {
  id: string
  url: string | null
  status: 'open' | 'complete' | 'expired'
  customer_details?: { email?: string | null } | null
  metadata?: Record<string, string>
}

export function createCheckoutSession(params: Params): Promise<CheckoutSession> {
  return call<CheckoutSession>('POST', 'checkout/sessions', params)
}

export function getCheckoutSession(id: string): Promise<CheckoutSession> {
  return call<CheckoutSession>('GET', `checkout/sessions/${encodeURIComponent(id)}`)
}
