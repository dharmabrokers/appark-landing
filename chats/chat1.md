# Dharma Brokers Appark MVP

_Started 2026-06-22 23:22 UTC_

---

## User

Vamos con el mayor proyecto de Dharma Brokers hasta la fecha. Te pongo en contexto, tienes la demo levemente funcional en github con el nombre Appark-main y desplegada en vercel bajo el dominio appark-main.vercel.app pero el objetivo es convertirlo en mvp plenamente funcional en los próximos días, mientras consigo los sponsors. Para ello mi equipo de agentes claude corriendo organizadamente en paperclip te han creado los siguientes prompts (no son tan aptos y perfeccionistas como tú, por lo que te animo a mejorar y optimizar lo presentado en base a tu razonamiento). Ayuda en todo lo que puedas : PROMPT COMPLETO
Crea una landing page completa y lista para producción para appark.com usando Next.js 14 (App Router), TypeScript, Tailwind CSS y shadcn/ui.

## CONTEXTO DEL PROYECTO

Appark es una app colaborativa y gratuita de parking para Palma de Mallorca (España). Los conductores se ayudan entre ellos a encontrar aparcamiento en tiempo real, de forma similar a Waze pero para parking. La app es gratis para siempre, sostenida por sponsors locales (comercios de Palma). La desarrolla Dharma Brokers, empresa tecnológica mallorquina, como "regalo a la ciudad".

**Audiencias:** (1) Residentes de Palma que quieren acceso early access a la app, (2) Empresas y comercios locales que quieren ser sponsors.

**Objetivos de conversión:**
- Primario: capturar emails para lista de espera (early access)
- Secundario: capturar contactos de posibles sponsors

---

## ESTRUCTURA Y COPY

### 1. NAVBAR (sticky)

Logo "Appark" a la izquierda.
Links de navegación al centro: "Cómo funciona" · "Para empresas" · "Sobre nosotros" (todos scroll anchors).
CTA botón derecha: "Únete →" (naranja, scroll to early access form).
En mobile: hamburger menu que despliega los links verticalmente.

---

### 2. HERO SECTION (id="hero", 100vh mínimo)

**H1 (grande, negrita):**
"El parking de Palma,
resuelto por todos."

**Subheadline (texto más pequeño, debajo del H1):**
"Appark es la app gratuita y colaborativa donde los palmesanos se ayudan a encontrar aparcamiento en tiempo real. Un proyecto de Dharma Brokers para Palma."

**Dos CTAs lado a lado:**
- CTA primario (botón naranja sólido): "Únete a la lista de espera" → scroll to #early-access
- CTA secundario (botón outline/ghost): "Quiero ser sponsor fundador" → scroll to #sponsors

**Layout:** dos columnas en desktop (texto izquierda, visual derecha). Full width en mobile apilado.

**Visual derecha:** Un rectángulo placeholder de teléfono móvil con un mapa simplificado de Palma dibujado con Tailwind CSS (usa formas SVG simples o emoji de mapa). Añade 3-4 círculos verdes parpadeando para simular plazas disponibles en tiempo real (animación CSS pulse de Tailwind). Alt text: "Mapa de Palma de Mallorca con plazas de aparcamiento disponibles en tiempo real en la app Appark".

---

### 3. TRUST BAR (debajo del hero)

Strip horizontal con fondo gris muy claro (#F1F5F9), texto pequeño y centrado:

"🏙️ Hecho en Palma · ✅ 100% gratuito · 📅 Verano 2026 · 🤝 Apoyado por comercios locales"

---

### 4. PROBLEM SECTION (id="como-funciona")

**H2:** "¿Cuántas vueltas llevas hoy?"

**Subheadline en cursiva:** *"Dues hores donant voltes per Palma"* — Tomeu Penya lo cantó porque todos lo hemos vivido.

**Body copy (3 párrafos):**
Párrafo 1: "El palmesano pasa de media minutos preciosos buscando aparcamiento cada vez que sale al centro. En verano, con el turismo disparado, la cosa va a peor."
Párrafo 2: "Tiempo perdido. Gasolina quemada. Nervios de punta. Y cuando por fin encuentras plaza, ya no tienes ganas de nada."
Párrafo 3: "En Palma hay una app para pagar el parking, una app para el bus, una app para las bicicletas... pero ninguna que te diga dónde hay una plaza libre ahora mismo. Hasta ahora."

**3 stats cards en fila (usa shadcn Card):**
- "0 €" / "lo que te cuesta usar Appark"
- "Verano 2026" / "lanzamiento en Palma"
- "4 idiomas" / "para palmesanos y turistas"

**Layout:** dos columnas en desktop (copy izquierda, stats derecha o abajo). Apilado en mobile.

---

### 5. SOLUTION SECTION

**H2 centrado:** "Appark: el aparcamiento de Palma, colaborativo y gratuito."

**Subheadline centrado:** "Funciona como Waze, pero para aparcar. Tú ayudas a otros, otros te ayudan a ti."

**4 pasos en fila horizontal** (en mobile: 2x2 o columna):
Cada paso: número grande en color primario + icono de Lucide Icons + título + descripción.

Paso 1 — icono: Smartphone
Título: "Abre Appark"
Desc: "Ve el mapa de Palma en tiempo real con plazas disponibles ahora mismo"

Paso 2 — icono: MapPin
Título: "Sigue el punto verde"
Desc: "Navega hasta la plaza libre que otro palmesano acaba de dejar"

Paso 3 — icono: CheckCircle
Título: "Aparca y marca"
Desc: "Señala tu plaza en el mapa cuando llegues. 30 segundos, misión cumplida"

Paso 4 — icono: Trophy
Título: "Gana puntos"
Desc: "Cada plaza compartida suma puntos canjeables en comercios de Palma"

**4 features en grid 2x2** (usa shadcn Card con icono + título + descripción):

Feature 1 — icono: Map
Título: "Mapa en tiempo real"
Desc: "Plazas disponibles actualizadas por la comunidad, segundo a segundo. Sin inventar, sin aproximar."

Feature 2 — icono: Gift
Título: "Gamificación local"
Desc: "Puntos que puedes canjear en tiendas y restaurantes de Palma patrocinadores. Aparcar bien tiene premio."

Feature 3 — icono: Globe
Título: "Para todos"
Desc: "En español, catalán, inglés y alemán. Para palmesanos y para los turistas que también buscan sitio."

Feature 4 — icono: Heart
Título: "Gratis para siempre"
Desc: "Sin suscripciones. Sin anuncios molestos. Gratis hoy, gratis mañana, gratis siempre."

---

### 6. REGALO A PALMA SECTION (id="sobre-nosotros")

Fondo: oscuro (#0F172A) con texto blanco. Añade una imagen de fondo sutil (usa un gradient que evoque el mar mediterráneo como fallback visual).

**H2 centrado (texto blanco):** "¿Por qué gratis? Porque Palma lo merece."

**Subheadline centrado:** "Appark no es un negocio de parking. Es un proyecto de ciudad."

**Body copy (2 columnas en desktop, 1 columna mobile):**

Columna izquierda:
"Somos Dharma Brokers, una empresa con raíces en Mallorca.

Llevamos años viendo cómo el aparcamiento fragmenta la experiencia de vivir en Palma: tiempo perdido, estrés evitable, calles más congestionadas de lo necesario.

Decidimos hacer algo al respecto. No una app de pago. No una plataforma de inversores externos. Un regalo a la ciudad donde vivimos y trabajamos."

Columna derecha:
"Appark es gratuita para palmesanos y visitantes. Se mantiene gracias al apoyo de empresas locales que creen en la comunidad.

Sin suscripciones. Sin letra pequeña. Sin trampa.

Dharma Brokers es una empresa tecnológica de Palma de Mallorca. Creamos soluciones digitales con impacto local."

**Pull quote centrado (tipografía grande, color accent):**
"Un regalo de Palma para Palma."

---

### 7. SPONSORS SECTION (id="sponsors")

Fondo: claro (#F8FAFC).

**H2 centrado:** "Las empresas locales que hacen posible Appark."

**Subheadline centrado:** "Sin publicidad intrusiva. Appark es gratuita porque negocios de Palma eligen ser parte de algo que mejora la ciudad."

**Body copy:**
"Como sponsor fundador de Appark, tu negocio aparece en el mapa de la app como destino recomendado y punto de canje de premios. Los usuarios llegan a tu puerta en el momento exacto: acaban de aparcar y están a pie de calle. Esto no es publicidad de Google. Es presencia local de verdad."

**5 beneficios en lista** (icono Lucide + texto):
- 📍 Visibilidad en el mapa — Tu negocio aparece destacado mientras los usuarios buscan aparcamiento cerca
- 🎁 Punto de canje de premios — Los usuarios gastan sus puntos Appark en tu negocio
- 🏅 Badge "Sponsor Fundador" — Reconocimiento exclusivo limitado a los primeros sponsors
- 📣 Mención en comunicación — Logo en web, redes sociales y comunicados de prensa locales
- 📊 Datos de zona — Insights de movilidad en tu área (anonimizados, GDPR)

**Grid de logos placeholder** (6 cards con fondo blanco, borde suave, texto "Tu negocio aquí" centrado, estilo gris):
3 columnas desktop, 2 columnas mobile.

**Formulario Sponsors** (shadcn Form + react-hook-form + zod validation):

Campos:
- Nombre de empresa (required, text)
- Email de contacto (required, email)
- Teléfono (optional, tel)
- Tipo de negocio (required, Select dropdown con opciones: "Restaurante / Bar / Cafetería", "Comercio / Tienda", "Servicios profesionales", "Hostelería", "Ocio / Entretenimiento", "Rent-a-car / Movilidad", "Otro")
- Mensaje opcional (Textarea, max 500 chars)
- Submit button: "Quiero ser sponsor fundador →" (color naranja, full width)

On submit: POST a /api/sponsor-contact (implementar en Next.js API route).
La API route debe hacer fetch a process.env.N8N_SPONSOR_WEBHOOK_URL con el payload como JSON.
Mostrar mensaje de éxito inline (no redirect): "¡Gracias! Te contactaremos en 24-48 horas."
Mostrar mensaje de error si falla: "Algo salió mal. Escríbenos a hola@appark.es"

Texto bajo el botón: "Te responderemos en 24-48 horas. Sin compromiso."

---

### 8. EARLY ACCESS SECTION (id="early-access")

Fondo: color primario (#1E40AF) con texto blanco. Alto contraste, máxima conversión.

**H2 centrado (texto blanco):** "Sé de los primeros en Palma."

**Subheadline centrado:** "Appark llega en Verano 2026. Únete ahora y consigue acceso antes que nadie, completamente gratis."

**Body copy centrado:**
"Los primeros usuarios de Appark tendrán acceso prioritario a la beta, un badge exclusivo de 'Fundador de la comunidad', y puntos extra desde el primer día. La app es gratis. El acceso anticipado también."

**4 beneficios en chips/badges horizontales:**
- ⚡ Acceso prioritario a la beta
- 🏅 Badge exclusivo "Fundador"
- 🎁 Puntos extra de bienvenida
- 📢 Tu feedback da forma a la app

**Timeline (3 pasos horizontales con línea conectora):**
- Ahora → Lista de espera abierta
- Verano 2026 → Beta privada para los primeros
- Otoño 2026 → Lanzamiento oficial Palma

**Formulario Early Access** (shadcn Form + react-hook-form + zod):

Campos:
- Nombre (required, text, placeholder: "¿Cómo te llamas?")
- Email (required, email, placeholder: "tu@email.com")
- Checkbox: "Acepto recibir actualizaciones de Appark (puedes darte de baja cuando quieras)" (required)
- Submit button: "Quiero acceso prioritario →" (blanco con texto primario, full width)

On submit: POST a /api/early-access (implementar en Next.js API route).
La API route hace fetch a process.env.N8N_EARLY_ACCESS_WEBHOOK_URL con el payload JSON.
Éxito inline: "¡Ya estás en la lista! 🎉 Te avisaremos antes que a nadie cuando llegue tu momento."
Error inline: "Algo salió mal. Inténtalo de nuevo o escríbenos a hola@appark.es"

Texto bajo botón (texto blanco, pequeño): "Sin spam. Solo te avisamos cuando la app esté lista."

---

### 9. FOOTER

Fondo: #0F172A. Texto blanco.

Layout: 3 columnas desktop, 1 columna mobile.

Columna 1: Logo Appark + tagline: "Hecho en Palma, para Palma."
Columna 2: Links: "Política de Privacidad" · "Términos y Condiciones" · "Cookies" (todos href="#" por ahora)
Columna 3: "hola@appark.es" + iconos IG y FB (Lucide: Instagram, Facebook) linking a "#"

Línea inferior: "© 2026 Dharma Brokers. Todos los derechos reservados."

---

## STACK TÉCNICO REQUERIDO

Next.js 14+ con App Router TypeScript (strict mode) Tailwind CSS shadcn/ui (instalar los componentes: Button, Card, Form, Input, Select, Textarea, Checkbox, Badge) react-hook-form + @hookform/resolvers zod (validación de formularios) Lucide React (iconos)


---

## PALETA DE COLORES (Tailwind custom)

En tailwind.config.ts, extender los colores:

```typescript
colors: {
  primary: {
    DEFAULT: '#1E40AF',
    foreground: '#FFFFFF',
  },
  accent: {
    DEFAULT: '#F97316',
    foreground: '#FFFFFF',
  },
  dark: '#0F172A',
  light: '#F8FAFC',
  'success-green': '#10B981',
  surface: '#F1F5F9',
}
VARIABLES DE ENTORNO (.env.local)
N8N_SPONSOR_WEBHOOK_URL=TODO_CONFIGURAR
N8N_EARLY_ACCESS_WEBHOOK_URL=TODO_CONFIGURAR
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=TODO_CONFIGURAR
RECAPTCHA_SECRET_KEY=TODO_CONFIGURAR
API ROUTES A IMPLEMENTAR
/api/early-access/route.ts
Validar body: { nombre: string, email: string, acceptsUpdates: boolean }
Si acceptsUpdates === false, rechazar con 400
Verificar reCAPTCHA (POST a https://www.google.com/recaptcha/api/siteverify con secret key y token)
Si reCAPTCHA falla, rechazar con 400
POST a N8N_EARLY_ACCESS_WEBHOOK_URL con payload: { nombre, email, acceptsUpdates, timestamp: new Date().toISOString(), source: 'appark.es' }
Return 200 { success: true } o 500 { error: 'Internal server error' }
/api/sponsor-contact/route.ts
Validar body: { empresa: string, email: string, telefono?: string, tipoNegocio: string, mensaje?: string }
Verificar reCAPTCHA
POST a N8N_SPONSOR_WEBHOOK_URL con payload: { empresa, email, telefono, tipoNegocio, mensaje, timestamp: new Date().toISOString(), source: 'appark.es' }
Return 200 { success: true } o 500 { error: 'Internal server error' }
SEO (layout.tsx o page.tsx metadata)
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
}
ESTRUCTURA DE ARCHIVOS SUGERIDA
app/
  layout.tsx          ← metadata SEO, fuentes Google (Inter)
  page.tsx            ← importa todas las secciones
  api/
    early-access/
      route.ts
    sponsor-contact/
      route.ts
components/
  landing/
    Navbar.tsx
    Hero.tsx
    TrustBar.tsx
    ProblemSection.tsx
    SolutionSection.tsx
    RegaloSection.tsx
    SponsorsSection.tsx
    EarlyAccessSection.tsx
    Footer.tsx
  forms/
    EarlyAccessForm.tsx
    SponsorForm.tsx
lib/
  schemas.ts          ← zod schemas para los dos formularios
  recaptcha.ts        ← función verifyRecaptcha()
INSTRUCCIONES ADICIONALES
Mobile-first: Todo diseño parte de mobile y se expande a desktop con md:/lg: breakpoints.

Smooth scroll: Añadir scroll-behavior: smooth en el html element.

Animaciones sutiles: Usar Tailwind animate-pulse para los pines verdes del mapa en Hero. Evitar animaciones excesivas que ralenticen el tiempo de carga.

Accesibilidad: Todos los botones con aria-label. Formularios con labels explícitos (htmlFor). Imágenes con alt text descriptivo. CTAs con contraste ≥ 4.5:1.

Performance: Usar next/image para todas las imágenes. No bloquear el render con scripts de terceros.

reCAPTCHA: Por ahora, integrar reCAPTCHA v3 (invisible). El token se genera en el cliente antes del submit y se valida en la API route del servidor. No renderizar el badge de reCAPTCHA visible (configurar con hideDefaultBadge).

Formularios: Sin redirect al enviar. Mostrar estados: loading (botón deshabilitado + spinner), success (mensaje verde inline), error (mensaje rojo inline). El formulario no se limpia en error para que el usuario no pierda lo que escribió.

Tipografía: Importar Inter desde Google Fonts en layout.tsx usando next/font/google.

No incluir: Ninguna mención de competidores (MobiAPParc, Doobl, etc.), ninguna mención del Ajuntament de Palma, ningún precio específico de sponsors.

Idioma del código: Comentarios en inglés. Variables y funciones en inglés. Textos visibles al usuario en español castellano (exactamente como aparecen en este prompt).

Genera el código completo de todos los archivos. Empieza por layout.tsx, page.tsx, y luego los componentes en el orden de la página. Para cada archivo, incluye el path completo como comentario al inicio. Asegúrate de que todo compile con TypeScript en modo strict sin errores.


---

## NOTAS POST-GENERACIÓN

Antes de deployar, el desarrollador debe:

1. **Configurar variables de entorno** en Vercel (o plataforma elegida):
   - `N8N_SPONSOR_WEBHOOK_URL` — URL del webhook n8n para sponsors (Erik lo configura)
   - `N8N_EARLY_ACCESS_WEBHOOK_URL` — URL del webhook n8n para early access (Erik lo configura)
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` — Site key de Google reCAPTCHA v3
   - `RECAPTCHA_SECRET_KEY` — Secret key de Google reCAPTCHA v3

2. **Sustituir imágenes placeholder** por assets reales (ver documento `landing-copy`, sección "Imágenes Necesarias")

3. **Confirmar colores** con Erik si hay paleta de marca Appark oficial

4. **Actualizar hrefs footer** (Privacy, Terms, Cookies) cuando los documentos legales estén listos

5. **Testear formularios end-to-end** con n8n antes del lanzamiento público

---

## DEPLOY RÁPIDO

Stack compatible con deploy en Vercel (recomendado), Netlify o cualquier plataforma que soporte Next.js.

```bash
npx create-next-app@latest appark-landing --typescript --tailwind --app
cd appark-landing
npx shadcn@latest init
npx shadcn@latest add button card form input select textarea checkbox badge
npm install react-hook-form @hookform/resolvers zod lucide-react
Show less
Helpful
Needs work

landing-copy
rev 1
updated 4h ago
Copy Completo + Wireframe + Sugerencias Visuales



Appark.com — Copy Completo + Wireframe + Sugerencias Visuales
Status: Listo para revisión CEO. Todos los textos en ES castellano informal. Pendiente confirmación: pricing sponsors, stats verificadas, paleta de marca oficial.

SEO Metadata
Title tag: Appark | La app gratuita de parking colaborativo en Palma de Mallorca

Meta description: Appark te ayuda a encontrar aparcamiento gratis en Palma de Mallorca en tiempo real. Colaborativa, gratuita y local. Únete a la lista de espera. Verano 2026.

Keywords primarios: app parking Palma de Mallorca · aparcamiento Palma · Appark

Keywords secundarios: encontrar parking Palma · parking colaborativo · app aparcamiento gratuita · cómo aparcar en Palma

H1: "El parking de Palma, resuelto por todos."

NAVBAR
[Logo Appark]     Cómo funciona · Para empresas · Sobre nosotros     [Únete →]
Logo: izquierda
Links: centro (scroll anchor)
CTA: derecha, sticky al hacer scroll
Mobile: hamburger menu
1. HERO SECTION
Headline Principal (H1)
Variante A (comunidad — RECOMENDADA):

"El parking de Palma, resuelto por todos."

Variante B (beneficio tiempo):

"Para de dar vueltas. Aparca con Appark."

Variante C (gift framing):

"El regalo que Palma llevaba años necesitando."

Test A vs B en launch. A conecta con el posicionamiento comunidad; B es más directa para tráfico de búsqueda.

Subheadline
Appark es la app gratuita y colaborativa donde los palmesanos se ayudan a encontrar aparcamiento en tiempo real. Un proyecto de Dharma Brokers para Palma.

CTAs Hero
CTA Primario (usuarios): Únete a la lista de espera → Scroll anchor a sección Early Access (formulario)

CTA Secundario (sponsors/empresas): Quiero ser sponsor fundador → Scroll anchor a sección Sponsors (formulario)

Botón primario: color accent (naranja/coral). Botón secundario: outline/ghost.

Hero Visual — Sugerencias
Opción A (recomendada): Mockup de pantalla de móvil mostrando mapa de Palma con puntos verdes de plazas disponibles, sobre fondo con foto aérea de Palma difuminada.

Opción B: Animación sencilla de mapa de Palma con pines apareciendo (verde = libre, gris = ocupado). Fácil de hacer con CSS animation.

Opción C (si hay presupuesto de vídeo): 15 segundos. Conductor buscando parking → cara de frustración → abre Appark → punto verde → sonrisa. Sin diálogo.

Alt text: "Mapa de Palma de Mallorca con plazas de aparcamiento disponibles en tiempo real en la app Appark"

2. TRUST BAR
🏙️ Hecho en Palma  ·  ✅ 100% gratuito  ·  📅 Verano 2026  ·  🤝 Apoyado por comercios locales
Strip horizontal debajo del hero, fondo sutil.

3. PROBLEM SECTION
Headline (H2)
"¿Cuántas vueltas llevas hoy?"

Subheadline (Referencia Tomeu Penya)
"Dues hores donant voltes per Palma" — Tomeu Penya lo cantó porque todos lo hemos vivido.

Body Copy
El palmesano pasa de media 20 minutos buscando aparcamiento cada vez que sale al centro. En verano, con el turismo disparado, la cosa va a peor.

Tiempo perdido. Gasolina quemada. Nervios de punta. Y cuando por fin encuentras plaza, ya no tienes ganas de nada.

En Palma hay una app para pagar el parking, una app para el bus, una app para las bicicletas... pero ninguna que te diga dónde hay una plaza libre ahora mismo.

Hasta ahora.

⚠️ Nota: La cifra "20 minutos" es estimación razonable, verificar antes de publicar. Si Research no confirma datos de Palma, reemplazar con "minutos preciosos" sin cifra exacta. NO mencionar MobiAPParc ni otras apps por nombre.

Stats Visual (placeholders — verificar antes de usar)
[ 20 min ]          [ 100+ horas ]       [ 0 € ]
 de media buscando    al año perdidas      lo que te cuesta
 aparcamiento         en Palma centro      usar Appark
Solo el tercer stat (0€) es seguro publicarlo sin verificar. Los dos primeros necesitan fuente.

4. SOLUTION SECTION
Headline (H2)
"Appark: el aparcamiento de Palma, colaborativo y gratuito."

Subheadline
Funciona como Waze, pero para aparcar. Tú ayudas a otros, otros te ayudan a ti.

4 Pasos
#	Icono	Título	Descripción
1	📱	Abre Appark	Ve el mapa de Palma en tiempo real con plazas disponibles ahora mismo
2	📍	Sigue el punto verde	Navega hasta la plaza libre que otro palmesano acaba de dejar
3	✅	Aparca y marca	Señala tu plaza en el mapa cuando llegues. 30 segundos, misión cumplida
4	🏆	Gana puntos	Cada plaza compartida suma puntos canjeables en comercios de Palma
Features Clave (grid 2x2)
Mapa en tiempo real

Plazas disponibles actualizadas por la comunidad, segundo a segundo. Sin inventar, sin aproximar.

Gamificación local

Puntos que puedes canjear en tiendas y restaurantes de Palma patrocinadores. Aparcar bien tiene premio.

Para todos

En español, catalán, inglés y alemán. Para palmesanos y para los turistas que también buscan sitio.

Gratis para siempre

Sin suscripciones. Sin anuncios molestos. Gratis hoy, gratis mañana, gratis siempre.

5. "REGALO A PALMA" SECTION
Fondo oscuro / foto Palma de fondo con overlay, texto blanco.

Headline (H2)
"¿Por qué gratis? Porque Palma lo merece."

Subheadline
Appark no es un negocio de parking. Es un proyecto de ciudad.

Body Copy
Somos Dharma Brokers, una empresa con raíces en Mallorca.

Llevamos años viendo cómo el aparcamiento fragmenta la experiencia de vivir en Palma: tiempo perdido, estrés evitable, calles más congestionadas de lo necesario.

Decidimos hacer algo al respecto. No una app de pago. No una plataforma de inversores externos. Un regalo a la ciudad donde vivimos y trabajamos.

Appark es gratuita para palmesanos y visitantes. Se mantiene gracias al apoyo de empresas locales que creen en la comunidad. Sin suscripciones. Sin letra pequeña. Sin trampa.

Pull Quote
"Un regalo de Palma para Palma."

Dharma Brokers (1 línea)
Dharma Brokers es una empresa tecnológica de Palma de Mallorca. Creamos soluciones digitales con impacto local.

6. SPONSORS SECTION
Headline (H2)
"Las empresas locales que hacen posible Appark."

Subheadline
Sin publicidad intrusiva. Sin suscripciones. Appark es gratuita porque negocios de Palma eligen ser parte de algo que mejora la ciudad.

Body Copy
Como sponsor fundador de Appark, tu negocio aparece en el mapa de la app como destino recomendado y punto de canje de premios. Los usuarios llegan a tu puerta en el momento exacto: acaban de aparcar y están a pie de calle.

Esto no es publicidad de Google. Es presencia local de verdad.

Beneficios Sponsors
📍 Visibilidad en el mapa — Tu negocio aparece destacado mientras los usuarios buscan aparcamiento cerca
🎁 Punto de canje de premios — Los usuarios gastan sus puntos Appark en tu negocio
🏅 Badge "Sponsor Fundador" — Reconocimiento exclusivo limitado a los primeros sponsors
📣 Mención en comunicación — Logo en web, redes sociales y comunicados de prensa locales
📊 Datos de zona — Insights de movilidad en tu área (anonimizados, GDPR)
CTA Sponsors
Sé sponsor fundador → formulario sponsor (scroll anchor o modal)

⚠️ NOTA: No incluir pricing hasta confirmación de Erik. Copy actual sin números: "Hablemos de lo que tiene sentido para tu negocio."

Formulario Sponsors
NOMBRE DE TU EMPRESA *         [________________________]
EMAIL DE CONTACTO *            [________________________]
TELÉFONO                       [________________________]
TIPO DE NEGOCIO *              [Dropdown ▼]
  - Restaurante / Bar / Cafetería
  - Comercio / Tienda
  - Servicios profesionales
  - Hostelería
  - Ocio / Entretenimiento
  - Rent-a-car / Movilidad
  - Otro
MENSAJE (opcional)             [________________________]
                               [________________________]

[reCAPTCHA v3]

[Botón: Quiero ser sponsor fundador →]
→ Webhook n8n (URL a configurar por Erik)

Texto bajo botón: "Te responderemos en 24-48 horas. Sin compromiso."
7. EARLY ACCESS SECTION
Fondo de alto contraste. Principal objetivo de conversión.

Headline (H2)
Variante A: "Sé de los primeros en Palma." Variante B: "Los primeros 1.000 tienen ventaja."

Subheadline
Appark llega en Verano 2026. Únete ahora y consigue acceso antes que nadie, de forma completamente gratuita.

Body Copy
Los primeros usuarios de Appark tendrán acceso prioritario a la beta, un badge exclusivo de "Fundador de la comunidad", y puntos extra desde el primer día.

La app es gratis. El acceso anticipado también. Lo único que pedimos: que la uses y la compartas.

Beneficios Early Adopters
⚡ Acceso prioritario a la beta (TestFlight / Play Store)
🏅 Badge exclusivo "Fundador de la comunidad Appark"
🎁 Puntos extra de bienvenida canjeables en sponsors locales
📢 Tu feedback da forma a la app antes del lanzamiento
Timeline
[Ahora]              [Verano 2026]           [Otoño 2026]
Lista de             Beta privada             Lanzamiento
espera abierta   →   para los primeros    →   oficial Palma
Formulario Early Access
NOMBRE *    [________________________]
EMAIL *     [________________________]

☐ Acepto recibir actualizaciones de Appark
  (puedes darte de baja cuando quieras)

[reCAPTCHA v3]

[Botón: Quiero acceso prioritario →]
→ Webhook n8n (URL a configurar por Erik)

Mensaje éxito (inline):
"¡Ya estás en la lista! 🎉 Te avisaremos antes que a nadie cuando llegue tu momento."

Texto bajo botón: "Sin spam. Solo te avisamos cuando la app esté lista."
8. FOOTER
[Logo Appark]

"Appark es un proyecto de Dharma Brokers. Hecho en Palma, para Palma."

[IG]  [FB]

Política de Privacidad · Términos y Condiciones · Cookies

hola@appark.es  |  Palma de Mallorca

© 2026 Dharma Brokers. Todos los derechos reservados.
⚠️ Privacy/Terms no existen aún. Recomendar Termly o Iubenda para generar textos GDPR básicos rápidamente (cubiertos por el checkbox del formulario early access).

WIREFRAME — Jerarquía Visual
┌────────────────────────────────────────┐
│ NAVBAR (sticky): Logo · Links · CTA   │
├────────────────────────────────────────┤
│ HERO (100vh)                          │
│  H1 grande | Mockup app derecha       │
│  Subheadline                          │
│  [CTA A: Únete] [CTA B: Sponsor]      │
├────────────────────────────────────────┤
│ TRUST BAR (strip)                     │
├────────────────────────────────────────┤
│ PROBLEM (2 cols)                      │
│  Copy + stats | Visual (mapa)         │
├────────────────────────────────────────┤
│ SOLUTION (centrado)                   │
│  4 pasos en fila                      │
│  4 features en 2x2 grid               │
├────────────────────────────────────────┤
│ REGALO A PALMA (dark bg + foto)       │
│  H2 + body + pull quote centrado      │
├────────────────────────────────────────┤
│ SPONSORS (fondo claro)                │
│  Body + beneficios + logos grid       │
│  Formulario sponsor                   │
├────────────────────────────────────────┤
│ EARLY ACCESS (high contrast)          │
│  H2 + timeline + beneficios chips     │
│  Formulario early access (centrado)   │
├────────────────────────────────────────┤
│ FOOTER                                │
└────────────────────────────────────────┘
SUGERENCIAS VISUALES
Imágenes Necesarias
#	Sección	Descripción	Fuente
1	Hero	Mockup móvil + mapa Palma con pines verdes	Diseño (Canva/Figma)
2	Problem	Conductor frustrado / calle estrecha Palma	Unsplash/Pexels
3	Solution	4 iconos flat (app, pin, P, trophy)	Lucide Icons
4	Solution	Mockup pantalla app	Diseño
5	Regalo a Palma	Panorámica Palma — Catedral desde mar	Unsplash/Pexels/propia
6	Sponsors	Logos placeholders "Tu negocio aquí"	Diseño
7	Sponsors	Calle comercial Palma (Born/Santa Catalina)	Unsplash/Pexels
Paleta de Colores (propuesta — confirmar con Erik)
Rol	Hex	Uso
Primary blue	#1E40AF	Marca, navbar, links
Accent orange	#F97316	CTAs, highlights
Dark	#0F172A	Texto, secciones oscuras
Light	#F8FAFC	Fondo principal
Success green	#10B981	Pins disponibles, confirmaciones
Surface gray	#F1F5F9	Cards, fondos secundarios
Tipografía (Google Fonts, gratuito)
Rol	Font	Peso
Headlines	Inter o Plus Jakarta Sans	700–800
Body	Inter	400–500
Estilo General
Clean moderno, NO look SaaS genérico (sin gradientes morados)
Palma reconocible: al menos 2 fotos identificables para cualquier mallorquín
Mobile-first: mockups en pantalla de móvil, no desktop
Contraste alto en CTAs (cumplir WCAG AA)
Iconos: Lucide Icons (open source, ya incluido en shadcn/ui)
PENDIENTES / GATING ANTES DE PUBLICAR
 Erik confirma paleta de marca Appark (¿existe o usamos propuesta?)
 Erik confirma pricing tier sponsors (o mantenemos copy sin números)
 Research verifica datos tiempo medio buscando parking en Palma
 Legal: generar Privacy Policy y Terms (sugerencia: Termly o Iubenda)
 Erik configura endpoints n8n para ambos formularios
 Erik configura reCAPTCHA site key para appark.es

## Assistant

Entendido — un proyecto grande para Appark. Antes de diseñar, debo explorar el sistema de diseño de Dharma Brokers (es vinculante para el estilo visual) y aclarar un par de cosas clave.

_[tool: list_files]_

Let me read the core design system files.

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

The Dharma Brokers system is dark-first, gold/orange, premium B2B. But Appark's prompt specifies its own blue/orange consumer palette. There's also a `pivot/` folder — let me check it before deciding.

_[tool: read_file]_

_[tool: read_file]_

I now understand the tension clearly. The **Dharma Brokers** system is dark-first, gold/black, premium-confidential B2B — built for an exit-advisory firm. **Appark** is the opposite: a free, friendly, Mediterranean consumer app with its own blue/orange palette. These are genuinely different brands, and the biggest design decision is how to reconcile them. A few focused questions before I build.

A note on what I deliver: I build a fully-designed, **live single-page landing as a streaming HTML component** — pixel-perfect, interactive, with working form states (loading/success/error) — that opens in a browser and is ready to hand to your developer to wire into Next.js (API routes, n8n webhooks, reCAPTCHA are backend plumbing I'll spec but can't deploy from here). Let me confirm direction:

_[tool: questions_v2]_

## User

Questions answered:
- brand_direction: Decide tú
- appark_logo: Debes crearlo tú, usa tus mejores capacidades creativas y dame varias opciones
- hero_visual: Slot para que yo arrastre una imagen/mockup real después
- hero_headline: Solo la A recomendada: 'El parking de Palma, resuelto por todos.'
- stats_handling: Decide tú
- scope_now: Decide tú
- anything_else: Debe ser extremadamente atractiva y profesional, que tanto los potenciales sponsors como usuarios caigan rendidos y maravillados. Deberá superar ampliamente a la competencia recien creada que puedes investigar en https://www.doobl.app

## Assistant

Decisiones tomadas. Voy a crear una marca propia **Appark** — luminosa y mediterránea, elevada (no el azul/naranja genérico de SaaS), heredando el craft tipográfico de Dharma. Primero investigo al competidor y reviso el craft del sistema.

_[tool: read_file]_

_[tool: read_file]_

_[tool: web_fetch]_

Now I'll set up the brand and build. The user wants a drag-drop image slot for the hero mockup, so I'll grab that starter component.

_[tool: update_todos]_

_[tool: copy_starter_component]_

Now I'll create the stylized Palma map that serves as the hero phone's default screen (droppable — the user can replace it with a real screenshot later).

_[tool: write_file]_

_[tool: view_image]_

SVG preview decoder choked but it'll render fine in-page (I'll verify live). Now building the full landing as one Design Component.

_[tool: dc_write]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: get_webview_logs]_

Those errors are just a browser extension (MetaMask), not my code. Let me re-open and capture.

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: eval_js]_

The page renders fine (h1, nav, slots all present). The screenshot tool had a transient hiccup — let me retry.

_[tool: save_screenshot]_

_[tool: eval_js]_

_[tool: eval_js]_

Everything renders: the Palma map SVG loaded into the hero phone (340×720, complete), Bricolage Grotesque active, all 5 sections present, full ~7000px page. The screenshot tool is glitching but the verifier will check visuals. Marking complete and handing off.

_[tool: update_todos]_

Listo — la landing completa de Appark, lista para revisar.

_[tool: ready_for_verification]_

Esa única "error" es ruido de una extensión del navegador (MetaMask) presente en todas las páginas — no viene de mi código. La página carga limpia. La doy por entregada.

**Appark Landing — entregada.** Una landing de una sola pieza, fluida y responsive, con marca propia que creé para Appark:

**Marca**
- **Paleta mediterránea de Palma** (no el azul/naranja genérico de SaaS): arena cálida `#FBF6EE` (piedra de la Catedral), mar profundo `#11607A`, coral-sol `#FF6A3D` para CTAs, verde "plaza libre" `#1FB877`, tinta `#0A2A36` para secciones oscuras.
- **Tipografía:** Bricolage Grotesque (titulares, con carácter) + Manrope (texto) — evita Inter/Roboto/Fraunces.
- **Logo Appark:** marca pin-con-"P" (App + Park + símbolo de parking). Al final de la página hay una **franja de exploración con 4 variantes de logo** (marcada "solo revisión") — dime cuál prefieres y la aplico en toda la web.

**Funcional**
- Navbar sticky con fondo que aparece al hacer scroll + menú hamburguesa en móvil.
- Hero con maqueta de móvil + mapa de Palma estilizado (pins verdes, ruta, tu ubicación). **La pantalla es un slot:** arrastra encima tu captura real de Appark y la sustituye.
- Slots también para los **6 logos de sponsors** ("Tu logo aquí") y formularios con validación + estados loading/éxito/error inline (no se borran en error). Guardan los envíos en el navegador como demo.
- Secciones: Trust bar · Problema · Solución (4 pasos + 4 features) · Regalo a Palma (oscuro) · Sponsors · Early Access · Footer.

**Decisiones que tomé** (avísame si quieres otra cosa):
- **Stats:** quité las cifras sin verificar (20 min / 100+ horas) y dejé solo lo seguro (0 €, Verano 2026, 4 idiomas). Sin datos inventados.
- Tweaks disponibles: color de acento y mostrar/ocultar la trust bar.

**Para tu desarrollador:** esto es el diseño/front. Falta cablear el backend que no puedo desplegar desde aquí: rutas `/api/early-access` y `/api/sponsor-contact`, webhooks n8n y reCAPTCHA v3. Los formularios ya tienen la estructura de campos exacta para conectarlos.

¿Siguiente paso? Elige logo, o dime si quieres ver **variantes del hero** o ajustar tono/secciones.

## User

Me gusta el logo que has elegido, mantentlo y estructura la página profesionalmente para pasarsela a claude code. De acuerdo con el trabajo realizado y contexto, necesito los entregables adjuntos de marketing

## Assistant

Perfecto — logo A (pin coral) confirmado. Voy a: (1) limpiar la landing quitando el panel de exploración de logos, (2) organizar el proyecto en carpetas con un handoff limpio para Claude Code, y (3) empezar los entregables de marketing, anclados en el **Brand Manual** (es la pieza crítica de la que dependen todas las demás).

Dado el volumen del brief (manual de marca + impresión + social + sellos), lo abordo por prioridad y calidad, no todo a medias.

_[tool: update_todos]_

Now remove the logo exploration aside from the landing.

_[tool: read_file]_

I'll find the aside block to remove it.

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_html_str_replace]_

Landing finalizada. Now the **Brand Manual** — the critical-path deliverable. I'll build it as a print-ready multi-page document codifying the Appark brand I created.

_[tool: dc_write]_

I need the SVG and image-slot assets accessible. The brand manual has no external assets (all inline SVG), good. Let me verify it renders, then build the rest.

_[tool: show_html]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: sleep]_

_[tool: save_screenshot]_

Preview pane is flaky right now. The DC wrote successfully and is structurally sound. Let me continue building the remaining marketing assets, then verify everything at the end. Next: social media templates as a multi-frame canvas.

_[tool: update_todos]_

Now the **social media templates** — as a pannable canvas with real-pixel-size frames (IG post 1080², story 1080×1920, FB 1200×630).

_[tool: dc_write]_

Now **print poster A3, flyer, and sponsor badges** in one print-assets canvas.

_[tool: dc_write]_

I left the frames inside `<helmet>` by mistake. Fixing the helmet boundary.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Now the developer handoff README for Claude Code, then verify everything.

_[tool: write_file]_

_[tool: update_todos]_

All deliverables built. Let me verify the marketing files render (they're the newest and I want the verifier to check the canvas/print layouts).

_[tool: ready_for_verification]_

Listo. Entregado el paquete completo del proyecto Appark.

**Landing** (`Appark Landing.dc.html`) — finalizada con el logo pin-coral aplicado en toda la página, panel de exploración eliminado.

**Handoff para Claude Code** (`HANDOFF.md`) — guía completa: stack Next.js 14, tokens de marca exactos (la paleta mediterránea aprobada), estructura de componentes y carpetas, specs de los 2 formularios con sus 3 estados, API routes con payloads n8n + reCAPTCHA, SEO, y las decisiones de diseño ya cerradas para que no se re-litiguen.

**Entregables de marketing** (carpeta `marketing/`):
- **Brand Manual** — 11 páginas A4 imprimibles a PDF: portada, marca, logo + versiones + usos incorrectos, paleta con HEX/RGB/CMYK, tipografía, iconografía, tono de voz, co-branding sponsors, contraportada.
- **Social Templates** — 6 plantillas en tamaño real (IG post 1080², story 1080×1920, FB 1200×630): Announcement, Problem Hook, Gamificación, Sponsor Spotlight, Did You Know, Community.
- **Print & Badges** — cartel A3 (genérico + variante con zona de sponsor), flyer A6 doble cara, sellos circulares "Sponsor oficial"/"Apoyamos Appark", banner horizontal y vinilo de escaparate.

**Notas sobre el brief de freelancer:** mantuve la paleta mediterránea aprobada en lugar de la sugerencia del borrador (azul #0055CC / Nunito), porque ya la validaste y da un resultado más premium y diferenciado que la competencia. Los QR son placeholders visuales — el desarrollador/imprenta debe generar el QR real apuntando a appark.es. Los textos en alemán del flyer necesitan revisión de un nativo antes de imprimir (como marca el brief).

Para exportar el Brand Manual a PDF o los assets a imágenes/PPTX cuando quieras, dímelo. ¿Empezamos por algún ajuste o seguimos con el handoff a Claude Code?

## User

Necesito que la landing tenga selector de idioma ES/CA/EN/DE y los textos sean dinámicos

## Assistant

Buena adición. Voy a convertir toda la copy a un sistema de traducción dinámico (ES/CA/EN/DE) con selector en el navbar, persistente. Necesito el template actual completo para preservar exactamente los estilos mientras cambio los textos por holes.

_[tool: read_file]_

Voy a reconstruir el archivo completo con sistema i18n. Es un cambio grande pero más fiable que 150 reemplazos sueltos. Mantengo estilos idénticos y muevo todos los textos a un diccionario de 4 idiomas.

_[tool: dc_write]_

## Assistant

Reconstruyo la landing completa con sistema i18n (ES/CA/EN/DE), selector en navbar y persistencia. Todos los textos pasan a un diccionario de 4 idiomas.

_[tool: dc_write]_

## Assistant

Voy a reconstruir la landing con i18n completo. Escribo el archivo entero de una vez.

_[tool: dc_write]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

The preview is showing a stale render. Let me force reload.

_[tool: show_html]_

_[tool: sleep]_

_[tool: eval_js]_

Lang button now renders. Let me test switching to EN and verify text changes + persistence.

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

i18n funciona perfecto: H1, navbar, todas las secciones cambian a inglés, persiste en localStorage y actualiza `html lang`. Reseteo a ES para el usuario y entrego.

_[tool: eval_js]_

Listo. La landing ahora tiene **selector de idioma ES/CA/EN/DE** con textos totalmente dinámicos.

Qué he hecho:
- **Toda la copy** (navbar, hero, problema, solución, regalo, sponsors, early access, footer, formularios, placeholders, opciones del select y mensajes de error/éxito) vive ahora en un diccionario de 4 idiomas. Verificado: al cambiar idioma, cada sección se traduce al instante.
- **Selector en desktop:** botón con icono de globo + idioma actual que despliega los 4 con el activo resaltado. **En móvil:** botón compacto que cicla ES→CA→EN→DE (para no robar espacio al hamburguesa).
- **Persistencia:** guarda la preferencia en el navegador y actualiza `<html lang>` para SEO/accesibilidad. Al recargar mantiene el idioma elegido.
- Los **errores de validación de formularios** también salen en el idioma activo.

Traducciones: castellano original intacto; catalán, inglés y alemán traducidos con tono cercano coherente. La cita de Tomeu Penya se mantiene en catalán en todos los idiomas (es cultural).

**Nota para el handoff:** en Next.js esto se implementa idealmente con rutas localizadas (`/es`, `/ca`, `/en`, `/de`) usando `next-intl` o el i18n routing del App Router, en vez del estado en cliente. Puedo añadir esa nota al HANDOFF.md y estructurar los textos como archivos `messages/[lang].json` listos para copiar si quieres que el desarrollador lo conecte directamente. ¿Lo preparo?

## User

No hay desarrollador, se lo voy a pasar a claude code para que lo estructure en una nueva repo y desplegarlo en vercel. Cambia por favor el logo de facebook en el footer por el de tiktok

## Assistant

Cambio el icono de Facebook por el de TikTok en el footer.

_[tool: dc_html_str_replace]_

Hecho. El icono de Facebook ahora es el de TikTok en el footer (con su `aria-label="TikTok"` actualizado). El enlace sigue en `href="#"` para que apuntes a vuestro perfil real cuando lo tengáis.

