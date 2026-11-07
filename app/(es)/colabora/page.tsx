import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { LangProvider } from '@/components/LangContext'
import Footer from '@/components/landing/Footer'
import ColaboraForm from '@/components/colabora/ColaboraForm'

/**
 * appark.es/colabora: captación de comerciales colaboradores (embudo 0111 del CRM).
 * Solo en español, como el alta y las páginas legales: es para gente de Palma.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/colabora' },
  title: 'Comercial colaborador en Palma, a comisión | Appark',
  description:
    'Ofrece Appark a los comercios de tu barrio o de tu sector. A comisión, sin horario y compatible con otro trabajo: cobras de cada comercio al darse de alta y cada mes durante dos años.',
  openGraph: {
    title: 'Comercial colaborador en Palma | Appark',
    description: 'A comisión, sin horario y compatible con otro trabajo. Apúntate en un minuto.',
    url: '/colabora',
    locale: 'es_ES',
    type: 'website',
  },
}

const POINTS: { t: string; d: string }[] = [
  { t: 'A comisión, sin fijo', d: 'Como autónomo o con tu empresa. Nunca pagas nada por entrar.' },
  { t: 'Cobras dos veces', d: 'Al darse de alta cada comercio y, después, cada mes durante dos años mientras siga.' },
  { t: 'A tu ritmo', d: 'Sin horario ni objetivos mínimos. Compatible con otro trabajo.' },
  { t: 'Tu zona o tu sector', d: 'Palma es pequeña: si ya entras en bares, peluquerías o talleres, empieza por ahí.' },
]

const STEPS: { t: string; d: string }[] = [
  { t: 'Rellenas el formulario', d: 'Un minuto. Te escribimos por WhatsApp con la presentación.' },
  { t: 'Una llamada de 15 minutos', d: 'La reservas tú, a la hora que te venga bien.' },
  { t: 'Firmas online y empiezas', d: 'Desde el móvil. Tienes tu acceso, tu enlace y tu QR al momento, y hacemos juntos tus primeras visitas.' },
]

export default function ColaboraPage() {
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
              Trabaja con Appark · Palma
            </div>
            <h1 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 'clamp(2rem,5vw,3rem)', lineHeight: 1.06, letterSpacing: '-1px', color: '#0A2A36', margin: '0 0 16px' }}>
              Comercial colaborador, a comisión
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: '#45626C', margin: 0 }}>
              Appark es la app con la que los conductores de Palma se avisan de las plazas libres y canjean premios en los comercios del
              barrio. Buscamos gente que ofrezca a esos comercios salir en el mapa, con el primer mes gratis.
            </p>
            <a
              href="#apuntate"
              style={{ display: 'inline-block', marginTop: 22, padding: '14px 26px', borderRadius: 14, background: '#FF4E00', color: '#fff', fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 14px 30px rgba(255,78,0,.25)' }}
            >
              Apúntate en un minuto
            </a>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start', justifyContent: 'center' }}>
            <section style={{ flex: '1 1 340px', maxWidth: 440, minWidth: 0 }} aria-label="Cómo es la colaboración">
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'grid', gap: 12 }}>
                {POINTS.map((p) => (
                  <li key={p.t} style={{ display: 'flex', gap: 12, background: '#fff', border: '1px solid rgba(10,42,54,.08)', borderRadius: 18, padding: '16px 18px' }}>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: '#E6F7EF', color: '#1B8A5A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>✓</span>
                    <span>
                      <strong style={{ display: 'block', fontSize: 15.5, color: '#0A2A36', marginBottom: 2 }}>{p.t}</strong>
                      <span style={{ fontSize: 14.5, lineHeight: 1.5, color: '#45626C' }}>{p.d}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <h2 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 22, color: '#0A2A36', margin: '0 0 14px' }}>Cómo funciona</h2>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
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
            </section>

            <section
              id="apuntate"
              aria-label="Formulario"
              style={{ flex: '1 1 480px', maxWidth: 600, minWidth: 0, background: '#fff', border: '1px solid rgba(10,42,54,.08)', borderRadius: 24, boxShadow: '0 24px 56px rgba(10,42,54,.08)', padding: 'clamp(20px,4vw,32px)', scrollMarginTop: 16 }}
            >
              <h2 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 22, color: '#0A2A36', margin: '0 0 18px' }}>Apúntate</h2>
              <ColaboraForm />
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </LangProvider>
  )
}
