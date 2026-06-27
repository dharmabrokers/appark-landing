'use client'
import { LangProvider } from '@/components/LangContext'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import TrustBar from '@/components/landing/TrustBar'
import ProblemSection from '@/components/landing/ProblemSection'
import SolutionSection from '@/components/landing/SolutionSection'
import RegaloSection from '@/components/landing/RegaloSection'
// Hidden until we have 3+ real sponsors - APP-73
// import SponsorsSection from '@/components/landing/SponsorsSection'
import EarlyAccessSection from '@/components/landing/EarlyAccessSection'
import Footer from '@/components/landing/Footer'

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
        {/* Hidden until we have 3+ real sponsors - APP-73 */}
        {/* <SponsorsSection /> */}
        <EarlyAccessSection />
      </main>
      <Footer />
    </LangProvider>
  )
}
