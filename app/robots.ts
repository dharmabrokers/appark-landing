import type { MetadataRoute } from 'next'

// Without this file /robots.txt answered with the 404 page, which also
// carries a noindex tag. Crawlers cope, but it is one more thing that
// makes Google slower to pick the site (and its icon) up.
export default function robots(): MetadataRoute.Robots {
  return {
    // /baja cubre también /baja-confirmar (es un prefijo). Son las
    // páginas de baja del correo, que atiende n8n: no tienen nada que
    // indexar y su URL identifica a una persona.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/baja', '/prospect-'] },
    sitemap: 'https://appark.es/sitemap.xml',
  }
}
