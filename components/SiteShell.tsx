import type { Metadata } from 'next'
import { Bricolage_Grotesque, Manrope } from 'next/font/google'
import Script from 'next/script'
import '@/app/globals.css'
import CookieBanner from '@/components/CookieBanner'
import type { Lang } from '@/lib/i18n'

/**
 * El <html>, las fuentes y lo que va en todas las páginas.
 *
 * Vive aquí y no en app/layout.tsx porque la web tiene dos layouts raíz:
 * app/(es) para la portada en español y todo lo demás, y app/(intl)/[lang]
 * para /ca, /en y /de. Son raíz los dos para que cada uno pinte su propio
 * <html lang>: con un solo layout, la versión inglesa saldría marcada como
 * español, y es una de las señales con las que Bing y los asistentes de IA
 * deciden en qué idioma está una página.
 */

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

/**
 * Lo común a todas las páginas. El canonical NO va aquí: estaba, con
 * valor '/', y lo heredaban las páginas legales, que le decían a Google
 * «soy un duplicado de la portada». Cada página declara el suyo.
 */
export const baseMetadata: Metadata = {
  // URLs absolutas para iconos y Open Graph: Google lee el favicon de la
  // página que indexó, y una URL relativa se resuelve contra el host por
  // el que haya entrado.
  metadataBase: new URL('https://appark.es'),
  applicationName: 'Appark',
  creator: "Dharma Brokers' Consulting SL",
  publisher: "Dharma Brokers' Consulting SL",
  formatDetection: { telephone: false },
}

export default function SiteShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${display.variable} ${body.variable}`}>
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
