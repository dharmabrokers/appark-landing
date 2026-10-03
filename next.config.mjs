// Los flujos de correo viven en n8n, alojado en un subdominio de
// easypanel.host. Los servidores de correo rechazan como spam cualquier
// mensaje que lleve un enlace a ese dominio (comprobado el 3-oct-2026: el
// mismo correo se acepta sin enlace o con el enlace en appark.es, y se
// rechaza con el de easypanel), así que el enlace de baja tiene que ser
// de appark.es aunque quien lo atienda siga siendo n8n.
//
// Es una reescritura y no una redirección a propósito: con un redirect el
// navegador acabaría en easypanel.host a la vista del usuario, y un
// enlace de baja que te saca a un dominio desconocido es justo lo que
// parece phishing.
//
// La base se puede cambiar por variable de entorno, pero lleva valor por
// defecto: las variables de este proyecto están puestas sólo en
// Production, y sin el valor por defecto los despliegues de preview se
// quedarían sin la ruta y no habría dónde probarla.
const N8N_WEBHOOK_BASE = (
  process.env.N8N_WEBHOOK_BASE || 'https://dharma-brokers-n8n.ty5xmx.easypanel.host/webhook'
).replace(/\/+$/, '')

// Las rutas que se prestan a n8n. Una lista cerrada y no un comodín
// (/n8n/:path*): un comodín publicaría bajo appark.es cualquier webhook
// que exista hoy o se cree mañana, incluidos los que no esperan visitas
// de fuera.
//
// /prospect-open es el píxel de apertura y /prospect-click el enlace con
// seguimiento de los correos a comercios. El de clic redirige, y por eso
// sólo está aquí porque n8n valida el destino contra appark.es y manda
// cualquier otro a la portada: un redirector que aceptase la URL que le
// llegue convertiría appark.es en la herramienta de la siguiente
// campaña de phishing. Si esa validación se quita en n8n, esta ruta se
// quita de aquí.
const N8N_ROUTES = ['/baja', '/baja-confirmar', '/prospect-open', '/prospect-click']

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },

  async rewrites() {
    return N8N_ROUTES.map((source) => ({
      source,
      destination: `${N8N_WEBHOOK_BASE}${source}`,
    }))
  },

  async headers() {
    return N8N_ROUTES.map((source) => ({
      source,
      headers: [
        // La URL lleva dentro a quién se da de baja. Que no acabe en un
        // buscador, ni en la caché de nadie, ni en el Referer de lo
        // siguiente que pulse el usuario.
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        { key: 'Cache-Control', value: 'no-store' },
        { key: 'Referrer-Policy', value: 'no-referrer' },
      ],
    }))
  },
}

export default nextConfig
