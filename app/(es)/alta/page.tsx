import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LangProvider } from '@/components/LangContext'
import AltaShell from '@/components/alta/AltaShell'
import AltaFlow from '@/components/alta/AltaFlow'

export const metadata: Metadata = {
  title: 'Alta de comercio | Appark',
  description: 'Da de alta tu comercio en Appark: primer mes gratis, sin permanencia. Registras la tarjeta y no se cobra nada durante los primeros 30 días.',
  // Cada enlace lleva el código del comercial o el token de una ficha: no se indexa.
  robots: { index: false, follow: false },
}

export default function AltaPage() {
  return (
    <LangProvider>
      <AltaShell>
        {/* useSearchParams necesita un Suspense para que la página se pueda construir. */}
        <Suspense fallback={null}>
          <AltaFlow />
        </Suspense>
      </AltaShell>
    </LangProvider>
  )
}
