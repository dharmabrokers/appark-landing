import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { LangProvider } from '@/components/LangContext'
import Footer from '@/components/landing/Footer'
import RondaForm from '@/components/ronda/RondaForm'

/**
 * appark.es/ronda: solicitud de invitación a la ronda fundacional (embudo 0120 del
 * CRM). La ronda es PRIVADA y por invitación:
 *   - no se indexa, no está en el sitemap ni se enlaza desde ninguna página;
 *   - no enseña condiciones (importes, intereses, valoración): solo van, en privado, a
 *     quien Erik aprueba después de leer la solicitud;
 *   - pide quién te ha pasado la invitación.
 * Se llega desde la imagen que se reenvía de tú a tú por WhatsApp.
 */
export const metadata: Metadata = {
  title: 'Ronda fundacional | Appark',
  description: 'Ronda fundacional de Appark: solo por invitación y con plazas limitadas.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

const STEPS: { t: string; d: string }[] = [
  { t: 'Reservas tu plaza', d: 'Un minuto. Te llega un correo de confirmación y Erik revisa cada solicitud personalmente: las plazas son limitadas.' },
  { t: 'Te mandamos la documentación', d: 'El dossier, las condiciones y las preguntas frecuentes, y eliges hora para una llamada de 15 minutos.' },
  { t: 'Si te encaja, firmas online', d: 'Desde el móvil, y recibes tu certificado de socio fundador numerado. Si no te encaja, no pasa nada.' },
]

export default function RondaPage({ searchParams }: { searchParams: { de?: string | string[] } }) {
  // ?de=Nombre: quien comparte puede mandar el enlace con su nombre ya puesto.
  const de = searchParams.de
  const referrer = typeof de === 'string' ? de.slice(0, 120) : ''
  return (
    <LangProvider>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#FBF6EE 0%,#F8FAFB 70%)' }}>
        <header style={{ maxWidth: 1080, margin: '0 auto', padding: '18px 20px' }}>
          <Link href="/" aria-label="Appark" style={{ display: 'inline-flex' }}>
            <Image src="/logo-appark-logotipo.png" alt="Appark" width={0} height={0} sizes="120px" priority style={{ display: 'block', height: 30, width: 'auto' }} />
          </Link>
        </header>

        <main style={{ maxWidth: 1080, margin: '0 auto', padding: '8px 16px 72px' }}>
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '12px auto 34px' }}>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#FF4E00', marginBottom: 12 }}>
              Ronda fundacional · Solo por invitación · Plazas limitadas
            </div>
            <h1 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 'clamp(2rem,5vw,3rem)', lineHeight: 1.06, letterSpacing: '-1px', color: '#0A2A36', margin: '0 0 16px' }}>
              Sé socio fundador <span style={{ color: '#FF4E00' }}>de Appark</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: '#45626C', margin: 0 }}>
              Appark guía a los conductores de Palma hasta una plaza libre, y la pagan los comercios del barrio. Está en App Store y Google Play
              desde septiembre. Antes de abrir la ronda a inversores profesionales, la ofrecemos por invitación: los socios fundadores entran
              antes y en mejores condiciones que la próxima ronda. Si te ha llegado la invitación, reserva tu plaza.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start', justifyContent: 'center' }}>
            <section style={{ flex: '1 1 340px', maxWidth: 440, minWidth: 0 }} aria-label="Cómo funciona">
              <h2 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 22, color: '#0A2A36', margin: '0 0 14px' }}>Cómo funciona</h2>
              <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'grid', gap: 14 }}>
                {STEPS.map((s, i) => (
                  <li key={s.t} style={{ display: 'flex', gap: 14 }}>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#0B3041,#08525F)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15 }}>
                      {i + 1}
                    </span>
                    <span>
                      <strong style={{ display: 'block', fontSize: 15.5, color: '#0A2A36', marginBottom: 2 }}>{s.t}</strong>
                      <span style={{ fontSize: 14.5, lineHeight: 1.5, color: '#45626C' }}>{s.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div style={{ background: '#fff', border: '1px solid rgba(10,42,54,.08)', borderRadius: 18, padding: '16px 18px', fontSize: 13.5, lineHeight: 1.6, color: '#45626C' }}>
                <strong style={{ display: 'block', color: '#0A2A36', marginBottom: 4 }}>Importante</strong>
                Es una ronda privada, solo por invitación: no es una oferta pública. Invertir en una empresa en fase inicial tiene riesgo y
                puedes perder lo aportado. Si la compartes, hazlo de tú a tú con quien creas que le puede interesar, no en grupos ni redes.
              </div>
            </section>

            <section
              id="solicitud"
              aria-label="Formulario"
              style={{ flex: '1 1 480px', maxWidth: 600, minWidth: 0, background: '#fff', border: '1px solid rgba(10,42,54,.08)', borderRadius: 24, boxShadow: '0 24px 56px rgba(10,42,54,.08)', padding: 'clamp(20px,4vw,32px)', scrollMarginTop: 16 }}
            >
              <h2 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 22, color: '#0A2A36', margin: '0 0 18px' }}>Reserva tu plaza</h2>
              <RondaForm initialReferrer={referrer} />
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </LangProvider>
  )
}
