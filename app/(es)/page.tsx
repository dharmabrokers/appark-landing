import type { Metadata } from 'next'
import HomePage from '@/components/landing/HomePage'
import { homeJsonLd, homeMetadata } from '@/lib/seo'

export const metadata: Metadata = homeMetadata('es')

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd('es')) }} />
      <HomePage lang="es" />
    </>
  )
}
