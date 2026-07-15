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
import Footer from '@/components/landing/Footer'
import StickyCta from '@/components/landing/StickyCta'

export default function Home() {
  return (
    <LangProvider>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <RegaloSection />
        <SponsorsSection />
        <EarlyAccessSection />
      </main>
      <Footer />
      <StickyCta />
    </LangProvider>
  )
}
