/**
 * Contar los clics de appark.es/descargar.
 *
 * Cada clic se apunta en bo.link_clicks (migración 0074 del repo
 * Appark-main) llamando a bo_log_link_click con la clave anon, la misma
 * con la que ya entran los leads. Se guarda de qué enlace vino, a qué
 * tienda fue, el país y las etiquetas utm. Ni IP ni user-agent: es un
 * contador, no un registro de visitas.
 */

export type Platform = 'android' | 'ios' | 'other'
export type Target = 'play' | 'appstore' | 'web'

const TAG = /^[a-z0-9][a-z0-9._-]{0,59}$/

/** Una etiqueta con forma de etiqueta, o null. La base aplica la misma regla. */
function tag(value: string | null): string | null {
  const v = (value ?? '').trim().toLowerCase()
  return TAG.test(v) ? v : null
}

/**
 * De qué enlace viene el clic.
 *
 * `?c=<código>` si lo lleva; si no, su `utm_source`; y si el enlace va
 * pelado es el cartel: el QR impreso apunta a /descargar a secas y no se
 * puede cambiar, así que todo lo demás tiene que llevar etiqueta.
 */
export function clickCode(params: URLSearchParams): string {
  return (tag(params.get('c')) ?? tag(params.get('utm_source')) ?? 'cartel').slice(0, 40)
}

/**
 * Lo que abre el enlace sin ser una persona: buscadores y, sobre todo,
 * las vistas previas. Pegar el enlace en WhatsApp, Telegram, Slack o
 * iMessage hace que sus servidores lo visiten para pintar la tarjeta;
 * contarlo sería apuntar un clic cada vez que alguien lo comparte.
 */
const NOT_A_PERSON =
  /bot|crawl|spider|preview|facebookexternalhit|whatsapp|telegram|slack|discord|skype|linkedin|pinterest|embedly|curl|wget|python|headless|lighthouse|monitor|uptime/i

export function isPerson(userAgent: string): boolean {
  return userAgent !== '' && !NOT_A_PERSON.test(userAgent)
}

export interface Click {
  code: string
  platform: Platform
  target: Target
  country: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
}

export function buildClick(params: URLSearchParams, platform: Platform, target: Target, country: string | null): Click {
  return {
    code: clickCode(params),
    platform,
    target,
    country: /^[a-z]{2}$/i.test(country ?? '') ? (country as string).toUpperCase() : '',
    utm_source: tag(params.get('utm_source')),
    utm_medium: tag(params.get('utm_medium')),
    utm_campaign: tag(params.get('utm_campaign')),
  }
}

/**
 * Apunta el clic. Nunca lanza y nunca tarda más de dos segundos: quien
 * la llama ya ha contestado al usuario, y un contador caído no puede
 * costarle a nadie la descarga.
 */
export async function logClick(click: Click): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return
  try {
    const res = await fetch(`${url}/rest/v1/rpc/bo_log_link_click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        p_code: click.code,
        p_platform: click.platform,
        p_target: click.target,
        p_country: click.country,
        p_utm_source: click.utm_source,
        p_utm_medium: click.utm_medium,
        p_utm_campaign: click.utm_campaign,
      }),
      signal: AbortSignal.timeout(2000),
      cache: 'no-store',
    })
    if (!res.ok) console.error('[descargar] no se pudo apuntar el clic:', res.status, await res.text().catch(() => ''))
  } catch (err) {
    console.error('[descargar] no se pudo apuntar el clic:', err)
  }
}
