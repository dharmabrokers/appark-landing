import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteShell, { baseMetadata } from '@/components/SiteShell'
import { INTL_LANGS, isLang } from '@/lib/seo'

// Layout raíz de /ca, /en y /de. Es raíz, y no un hijo del español, para
// poder pintar su propio <html lang>. Ver components/SiteShell.tsx.
export const metadata: Metadata = baseMetadata

// Sólo estos tres. Cualquier otra cosa de un segmento (/xx) es un 404 y
// no una portada fantasma en un idioma que no existe.
export const dynamicParams = false
export function generateStaticParams() {
  return INTL_LANGS.map((lang) => ({ lang }))
}

export default function IntlRootLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  if (!isLang(params.lang) || params.lang === 'es') notFound()
  return <SiteShell lang={params.lang}>{children}</SiteShell>
}
