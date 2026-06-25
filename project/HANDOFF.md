# Appark — Landing Page · Developer Handoff

**Para:** Claude Code / desarrollador
**De:** Diseño (Dharma Brokers)
**Objetivo:** convertir el diseño aprobado en una landing Next.js 14 lista para producción en `appark.es`.

---

## 1. Qué hay en este paquete

| Archivo | Qué es |
|---|---|
| `Appark Landing.dc.html` | **La landing completa**, diseñada y funcional (estados de formulario, responsive, nav sticky). Es la fuente de verdad visual. Ábrela en el navegador para ver el comportamiento exacto. |
| `hero-map.svg` | Mapa estilizado de Palma que ocupa la pantalla del móvil del hero. Sustituible por un screenshot real de la app. |
| `marketing/Appark Brand Manual.dc.html` | Manual de marca (11 páginas, imprimible a PDF). Colores, tipografía, logo, tono. |
| `marketing/Appark Social Templates.dc.html` | 6 plantillas de redes (IG post/story, FB) en tamaño real. |
| `marketing/Appark Print & Badges.dc.html` | Cartel A3, flyer A6, sellos de sponsor y vinilo. |

> El `.dc.html` es un componente que renderiza solo en el navegador. Para el handoff a Next.js **no** se copia tal cual: se reconstruye con los componentes reales (abajo). El diseño es la referencia 1:1 — colores, tamaños, copy y estados ya están decididos ahí.

---

## 2. Stack objetivo

```bash
npx create-next-app@latest appark-landing --typescript --tailwind --app --eslint
cd appark-landing
npx shadcn@latest init           # base color: slate
npx shadcn@latest add button card form input select textarea checkbox badge
npm install react-hook-form @hookform/resolvers zod lucide-react
```

Next.js 14 (App Router) · TypeScript strict · Tailwind · shadcn/ui · react-hook-form + zod · lucide-react.

---

## 3. Tokens de marca (tailwind.config.ts)

> ⚠️ La paleta final aprobada es **mediterránea** (no el azul/naranja genérico del primer borrador). Usa exactamente estos valores.

```ts
// tailwind.config.ts → theme.extend.colors
colors: {
  coral:  { DEFAULT: '#FF6A3D', 600: '#F25A2C', fg: '#FFFFFF' }, // CTAs, acentos
  sea:    { DEFAULT: '#11607A', 700: '#0E4456', fg: '#FFFFFF' }, // primario, links
  ink:    '#0A2A36',   // texto y secciones oscuras
  sand:   '#FBF6EE',   // fondo principal
  sand2:  '#F4ECDF',   // fondo secundario / cards cálidas
  surface:'#F8FAFB',   // fondo sección sponsors
  free:   '#1FB877',   // verde "plaza libre" / éxito
}
```

Tipografía (next/font/google en `app/layout.tsx`):
- **Bricolage Grotesque** (700/800) → titulares, números, logo wordmark.
- **Manrope** (400–800) → cuerpo y UI.

```ts
import { Bricolage_Grotesque, Manrope } from 'next/font/google'
const display = Bricolage_Grotesque({ subsets:['latin'], weight:['700','800'], variable:'--font-display' })
const body = Manrope({ subsets:['latin'], weight:['400','500','600','700','800'], variable:'--font-body' })
```

Detalles finos a respetar: radios 12–26px, sombras suaves `0 12px 30px rgba(10,42,54,.06)`, eyebrow en mayúsculas `letter-spacing:2.5px` color coral, h1 `letter-spacing:-1.5px`.

---

## 4. Estructura de componentes

```
app/
  layout.tsx            # fuentes + metadata SEO (ver §6)
  page.tsx              # ensambla las secciones en orden
  globals.css           # scroll-behavior:smooth, resets
  api/
    early-access/route.ts
    sponsor-contact/route.ts
components/
  landing/
    Navbar.tsx          # sticky, fondo aparece al hacer scroll (>24px), hamburguesa <880px
    Hero.tsx            # 2 columnas; móvil con hero-map.svg + chips flotantes
    TrustBar.tsx
    ProblemSection.tsx  # #como-funciona · copy + 3 stat cards (0€ / Verano 2026 / 4 idiomas)
    SolutionSection.tsx # 4 pasos + 4 features (2x2)
    RegaloSection.tsx   # #sobre-nosotros · fondo ink, 2 columnas, pull quote
    SponsorsSection.tsx # #sponsors · beneficios + 6 logo slots + SponsorForm
    EarlyAccessSection.tsx # #early-access · fondo degradado, chips, timeline + EarlyAccessForm
    Footer.tsx
  forms/
    EarlyAccessForm.tsx
    SponsorForm.tsx
lib/
  schemas.ts            # zod
  recaptcha.ts          # verifyRecaptcha()
public/
  hero-map.svg          # copiar desde este paquete
```

Anclas de scroll usadas por la nav: `#hero`, `#como-funciona`, `#sponsors`, `#sobre-nosotros`, `#early-access`.

---

## 5. Formularios (copia los estados del diseño)

El diseño ya implementa los 3 estados — replícalos:
- **loading**: botón deshabilitado + spinner, texto "Enviando…", opacidad 0.75.
- **success**: reemplaza el formulario por mensaje inline (no redirect). NO se borran los campos.
- **error**: banner rojo inline arriba del botón; los campos se conservan.

### Early Access
Campos: `nombre` (req), `email` (req, email), `acceptsUpdates` (checkbox req).
Mensaje éxito: *"¡Ya estás en la lista! 🎉 Te avisaremos antes que a nadie cuando llegue tu momento."*
Error: *"Algo salió mal. Inténtalo de nuevo o escríbenos a hola@appark.es"*

### Sponsor
Campos: `empresa` (req), `email` (req), `telefono` (opt), `tipoNegocio` (req, select), `mensaje` (opt, max 500).
Opciones select: Restaurante / Bar / Cafetería · Comercio / Tienda · Servicios profesionales · Hostelería · Ocio / Entretenimiento · Rent-a-car / Movilidad · Otro.
Mensaje éxito: *"¡Gracias! Te contactaremos en 24-48 horas."*

```ts
// lib/schemas.ts
import { z } from 'zod'
export const earlyAccessSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  acceptsUpdates: z.literal(true),
  recaptchaToken: z.string().min(1),
})
export const sponsorSchema = z.object({
  empresa: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().optional(),
  tipoNegocio: z.string().min(1),
  mensaje: z.string().max(500).optional(),
  recaptchaToken: z.string().min(1),
})
```

---

## 6. API routes

`/api/early-access/route.ts`
1. Validar body con `earlyAccessSchema`. Si `acceptsUpdates !== true` → 400.
2. `verifyRecaptcha(token)` (POST a `https://www.google.com/recaptcha/api/siteverify`). Si falla → 400.
3. POST a `process.env.N8N_EARLY_ACCESS_WEBHOOK_URL` con
   `{ nombre, email, acceptsUpdates, timestamp: new Date().toISOString(), source: 'appark.es' }`.
4. `200 { success: true }` / `500 { error: 'Internal server error' }`.

`/api/sponsor-contact/route.ts`
1. Validar con `sponsorSchema`. 2. `verifyRecaptcha`. 3. POST a `process.env.N8N_SPONSOR_WEBHOOK_URL` con
   `{ empresa, email, telefono, tipoNegocio, mensaje, timestamp, source: 'appark.es' }`. 4. Mismas respuestas.

reCAPTCHA v3 (invisible, badge oculto): token en cliente antes del submit, verificación en servidor.

### Variables de entorno (.env.local + Vercel)
```
N8N_EARLY_ACCESS_WEBHOOK_URL=
N8N_SPONSOR_WEBHOOK_URL=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

### SEO (app/layout.tsx)
```ts
export const metadata: Metadata = {
  title: 'Appark | La app gratuita de parking colaborativo en Palma de Mallorca',
  description: 'Appark te ayuda a encontrar aparcamiento gratis en Palma de Mallorca en tiempo real. Colaborativa, gratuita y local. Únete a la lista de espera. Verano 2026.',
  keywords: ['Appark','parking Palma','app parking Palma de Mallorca','encuentra parking Palma','aparcamiento Palma de Mallorca'],
  openGraph: {
    title: 'Appark | Parking colaborativo en Palma de Mallorca',
    description: 'La app gratuita que resuelve el parking en Palma. Colaborativa, local, gratuita. Verano 2026.',
    url: 'https://appark.es', siteName: 'Appark', locale: 'es_ES', type: 'website',
  },
}
```

---

## 7. Decisiones de diseño ya tomadas (no re-litigar sin avisar)
- **Stats honestas**: se quitaron las cifras sin verificar ("20 min", "100+ horas"). Solo se muestran datos seguros: 0 €, Verano 2026, 4 idiomas. No reintroducir cifras sin fuente.
- **Sin pricing de sponsors** en la web (copy "Hablemos de lo que tiene sentido para tu negocio").
- **Sin mención** a competidores ni al Ajuntament.
- Logo: versión **pin coral + wordmark** (definida en el Brand Manual).
- Acepta `aria-label` en botones, `htmlFor` en labels, contraste AA — ya aplicado en el diseño.

## 8. Pendientes de negocio (Erik)
- [ ] Endpoints n8n (ambos webhooks)
- [ ] reCAPTCHA site key + secret para appark.es
- [ ] Política de Privacidad / Términos / Cookies (footer `href="#"` provisional) — sugerencia: Iubenda/Termly
- [ ] Screenshot real de la app para reemplazar `hero-map.svg`
- [ ] Logos reales de sponsors para el grid (6 slots)
