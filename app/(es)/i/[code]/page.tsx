import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CopyCode from '@/components/invite/CopyCode'
import { inviteDownloadPath, normalizeInviteCode } from '@/lib/invite'

/**
 * appark.es/i/<código>: lo que abre el amigo desde el WhatsApp o el QR de quien le
 * invita (campaña «Quien avisa no es traidor», Appark-main 0116).
 *
 * Paso 1, descargar (por /descargar, que manda a su tienda y cuenta el clic).
 * Paso 2, escribir el código en la app («¿Te ha invitado alguien?»).
 * La atribución automática llegará con la próxima versión nativa de la app.
 */
export const metadata: Metadata = {
  title: 'Te han invitado a Appark',
  description: 'En Palma nos avisamos de las plazas libres y ganamos premios en comercios. Descarga Appark y pon el código de tu amigo.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Quien avisa no es traidor · Appark',
    description: 'Te han invitado a Appark: plazas libres en Palma, avisadas por vecinos, y premios en comercios del barrio.',
    locale: 'es_ES',
    type: 'website',
  },
}

export default async function InvitePage({ params }: { params: { code: string } }) {
  const code = normalizeInviteCode(params.code)
  if (!code) notFound()

  const step: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-start', textAlign: 'left' }
  const num: React.CSSProperties = {
    flexShrink: 0, width: 30, height: 30, borderRadius: 10, background: 'linear-gradient(135deg,#0B3041,#08525F)',
    color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#FBF6EE 0%,#F8FAFB 70%)', padding: '18px 16px 60px' }}>
      <header style={{ maxWidth: 1080, margin: '0 auto 24px' }}>
        <Link href="/" aria-label="Appark" style={{ display: 'inline-flex' }}>
          <Image src="/logo-appark-logotipo.png" alt="Appark" width={0} height={0} sizes="120px" priority style={{ display: 'block', height: 30, width: 'auto' }} />
        </Link>
      </header>
      <main style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#FF4E00', marginBottom: 12 }}>
          Te han invitado
        </div>
        <h1 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 'clamp(2rem,6vw,2.8rem)', lineHeight: 1.05, letterSpacing: '-1px', color: '#0A2A36', margin: '0 0 12px' }}>
          Quien avisa no es traidor
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: '#45626C', margin: '0 0 26px' }}>
          En Appark los conductores de Palma nos avisamos de las plazas libres y ganamos premios en comercios del barrio.{' '}
          <strong style={{ color: '#0A2A36' }}>Más ojos, menos vueltas.</strong>
        </p>

        <section style={{ background: '#fff', border: '1px solid rgba(10,42,54,.08)', borderRadius: 24, boxShadow: '0 24px 56px rgba(10,42,54,.08)', padding: 'clamp(20px,5vw,32px)', display: 'grid', gap: 20 }}>
          <div style={step}>
            <span style={num}>1</span>
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block', color: '#0A2A36', fontSize: 16, marginBottom: 8 }}>Descarga Appark</strong>
              <a
                href={inviteDownloadPath(code)}
                style={{ display: 'inline-block', background: '#FF4E00', color: '#fff', fontWeight: 800, fontSize: 16, padding: '13px 22px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 14px 30px rgba(255,78,0,.25)' }}
              >
                Descargar la app
              </a>
            </div>
          </div>
          <div style={step}>
            <span style={num}>2</span>
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block', color: '#0A2A36', fontSize: 16, marginBottom: 4 }}>Pon el código de tu amigo</strong>
              <span style={{ display: 'block', fontSize: 14.5, color: '#45626C', marginBottom: 12 }}>
                En la pestaña de puntos, en «¿Te ha invitado alguien?», durante tus primeros 7 días.
              </span>
              <CopyCode code={code} />
            </div>
          </div>
          <div style={step}>
            <span style={num}>3</span>
            <div style={{ flex: 1, fontSize: 14.5, color: '#45626C', lineHeight: 1.5 }}>
              <strong style={{ display: 'block', color: '#0A2A36', fontSize: 16, marginBottom: 4 }}>Avisa tus primeras plazas</strong>
              Cuando avises unas pocas plazas en días distintos, ganáis puntos los dos para canjear en comercios de Palma.
            </div>
          </div>
        </section>

        <p style={{ fontSize: 12.5, color: '#7C919A', marginTop: 18 }}>
          <Link href="/legal/invita" style={{ color: '#11607A', fontWeight: 700 }}>Condiciones de la campaña</Link>
        </p>
      </main>
    </div>
  )
}
