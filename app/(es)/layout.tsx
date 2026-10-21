import type { Metadata } from 'next'
import SiteShell, { baseMetadata } from '@/components/SiteShell'

// Layout raíz de la portada en español y de todo lo que sólo existe en
// español (legal, alta). Ver components/SiteShell.tsx.
export const metadata: Metadata = baseMetadata

export default function SpanishRootLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="es">{children}</SiteShell>
}
