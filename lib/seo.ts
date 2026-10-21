import type { Metadata } from 'next'
import { LANG_ORDER, type Lang } from '@/lib/i18n'
import { SEO_CONTENT } from '@/lib/seoContent'
import { STORES } from '@/lib/stores'

export const SITE_URL = 'https://appark.es'

/**
 * Una URL por idioma. El español se queda en la raíz porque es la que ya
 * está indexada y la que llevan los carteles y los QR.
 *
 * Antes el idioma se cambiaba en el navegador sin cambiar de URL, así que
 * para Google y para los asistentes de IA la web sólo existía en español:
 * quien buscaba «parking app Palma» en inglés o alemán —el turista con
 * coche de alquiler— no tenía ninguna página que encontrar.
 */
export const LANG_PATH: Record<Lang, string> = { es: '/', ca: '/ca', en: '/en', de: '/de' }
export const INTL_LANGS = LANG_ORDER.filter((l) => l !== 'es') as Exclude<Lang, 'es'>[]

export function isLang(x: string): x is Lang {
  return (LANG_ORDER as string[]).includes(x)
}

/** hreflang de la portada: los cuatro idiomas y x-default al español. */
export function homeAlternates(lang: Lang): Metadata['alternates'] {
  const languages: Record<string, string> = {}
  for (const l of LANG_ORDER) languages[l] = LANG_PATH[l]
  languages['x-default'] = LANG_PATH.es
  return { canonical: LANG_PATH[lang], languages }
}

/** Los perfiles oficiales. Van en el footer y en el sameAs del JSON-LD. */
export const SOCIAL = {
  instagram: 'https://www.instagram.com/appark_palma',
  tiktok: 'https://www.tiktok.com/@appark_palma',
  linkedin: 'https://www.linkedin.com/company/appark-es',
}

export function homeMetadata(lang: Lang): Metadata {
  const { meta } = SEO_CONTENT[lang]
  const url = LANG_PATH[lang]
  return {
    title: meta.title,
    description: meta.description,
    alternates: homeAlternates(lang),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: 'Appark',
      locale: meta.ogLocale,
      alternateLocale: LANG_ORDER.filter((l) => l !== lang).map((l) => SEO_CONTENT[l].meta.ogLocale),
      type: 'website',
      // Explícita: en cuanto una página define su propio openGraph, Next
      // deja de añadir sola la imagen de app/opengraph-image.png, y la
      // portada se compartía en WhatsApp sin foto.
      images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['/twitter-image.png'],
    },
  }
}

/**
 * Datos estructurados de la portada, como un único @graph enlazado por
 * @id: la organización, la web, la app, esta página y sus preguntas.
 *
 * Es lo que lee un buscador para entender QUÉ es Appark sin interpretar
 * el diseño, y lo que tiene más a mano un asistente de IA cuando alguien
 * le pregunta por aparcar en Palma. Los perfiles van en sameAs para que
 * Instagram, TikTok, LinkedIn y las fichas de las tiendas cuenten como la
 * misma entidad y no como cinco cosas sueltas llamadas Appark.
 */
export function homeJsonLd(lang: Lang) {
  const c = SEO_CONTENT[lang]
  const pageUrl = `${SITE_URL}${LANG_PATH[lang] === '/' ? '' : LANG_PATH[lang]}`
  const liveStores = [STORES.googlePlay, STORES.appStore].filter((s) => s.live).map((s) => s.url)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Appark',
        legalName: "DHARMA BROKERS' CONSULTING SL",
        url: SITE_URL,
        logo: `${SITE_URL}/logo-appark.png`,
        email: 'hola@appark.es',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Palma',
          addressRegion: 'Illes Balears',
          addressCountry: 'ES',
        },
        areaServed: { '@id': `${SITE_URL}/#palma` },
        sameAs: [SOCIAL.instagram, SOCIAL.tiktok, SOCIAL.linkedin, ...liveStores],
      },
      {
        '@type': 'City',
        '@id': `${SITE_URL}/#palma`,
        name: 'Palma de Mallorca',
        sameAs: 'https://www.wikidata.org/wiki/Q8826',
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Appark',
        inLanguage: LANG_ORDER,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'MobileApplication',
        '@id': `${SITE_URL}/#app`,
        name: 'Appark',
        alternateName: 'Appark: Parking en Palma',
        url: SITE_URL,
        description: c.meta.description,
        applicationCategory: 'TravelApplication',
        operatingSystem: 'Android, iOS',
        inLanguage: LANG_ORDER,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        ...(liveStores.length ? { installUrl: liveStores[0], sameAs: liveStores } : {}),
        featureList: c.tech.items.map((i) => i.t),
        areaServed: { '@id': `${SITE_URL}/#palma` },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: c.meta.title,
        description: c.meta.description,
        inLanguage: lang,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#app` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        inLanguage: lang,
        isPartOf: { '@id': `${pageUrl}#webpage` },
        mainEntity: c.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
