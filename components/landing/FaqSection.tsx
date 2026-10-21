'use client'
import { useLang } from '@/components/LangContext'
import { SEO_CONTENT } from '@/lib/seoContent'

/**
 * Preguntas frecuentes. Las mismas que van en el FAQPage del JSON-LD
 * (lib/seo.ts): Google sólo acepta datos estructurados de lo que se ve en
 * la página, y una respuesta corta y autosuficiente es lo que un asistente
 * de IA cita cuando le preguntan por aparcar en Palma.
 *
 * <details> y no un acordeón con estado: las respuestas están en el HTML
 * desde el servidor, plegadas o no, y se abren sin JavaScript.
 */
export default function FaqSection() {
  const { lang } = useLang()
  const c = SEO_CONTENT[lang]

  return (
    <section id="preguntas" style={{ scrollMarginTop: 72, padding: '96px 24px', background: '#FBF6EE' }}>
      <div style={{ width: '100%', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#FF6A3D', marginBottom: 16 }}>{c.faqEyebrow}</div>
          <h2 style={{ fontFamily: "var(--font-display), sans-serif", fontWeight: 800, fontSize: 'clamp(1.9rem,3.6vw,2.8rem)', lineHeight: 1.1, letterSpacing: '-1px', color: '#0A2A36', margin: 0 }}>{c.faqH2}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {c.faq.map(({ q, a }, i) => (
            <details key={q} open={i === 0} className="faq-item"
              style={{ background: '#fff', borderRadius: 18, border: '1px solid rgba(10,42,54,.07)', boxShadow: '0 8px 22px rgba(10,42,54,.04)', padding: '0 24px' }}>
              <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 0', fontFamily: "var(--font-display), sans-serif", fontWeight: 700, fontSize: 18, color: '#0A2A36' }}>
                <h3 style={{ font: 'inherit', margin: 0 }}>{q}</h3>
                <span aria-hidden="true" className="faq-sign" style={{ flex: 'none', width: 28, height: 28, borderRadius: 8, background: '#F4ECDF', color: '#11607A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>+</span>
              </summary>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: '#45626C', margin: '0 0 22px' }}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
