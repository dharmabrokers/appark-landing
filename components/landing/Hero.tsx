'use client'
import Image from 'next/image'
import { useLang } from '@/components/LangContext'

const PingDot = ({ color = '#1FB877' }: { color?: string }) => (
  <span style={{ position: 'relative', width: 9, height: 9, display: 'inline-block' }}>
    <span className="animate-ping2" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, opacity: 0.5 }} />
    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
  </span>
)

export default function Hero() {
  const { t } = useLang()
  return (
    <header id="hero" style={{ scrollMarginTop: 80, position: 'relative', padding: '118px 24px 70px', background: 'radial-gradient(1200px 600px at 78% 8%,#FBEFE2 0%,#FBF6EE 55%)' }}>
      <div style={{ position: 'absolute', top: -120, right: -160, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle,rgba(127,197,206,.30),transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '56px 40px', position: 'relative' }}>
        {/* Text column */}
        <div style={{ flex: '1 1 460px', minWidth: 300 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#fff', border: '1px solid rgba(10,42,54,.09)', padding: '7px 14px 7px 11px', borderRadius: 999, boxShadow: '0 4px 14px rgba(10,42,54,.05)', marginBottom: 24 }}>
            <PingDot />
            <span style={{ fontWeight: 700, fontSize: 13, color: '#0A2A36', letterSpacing: '.2px' }}>{t.heroBadge}</span>
          </div>

          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(2.7rem,6vw,4.6rem)', lineHeight: 1.03, letterSpacing: '-1.5px', color: '#0A2A36', margin: '0 0 22px' }}>
            {t.heroH1a}<br /><span style={{ color: '#11607A' }}>{t.heroH1b}</span>
          </h1>

          <p style={{ fontSize: 'clamp(1.05rem,1.6vw,1.28rem)', lineHeight: 1.6, color: '#45626C', maxWidth: 540, margin: '0 0 34px' }}>
            {t.heroSubA}<strong style={{ color: '#0A2A36', fontWeight: 700 }}>{t.heroSubStrong}</strong>{t.heroSubB}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <a href="#early-access"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 9, background: '#FF6A3D', color: '#fff', fontWeight: 700, fontSize: 17, padding: '17px 30px', borderRadius: 15, boxShadow: '0 14px 34px rgba(255,106,61,.38)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.05)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = '' }}>
              {t.heroCta1} <span style={{ fontSize: 18 }}>→</span>
            </a>
            {/* Hidden until we have 3+ real sponsors - APP-73 */}
            {/* <a href="#sponsors"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 9, background: '#fff', color: '#0A2A36', fontWeight: 700, fontSize: 17, padding: '17px 28px', borderRadius: 15, border: '1.5px solid rgba(10,42,54,.14)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#11607A'; e.currentTarget.style.color = '#11607A' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(10,42,54,.14)'; e.currentTarget.style.color = '#0A2A36' }}>
              {t.heroCta2}
            </a> */}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 30 }}>
            <div style={{ display: 'flex' }}>
              {['#11607A', '#1FB877', '#FF6A3D'].map((bg, i) => (
                <span key={i} style={{ width: 34, height: 34, borderRadius: '50%', background: bg, border: '2.5px solid #FBF6EE', display: 'inline-block', marginLeft: i === 0 ? 0 : -12 }} />
              ))}
            </div>
            <span style={{ fontSize: 14, color: '#5C7681', fontWeight: 500 }}>{t.heroSocial}</span>
          </div>
        </div>

        {/* Phone mockup column */}
        <div style={{ flex: '1 1 340px', minWidth: 290, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div className="animate-float" style={{ position: 'relative', width: 300 }}>
            <div style={{ position: 'relative', width: 300, height: 618, background: '#0A2A36', borderRadius: 46, padding: 11, boxShadow: '0 40px 80px rgba(10,42,54,.30),0 8px 22px rgba(10,42,54,.18)' }}>
              {/* Notch */}
              <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', width: 108, height: 26, background: '#0A2A36', borderRadius: '0 0 16px 16px', zIndex: 5 }} />
              {/* Screen */}
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden', background: '#EFE4D2' }}>
                <Image
                  src="/hero-map.svg"
                  alt="Mapa de Palma de Mallorca con plazas de aparcamiento disponibles en tiempo real en la app Appark"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                {/* Status bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 46, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 22px 7px', fontSize: 12, fontWeight: 700, color: '#0A2A36', zIndex: 4 }}>
                  <span>9:41</span><span style={{ opacity: .8 }}>●●● ▮</span>
                </div>
              </div>
            </div>

            {/* Floating badge: free spot */}
            <div className="animate-float2" style={{ position: 'absolute', top: 88, right: -34, background: '#fff', borderRadius: 15, padding: '11px 15px', boxShadow: '0 16px 34px rgba(10,42,54,.18)', display: 'flex', alignItems: 'center', gap: 9, zIndex: 6 }}>
              <PingDot />
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0A2A36', lineHeight: 1.1 }}>{t.chipFree}</div>
                <div style={{ fontSize: 11, color: '#5C7681', fontWeight: 500 }}>{t.chipDist}</div>
              </div>
            </div>

            {/* Floating badge: spots count */}
            <div className="animate-float3" style={{ position: 'absolute', bottom: 74, left: -40, background: '#11607A', color: '#fff', borderRadius: 15, padding: '13px 16px', boxShadow: '0 16px 34px rgba(17,96,122,.32)', zIndex: 6 }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", lineHeight: 1 }}>+34</div>
              <div style={{ fontSize: 11, opacity: .85, fontWeight: 600 }}>{t.chipNear}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
