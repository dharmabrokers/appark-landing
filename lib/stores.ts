/**
 * Dónde se descarga Appark, y si ya se puede.
 *
 * Cada tienda se enciende por separado desde Vercel, sin tocar código:
 *   NEXT_PUBLIC_GOOGLE_PLAY_LIVE=1  cuando la ficha de Google Play sea pública
 *   NEXT_PUBLIC_APP_STORE_LIVE=1    cuando Apple apruebe y publique la app
 *
 * Mientras ninguna esté encendida la página sigue pidiendo el email de
 * acceso anticipado. En cuanto se enciende una, la sección de descarga
 * sustituye a ese formulario y los botones de toda la página llevan ahí.
 * Enlazar antes a una ficha que da 404 sería peor que no enlazar.
 *
 * Los QR de /public apuntan a estas mismas URL; si cambian, se regeneran:
 *   npx qrcode -t svg -e M -q 1 -d "#0A2A36" -l "#FFFFFF" -o public/qr-google-play.svg "<url>"
 */

export interface Store {
  url: string
  qr: string
  live: boolean
}

export const STORES: { googlePlay: Store; appStore: Store } = {
  googlePlay: {
    url: 'https://play.google.com/store/apps/details?id=es.appark.app',
    qr: '/qr-google-play.svg',
    live: process.env.NEXT_PUBLIC_GOOGLE_PLAY_LIVE === '1',
  },
  appStore: {
    url: 'https://apps.apple.com/es/app/id6811317301',
    qr: '/qr-app-store.svg',
    live: process.env.NEXT_PUBLIC_APP_STORE_LIVE === '1',
  },
}

/** La app se puede descargar de al menos una tienda. */
export const APP_LAUNCHED = STORES.googlePlay.live || STORES.appStore.live
