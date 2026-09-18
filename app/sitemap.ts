import type { MetadataRoute } from 'next'

const BASE = 'https://appark.es'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/legal/privacidad`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/terminos`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/eliminar-cuenta`, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
