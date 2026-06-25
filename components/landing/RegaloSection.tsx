'use client'
import { useLang } from '@/components/LangContext'

export default function RegaloSection() {
  const { t } = useLang()
  return (
    <section id="sobre-nosotros" style={{ scrollMarginTop: 72, position: 'relative', padding: '104px 24px', background: 'linear-gradient(160deg,#0A2A36 0%,#0C3A4A 55%,#0E4456 100%)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: -160, left: -120, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle,rgba(31,184,119,.16),transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -100, right: -120, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle,rgba(127,197,206,.18),transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 50px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#3FD592', marginBottom: 16 }}>{t.giftEyebrow}</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.1rem)', lineHeight: 1.1, letterSpacing: '-1px', color: '#fff', margin: '0 0 16px' }}>{t.giftH2}</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#9FB6BD', margin: 0 }}>{t.giftSub}</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, marginBottom: 54 }}>
          <div style={{ flex: '1 1 320px', minWidth: 280 }}>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: '#C7D7DC', margin: '0 0 16px' }}>{t.giftL1}</p>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: '#C7D7DC', margin: '0 0 16px' }}>{t.giftL2}</p>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: '#C7D7DC', margin: 0 }}>{t.giftL3}</p>
          </div>
          <div style={{ flex: '1 1 320px', minWidth: 280 }}>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: '#C7D7DC', margin: '0 0 16px' }}>{t.giftR1}</p>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: '#C7D7DC', margin: '0 0 16px' }}>
              <strong style={{ color: '#fff' }}>{t.giftR2}</strong>
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: '#C7D7DC', margin: 0 }}>{t.giftR3}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.12)', borderBottom: '1px solid rgba(255,255,255,.12)', padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 'clamp(1.7rem,3.4vw,2.6rem)', lineHeight: 1.2, margin: 0, background: 'linear-gradient(120deg,#FFB088,#FF6A3D)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.giftQuote}
          </p>
        </div>
      </div>
    </section>
  )
}
