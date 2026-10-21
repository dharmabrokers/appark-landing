import type { MetadataRoute } from 'next'
import { LANG_ORDER } from '@/lib/i18n'
import { LANG_PATH, SITE_URL } from '@/lib/seo'

/**
 * Las cuatro portadas, cada una con sus alternativas de idioma (hreflang
 * también aquí, además de en el <head>: es lo que Google recomienda para
 * que no tenga que descubrir las versiones navegando), y las páginas
 * legales, que sólo existen en español.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {}
  for (const l of LANG_ORDER) languages[l] = `${SITE_URL}${LANG_PATH[l] === '/' ? '' : LANG_PATH[l]}`

  const homes: MetadataRoute.Sitemap = LANG_ORDER.map((l) => ({
    url: languages[l],
    changeFrequency: 'weekly',
    priority: l === 'es' ? 1 : 0.9,
    alternates: { languages },
  }))

  const legal: MetadataRoute.Sitemap = ['privacidad', 'terminos', 'patrocinio', 'eliminar-cuenta'].map((slug) => ({
    url: `${SITE_URL}/legal/${slug}`,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  return [...homes, ...legal]
}
