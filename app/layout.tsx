import type { Metadata } from 'next'
import { Bricolage_Grotesque, Manrope } from 'next/font/google'
import './globals.css'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const body = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Appark | La app gratuita de parking colaborativo en Palma de Mallorca',
  description: 'Appark te ayuda a encontrar aparcamiento gratis en Palma de Mallorca en tiempo real. Colaborativa, gratuita y local. Únete a la lista de espera. Verano 2026.',
  keywords: ['Appark', 'parking Palma', 'app parking Palma de Mallorca', 'encuentra parking Palma', 'aparcamiento Palma de Mallorca'],
  openGraph: {
    title: 'Appark | Parking colaborativo en Palma de Mallorca',
    description: 'La app gratuita que resuelve el parking en Palma. Colaborativa, local, gratuita. Verano 2026.',
    url: 'https://appark.es',
    siteName: 'Appark',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Appark | Parking colaborativo en Palma de Mallorca',
    description: 'La app gratuita que resuelve el parking en Palma. Colaborativa, local, gratuita. Verano 2026.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <head>
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            async
            defer
          />
        )}
      </head>
      <body style={{ fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
