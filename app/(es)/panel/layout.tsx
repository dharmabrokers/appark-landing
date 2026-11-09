import type { Metadata } from 'next'
import PanelShell from '@/components/panel/PanelShell'

/**
 * appark.es/panel: el panel del comercio en el ordenador (lo mismo que en la app).
 * Entra con un código al correo; todo lo demás lo hace el navegador con la sesión del
 * comercio y la clave pública (ver lib/panel/supabase.ts). No se indexa.
 */
export const metadata: Metadata = {
  title: 'Panel del comercio | Appark',
  description: 'Gestiona tus premios, tu ficha y tus resultados en Appark desde el ordenador.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/panel' },
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <PanelShell>{children}</PanelShell>
}
