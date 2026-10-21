'use client'
import { LangProvider } from '@/components/LangContext'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import TrustBar from '@/components/landing/TrustBar'
import ProblemSection from '@/components/landing/ProblemSection'
import SolutionSection from '@/components/landing/SolutionSection'
import RegaloSection from '@/components/landing/RegaloSection'
import SponsorsSection from '@/components/landing/SponsorsSection'
import EarlyAccessSection from '@/components/landing/EarlyAccessSection'
import DownloadSection from '@/components/landing/DownloadSection'
import FaqSection from '@/components/landing/FaqSection'
import { APP_LAUNCHED } from '@/lib/stores'
import AnthemSection from '@/components/landing/AnthemSection'
import Footer from '@/components/landing/Footer'
import StickyCta from '@/components/landing/StickyCta'
import type { Lang } from '@/lib/i18n'

/**
 * La portada, en el idioma de su URL. La usan app/(es)/page.tsx para /
 * y app/(intl)/[lang]/page.tsx para /ca, /en y /de.
 */
export default function HomePage({ lang }: { lang: Lang }) {
  return (
    <LangProvider initialLang={lang} routed>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <RegaloSection />
        <SponsorsSection />
        {/* Tras el lanzamiento se descarga; antes, se pide acceso. lib/stores.ts */}
        {APP_LAUNCHED ? <DownloadSection /> : <EarlyAccessSection />}
        <FaqSection />
        <AnthemSection />
      </main>
      <Footer />
      <StickyCta />
    </LangProvider>
  )
}
