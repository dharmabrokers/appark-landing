# Appark — Design System
_Para usar como contexto en Claude Design (claude.ai/design)_

Este documento describe el sistema de marca y UI de **Appark**, tal y como está implementado hoy en producción (`appark-landing`, Next.js 14). Pégalo como contexto al crear nuevos materiales — landing pages adicionales, posts, print, emails, mockups de producto — para que salgan coherentes con lo que ya existe.

---

## 1 · Marca

**Qué es Appark:** app gratuita y colaborativa de parking en tiempo real para Palma de Mallorca. Funciona como Waze, pero para aparcar: los usuarios marcan plazas libres y se ayudan entre ellos. Desarrollada por **Dharma Brokers** como regalo a la ciudad — no es un negocio de parking, es un proyecto de ciudad sostenido por sponsors locales.

**Misión:** devolver a los palmesanos el tiempo que pierden dando vueltas buscando aparcamiento.

**Personalidad:** local, cálida, colaborativa y orgullosa de Palma. Nunca corporativa ni fría. Habla como un vecino, no como un banco.

**Posicionamiento visual:** mediterráneo, luminoso, elevado — deliberadamente *no* el azul/naranja SaaS genérico. Colores del Mediterráneo: arena de la piedra de Palma, azul del mar, coral del atardecer, verde de "plaza libre".

**Tagline oficial:** *"Para de dar vueltas. Empieza a aparcar."*
**Pull quote de marca:** *"Un regalo de Palma para Palma."*

---

## 2 · Logo

Símbolo: **pin de mapa** con la letra **"P"** dentro, en coral (#FF6A3D) sobre fondo blanco o transparente. Wordmark **"Appark"** en Bricolage Grotesque ExtraBold (800), letter-spacing -0.5px a -1.5px según tamaño.

```svg
<svg width="28" height="34" viewBox="0 0 28 34">
  <path d="M14 1.5C7.1 1.5 1.5 6.9 1.5 13.6C1.5 22.8 14 32.5 14 32.5C14 32.5 26.5 22.8 26.5 13.6C26.5 6.9 20.9 1.5 14 1.5Z" fill="#FF6A3D"/>
  <text x="14" y="19.5" text-anchor="middle" font-family="'Bricolage Grotesque',sans-serif" font-weight="800" font-size="15" fill="#fff">P</text>
</svg>
```

**Versiones:**
| Versión | Uso |
|---|---|
| Color (pin coral + texto tinta `#0A2A36`) | Fondos claros — uso principal |
| Blanco (pin coral + texto blanco) | Fondos oscuros o foto |
| Monocromo (pin y texto en `#0A2A36` o negro) | Una tinta, fax, sello |
| Icono solo (pin sobre chip redondeado con gradiente coral) | Icono de app / favicon |

**Reglas:**
- El nombre se escribe siempre **Appark** — A mayúscula, doble p, resto minúscula. Nunca *App Park*, *APPARK* ni *apppark*.
- Área de respeto mínima: la altura de la "a" minúscula del wordmark, en todos los lados.
- Tamaño mínimo: logo completo 24px alto en digital / 12mm en impresión. Icono solo: 16px / 8mm.
- **No:** distorsionar, inclinar, recolorear, aplicar sobre fondos de bajo contraste, cambiar la tipografía, separar en dos palabras, añadir sombras o efectos.

---

## 3 · Color

Tokens reales en `tailwind.config.ts`:

| Token | Hex | RGB | Uso |
|---|---|---|---|
| `coral` (DEFAULT) | `#FF6A3D` | 255 106 61 | CTAs, acentos, eyebrows. **Nunca como fondo grande.** |
| `coral-600` | `#F25A2C` | | Hover/active de coral |
| `sea` (DEFAULT) | `#11607A` | 17 96 122 | Primario — titulares en azul, links, iconos secundarios |
| `sea-700` | `#0E4456` | | Hover/active de sea |
| `ink` | `#0A2A36` | 10 42 54 | Texto principal, fondos oscuros de sección |
| `sand` | `#FBF6EE` | | Fondo principal del sitio |
| `sand2` | `#F4ECDF` | | Fondo secundario / degradados |
| `surface` | `#F8FAFB` | | Fondo sección sponsors |
| `free` | `#1FB877` | | Verde "plaza libre" — solo para disponibilidad y confirmaciones/éxito |
| `muted` | `#45626C` | | Texto de cuerpo secundario |
| `subtle` | `#5C7681` | | Texto terciario, descripciones pequeñas |

**Reglas de uso:**
- Coral solo para CTAs y acentos puntuales — nunca como fondo de sección completo.
- Mar (`sea`) para titulares con énfasis y enlaces.
- Verde (`free`) reservado exclusivamente para "plaza disponible", estados de éxito y confirmaciones — no usarlo decorativamente.
- Contraste mínimo AA 4.5:1 en todo texto.
- Fondos oscuros de sección usan gradiente `linear-gradient(160deg, #0A2A36 0%, #0C3A4A 55%, #0E4456 100%)` con blobs radiales sutiles en verde/mar al 15-20% opacidad para dar profundidad sin ruido.

---

## 4 · Tipografía

Dos familias, ambas de Google Fonts (gratuitas):

| Familia | Uso | Pesos |
|---|---|---|
| **Bricolage Grotesque** | Titulares (H1–H3), números grandes, wordmark | 700, 800 |
| **Manrope** | Cuerpo de texto, UI, formularios | 400, 500, 600, 700, 800 |

**Escala tipográfica real (implementada en componentes):**
| Elemento | Tamaño | Line-height | Letter-spacing |
|---|---|---|---|
| H1 (hero) | `clamp(2.7rem, 6vw, 4.6rem)` | 1.03 | -1.5px |
| H2 (sección) | `clamp(2rem, 4vw, 3.1rem)` | 1.08 | -1px |
| H3 (card/form title) | 20–24px | 1.05–1.2 | normal |
| Body | 15–18px | 1.6–1.75 | normal |
| Eyebrow (label de sección) | 13px, uppercase | 1 | 2.5px, color coral |
| Botón | 15–17px, weight 700 | 1 | normal |

Ejemplo de eyebrow: `font-weight:800; letter-spacing:2.5px; text-transform:uppercase; color:#FF6A3D; font-size:13px`.

---

## 5 · Forma, espaciado y sombra

**Radios (border-radius):**
- Botones: 13–15px
- Cards e inputs: 12–14px
- Cards grandes / secciones destacadas: 18–26px
- Chips / badges: 999px (pill)

**Sombras:**
- Card sutil: `0 12px 30px rgba(10,42,54,.05)` a `0 14px 36px rgba(10,42,54,.06)`
- Card elevada (formulario): `0 24px 56px rgba(10,42,54,.10)`
- CTA coral: `0 10px 26px rgba(255,106,61,.32)` a `0 14px 34px rgba(255,106,61,.38)`
- Modal/form flotante sobre fondo oscuro: `0 30px 70px rgba(0,0,0,.28)`
- Phone mockup: `0 40px 80px rgba(10,42,54,.30), 0 8px 22px rgba(10,42,54,.18)`

**Contenedores:** `max-width: 1180px–1200px`, `padding: 96–118px` vertical por sección, `24px` horizontal en mobile.

---

## 6 · Componentes

**Botón primario (CTA):** fondo `coral`, texto blanco, weight 700, padding `16–17px 22–30px`, radius 13–15px, sombra coral, hover: `brightness(1.05)` + `translateY(-1/-2px)`.

**Botón secundario (outline):** fondo blanco/transparente, borde `1.5px solid rgba(10,42,54,.14)`, texto `ink`, hover: borde y texto pasan a `sea`.

**Input/select/textarea:** fondo `#FCFAF6`, borde `1.5px solid rgba(10,42,54,.14)`, radius 12px, padding `13–14px 15px`. Focus: borde `sea` + `box-shadow: 0 0 0 3px rgba(17,96,122,.10)`.

**Formularios — 3 estados obligatorios:**
- `loading`: botón deshabilitado, spinner girando (`animate-spin2`), opacidad 0.75, texto "Enviando…"
- `success`: sustituye el formulario por mensaje inline con icono de check verde — **nunca redirect**, nunca se borran los campos en error
- `error`: banner rojo inline (`background:#FDEAE6; border:1px solid #F8C7BC; color:#C23B1C`) sobre el botón

**Cards de stat/feature:** fondo blanco, borde `1px solid rgba(10,42,54,.06-.08)`, radius 22–24px, número/icono destacado + texto secundario en `subtle`.

**Chips/badges:** pill (radius 999px), fondo `rgba(255,255,255,.08)` sobre oscuro o blanco sólido sobre claro, borde sutil, texto weight 600–700.

**Sección tipo (anatomía estándar):** eyebrow uppercase coral → H2 Bricolage Grotesque → subheadline en `muted` → contenido. Centrado para secciones de conversión, dos columnas para secciones informativas.

**Navbar:** fixed, fondo transparente que pasa a `rgba(251,246,238,.92)` con blur y sombra al hacer scroll (>24px). Selector de idioma con dropdown (desktop) o ciclo por tap (mobile, <880px). Hamburguesa en mobile.

**Cookie banner:** fijo abajo, fondo `ink`, botón "Aceptar" en `free` (verde), botón "Solo esenciales" outline. Aparece a los 1000ms si no hay consentimiento guardado.

---

## 7 · Iconografía

**Lucide Icons** (línea, no relleno), trazo 2px, `stroke-linecap` y `stroke-linejoin: round`, tamaño base 20–24px. Color según contexto: `sea` en fondos claros neutros, blanco/verde sobre fondo oscuro, coral/verde/ámbar en chips de feature con fondo de color suave a juego.

Iconos core del sistema: pin/plaza (MapPin), coche, smartphone, reloj, trofeo/premio, check, globo (idioma), regalo, corazón.

---

## 8 · Motion

Animaciones sutiles, con propósito — nunca decorativas porque sí:
- `ping2` (1.8s ease-out infinite): pulso de disponibilidad en pines verdes de "plaza libre"
- `float` / `float2` / `float3` (5–7s ease-in-out infinite): flotación suave del mockup de móvil y sus badges — sensación orgánica, no mecánica
- `spin2` (0.7s linear infinite): spinner de loading en botones

---

## 9 · Voz y tono

Castellano cercano, directo, con orgullo mallorquín. Frases cortas. Cero jerga corporativa. Guiño local cuando encaja (la referencia a Tomeu Penya en la sección de problema es intencional y se mantiene en catalán en las 4 traducciones).

| ✓ Sí | ✕ No |
|---|---|
| "Para de dar vueltas." | "Optimiza tu experiencia de movilidad." |
| "Tú ayudas, otros te ayudan." | "Plataforma líder en soluciones de parking." |
| "Gratis hoy, gratis mañana, gratis siempre." | "Regístrate para desbloquear features premium." |
| "Un regalo de Palma para Palma." | Tecnicismos, MAYÚSCULAS gritando |

**Restricciones de copy vigentes:** sin mención a competidores (Doobl, MobiAPParc, etc.), sin mención al Ajuntament de Palma, sin pricing de sponsors visible ("Hablemos de lo que tiene sentido para tu negocio").

---

## 10 · Idiomas

El sitio es multiidioma: **ES / CA / EN / DE**, selector persistente en navbar (dropdown desktop, ciclo en mobile), guardado en `localStorage`. Todo copy nuevo debe traducirse a los 4 idiomas antes de integrarse — nunca dejar un idioma con fallback a español salvo la cita de Tomeu Penya, que se mantiene siempre en catalán como guiño cultural.

---

## 11 · Co-branding con sponsors

El sello "Sponsor Appark" va siempre separado del logo del comercio por una línea divisoria o el área de respeto completa — nunca fusionados. En materiales del sponsor, su logo manda; el sello Appark es secundario, tamaño igual o menor. Versión color y monocromo disponibles.

---

## 12 · Accesibilidad

- Todos los botones con `aria-label` cuando el texto visible no es suficientemente descriptivo (idioma, hamburguesa, redes sociales).
- Labels explícitos con `htmlFor` en todos los inputs.
- Imágenes con `alt` descriptivo (ej. mapa del hero).
- Contraste de CTAs ≥ 4.5:1.
- Foco visible en inputs (ring `sea` al 10% opacidad).

---

## 13 · Referencia rápida de valores

```
Coral       #FF6A3D   — CTAs, acentos
Coral 600   #F25A2C   — hover coral
Mar         #11607A   — primario, links
Mar 700     #0E4456   — hover mar
Tinta       #0A2A36   — texto, fondos oscuros
Arena       #FBF6EE   — fondo principal
Arena 2     #F4ECDF   — fondo secundario
Surface     #F8FAFB   — fondo sponsors
Verde libre #1FB877   — disponibilidad, éxito
Muted       #45626C   — texto secundario
Subtle      #5C7681   — texto terciario

Display: Bricolage Grotesque (700/800)
Body:    Manrope (400–800)
```
