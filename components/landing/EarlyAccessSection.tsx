'use client'
import { useLang } from '@/components/LangContext'
import EarlyAccessForm from '@/components/forms/EarlyAccessForm'

export default function EarlyAccessSection() {
  const { t } = useLang()

  const chips = [
    { icon: '⚡', text: t.eaChip1 },
    { icon: '🏅', text: t.eaChip2 },
    { icon: '🎁', text: t.eaChip3 },
    { icon: '📢', text: t.eaChip4 },
  ]

  const timeline = [
    { title: t.tl1t, desc: t.tl1d, active: true },
    { title: t.tl2t, desc: t.tl2d, active: false },
    { title: t.tl3t, desc: t.tl3d, active: false },
  ]

  return (
    <section id="early-access" style={{ scrollMarginTop: 72, position: 'relative', padding: '104px 24px', background: 'linear-gradient(155deg,#0E5167 0%,#0C3A4A 60%,#0A2A36 100%)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -120, right: -100, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,106,61,.20),transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 960, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#FFB088', marginBottom: 16 }}>{t.eaEyebrow}</div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(2.1rem,4.4vw,3.4rem)', lineHeight: 1.08, letterSpacing: '-1px', color: '#fff', margin: '0 0 16px' }}>{t.eaH2}</h2>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: '#A9C2C9', maxWidth: 620, margin: '0 auto 12px' }}>{t.eaSub}</p>
        <p style={{ fontSize: 15.5, lineHeight: 1.65, color: '#8FAAB2', maxWidth: 620, margin: '0 auto 36px' }}>{t.eaBody}</p>

        {/* Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 11, marginBottom: 44 }}>
          {chips.map(({ icon, text }) => (
            <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', color: '#E5EFF1', fontWeight: 600, fontSize: 14, padding: '10px 18px', borderRadius: 999 }}>
              {icon} {text}
            </span>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', gap: 8, marginBottom: 50 }}>
          {timeline.map(({ title, desc, active }, i) => (
            <div key={title} style={{ flex: '1 1 200px', maxWidth: 240 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
                {i > 0 && <span style={{ flex: 1, height: 2, background: active ? `linear-gradient(90deg,#FF6A3D,rgba(255,255,255,.18))` : 'rgba(255,255,255,.18)' }} />}
                <span style={{ width: 13, height: 13, borderRadius: '50%', background: active ? '#FF6A3D' : 'rgba(255,255,255,.5)', boxShadow: active ? '0 0 0 5px rgba(255,106,61,.22)' : 'none' }} />
                {i < 2 && <span style={{ flex: 1, height: 2, background: 'rgba(255,255,255,.18)' }} />}
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 13.5, color: '#8FAAB2' }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div style={{ maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: 24, padding: '32px 30px', boxShadow: '0 30px 70px rgba(0,0,0,.28)', textAlign: 'left' }}>
          <EarlyAccessForm />
        </div>
      </div>
    </section>
  )
}
