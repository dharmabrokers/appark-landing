import type { MetadataRoute } from 'next'

// Without this file /robots.txt answered with the 404 page, which also
// carries a noindex tag. Crawlers cope, but it is one more thing that
// makes Google slower to pick the site (and its icon) up.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: 'https://appark.es/sitemap.xml',
  }
}
