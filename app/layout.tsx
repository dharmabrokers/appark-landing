import type { Metadata } from 'next'
import { Bricolage_Grotesque, Manrope } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-G3MV9DZD72'

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
  // Absolute URLs for the icon, Open Graph and canonical tags: Google reads
  // the favicon from the page it indexed, and relative URLs resolve against
  // whatever host it happened to crawl.
  metadataBase: new URL('https://appark.es'),
  alternates: { canonical: '/' },
  title: 'Appark | La app gratuita de parking colaborativo en Palma de Mallorca',
  description: 'Appark es la app gratuita para aparcar en Palma: plazas libres en tiempo real que comparten otros conductores, y premios en comercios locales por colaborar.',
  keywords: ['Appark', 'parking Palma', 'app parking Palma de Mallorca', 'encuentra parking Palma', 'aparcamiento Palma de Mallorca'],
  openGraph: {
    title: 'Appark | Parking colaborativo en Palma de Mallorca',
    description: 'Plazas libres en Palma en tiempo real, compartidas por otros conductores. Gratis. Menos vueltas, más Palma.',
    url: 'https://appark.es',
    siteName: 'Appark',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Appark | Parking colaborativo en Palma de Mallorca',
    description: 'Plazas libres en Palma en tiempo real, compartidas por otros conductores. Gratis. Menos vueltas, más Palma.',
  },
}


const APP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: 'Appark',
  alternateName: 'Appark: Parking en Palma',
  url: 'https://appark.es',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Android, iOS',
  description: 'App gratuita y colaborativa para encontrar aparcamiento en Palma de Mallorca en tiempo real.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  installUrl: 'https://play.google.com/store/apps/details?id=es.appark.app',
  publisher: { '@type': 'Organization', name: "DHARMA BROKERS' CONSULTING SL", email: 'hola@appark.es' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_JSON_LD) }}
        />
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
        <CookieBanner />
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
