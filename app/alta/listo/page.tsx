import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LangProvider } from '@/components/LangContext'
import AltaShell from '@/components/alta/AltaShell'
import AltaDone from '@/components/alta/AltaDone'

export const metadata: Metadata = {
  title: 'Alta completada | Appark',
  robots: { index: false, follow: false },
}

export default function AltaListoPage() {
  return (
    <LangProvider>
      <AltaShell>
        <Suspense fallback={null}>
          <AltaDone />
        </Suspense>
      </AltaShell>
    </LangProvider>
  )
}
