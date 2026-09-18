import { NextRequest, NextResponse } from 'next/server'
import { STORES } from '@/lib/stores'

/**
 * appark.es/descargar — the one link printed on every QR.
 *
 * Posters and flyers carry a single QR instead of one per store: a
 * passer-by does not know which one to scan, and a printed QR cannot be
 * changed once it is on a wall. This sends each phone to its own store,
 * and anything else (a desktop, a store that is not live yet) to the
 * download section of the landing, which says what is coming.
 *
 * It reads the same NEXT_PUBLIC_*_LIVE switches as the landing, so the
 * day Apple approves, flipping NEXT_PUBLIC_APP_STORE_LIVE in Vercel is
 * the only thing needed; the printed QR stays the same.
 */
export const dynamic = 'force-dynamic'

export function GET(req: NextRequest) {
  const ua = req.headers.get('user-agent') ?? ''
  const isAndroid = /android/i.test(ua)
  // iPadOS reports itself as a Mac; the touch hint tells them apart.
  const isIOS = /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && /mobile/i.test(ua))

  let target = new URL('/#descargar', req.url).toString()
  if (isAndroid && STORES.googlePlay.live) target = STORES.googlePlay.url
  else if (isIOS && STORES.appStore.live) target = STORES.appStore.url

  // Campaign tags (?utm_source=cartel…) travel on to the store, so each
  // poster or post can be measured separately.
  const src = req.nextUrl.searchParams
  if (src.toString() && target.startsWith('https://play.google.com')) {
    const out = new URL(target)
    out.searchParams.set('referrer', src.toString())
    target = out.toString()
  }

  return NextResponse.redirect(target, 302)
}
