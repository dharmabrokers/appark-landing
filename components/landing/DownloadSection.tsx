'use client'
import Image from 'next/image'
import { useLang } from '@/components/LangContext'
import { STORES } from '@/lib/stores'

/**
 * Descargar la app: el sitio al que lleva toda la página tras el
 * lanzamiento. Sustituye al formulario de acceso anticipado.
 *
 * QR en escritorio (quien mira la web en el ordenador tiene el móvil en
 * la mano) y botón grande en el móvil, donde un QR no se puede escanear
 * desde la propia pantalla. Una tienda que aún no está publicada se
 * enseña como próxima, sin enlace: ver lib/stores.ts.
 */
export default function DownloadSection() {
  const { t } = useLang()

  const stores = [
    { ...STORES.googlePlay, platform: 'Android', label: t.dlGooglePlay },
    { ...STORES.appStore, platform: 'iPhone', label: t.dlAppStore },
  ]
  const chips = [
    { icon: '🟢', text: t.dlChip1 },
    { icon: '🎁', text: t.dlChip2 },
    { icon: '✅', text: t.dlChip3 },
  ]

  return (
    <section id="descargar" style={{ scrollMarginTop: 72, position: 'relative', padding: '104px 24px', background: 'linear-gradient(155deg,#0E5167 0%,#0C3A4A 60%,#0A2A36 100%)', overflow: 'hidden' }}>
      <style>{'@media (max-width: 640px){.dl-qr{display:none!important}}'}</style>
      <div style={{ position: 'absolute', top: -120, right: -100, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,78,0,.20),transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 980, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#FFB088', marginBottom: 16 }}>{t.dlEyebrow}</div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(2.1rem,4.4vw,3.4rem)', lineHeight: 1.08, letterSpacing: '-1px', color: '#fff', margin: '0 0 16px' }}>{t.dlH2}</h2>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: '#A9C2C9', maxWidth: 640, margin: '0 auto 30px' }}>{t.dlSub}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 11, marginBottom: 46 }}>
          {chips.map(({ icon, text }) => (
            <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', color: '#E5EFF1', fontWeight: 600, fontSize: 14, padding: '10px 18px', borderRadius: 999 }}>
              {icon} {text}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 22 }}>
          {stores.map((s) => (
            <div key={s.url} style={{ flex: '1 1 300px', maxWidth: 400, background: '#fff', borderRadius: 24, padding: '28px 26px', boxShadow: '0 30px 70px rgba(0,0,0,.28)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8A9BA2', marginBottom: 12 }}>{s.platform}</div>
              {s.live ? (
                <>
                  <div className="dl-qr" style={{ width: 196, height: 196, margin: '0 auto 12px', padding: 12, borderRadius: 18, border: '1px solid rgba(10,42,54,.10)', background: '#fff' }}>
                    <Image src={s.qr} alt={`QR · ${s.label}`} width={172} height={172} unoptimized style={{ display: 'block', width: '100%', height: '100%' }} />
                  </div>
                  <p className="dl-qr" style={{ fontSize: 13.5, color: '#5C7681', fontWeight: 600, margin: '0 0 16px' }}>{t.dlScan}</p>
                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, textDecoration: 'none', background: '#FF4E00', color: '#fff', fontWeight: 800, fontSize: 16.5, padding: '16px 18px', borderRadius: 14, boxShadow: '0 12px 28px rgba(255,78,0,.32)' }}>
                    {s.label} <span style={{ fontSize: 18 }}>→</span>
                  </a>
                </>
              ) : (
                <div style={{ padding: '54px 10px', color: '#5C7681', fontWeight: 700, fontSize: 16 }}>🕒 {t.dlSoon}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
