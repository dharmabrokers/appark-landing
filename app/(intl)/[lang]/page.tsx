import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HomePage from '@/components/landing/HomePage'
import { homeJsonLd, homeMetadata, isLang } from '@/lib/seo'

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return isLang(params.lang) ? homeMetadata(params.lang) : {}
}

export default function LocalizedHome({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang) || params.lang === 'es') notFound()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(params.lang)) }} />
      <HomePage lang={params.lang} />
    </>
  )
}
