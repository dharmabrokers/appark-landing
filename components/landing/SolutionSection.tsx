'use client'
import { useLang } from '@/components/LangContext'
import { SEO_CONTENT } from '@/lib/seoContent'

const SmartphoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#11607A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2.5" /><line x1="12" y1="18" x2="12" y2="18" />
  </svg>
)
const MapPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1FB877" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
)
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.8 7 10 18.8 4.2 13" />
  </svg>
)
const TrophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E0A12A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4h10v4a5 5 0 0 1-10 0Z" />
    <path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 2.5M17 6h2.5a2.5 2.5 0 0 1-2.5 2.5M9 20h6M12 14v6" />
  </svg>
)
const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3FD592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
  </svg>
)
const GiftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" />
  </svg>
)
const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#11607A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
  </svg>
)
const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1FB877" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z" />
  </svg>
)

// Iconos de la tarjeta «por dentro», en línea clara sobre el fondo oscuro.
const CarPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3FD592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-6-5.4-6-9.5a6 6 0 0 1 12 0C18 15.6 12 21 12 21Z" /><path d="M9.5 11.5h5M10 9.5l.6-1.5h2.8l.6 1.5" />
  </svg>
)
const SignalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7FC5CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2" /><path d="M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7M5.6 18.4a9 9 0 0 1 0-12.8M18.4 5.6a9 9 0 0 1 0 12.8" />
  </svg>
)
const SparkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F2C14E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4Z" />
  </svg>
)
const NearIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF8A63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 21 3 13 21 11 13 3 11" />
  </svg>
)
const TECH_ICONS = [<CarPinIcon key="car" />, <SignalIcon key="signal" />, <SparkIcon key="spark" />, <NearIcon key="near" />]

export default function SolutionSection() {
  const { t, lang } = useLang()
  const tech = SEO_CONTENT[lang].tech

  const steps = [
    { num: 1, icon: <SmartphoneIcon />, bg: '#E6F1F4', title: t.step1t, desc: t.step1d },
    { num: 2, icon: <MapPinIcon />, bg: '#E6F7EF', title: t.step2t, desc: t.step2d },
    { num: 3, icon: <CheckIcon />, bg: '#FDE9E0', title: t.step3t, desc: t.step3d },
    { num: 4, icon: <TrophyIcon />, bg: '#FBF0D8', title: t.step4t, desc: t.step4d },
  ]

  const features = [
    { icon: <MapIcon />, iconBg: 'rgba(31,184,119,.16)', title: t.feat1t, desc: t.feat1d, dark: true },
    { icon: <GiftIcon />, iconBg: '#FDE9E0', title: t.feat2t, desc: t.feat2d, dark: false },
    { icon: <GlobeIcon />, iconBg: '#E6F1F4', title: t.feat3t, desc: t.feat3d, dark: false },
    { icon: <HeartIcon />, iconBg: '#E6F7EF', title: t.feat4t, desc: t.feat4d, dark: false },
  ]

  return (
    <section id="como-funciona" style={{ scrollMarginTop: 72, padding: '96px 24px', background: 'linear-gradient(180deg,#F4ECDF 0%,#FBF6EE 100%)' }}>
      <div style={{ width: '100%', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 60px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#FF6A3D', marginBottom: 16 }}>{t.solEyebrow}</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.1rem)', lineHeight: 1.08, letterSpacing: '-1px', color: '#0A2A36', margin: '0 0 18px' }}>{t.solH2}</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#45626C', margin: 0 }}>{t.solSub}</p>
        </div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20, marginBottom: 30 }}>
          {steps.map(({ num, icon, bg, title, desc }) => (
            <div key={num} style={{ background: '#fff', borderRadius: 22, padding: '30px 26px', border: '1px solid rgba(10,42,54,.06)', boxShadow: '0 12px 30px rgba(10,42,54,.05)', position: 'relative' }}>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 54, color: '#F1E8D8', lineHeight: .8, position: 'absolute', top: 18, right: 22 }}>{num}</div>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>{icon}</div>
              <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 20, color: '#0A2A36', margin: '0 0 8px' }}>{title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#5C7681', margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Por dentro: lo que hace la app sola, contado sin tecnicismos y
            atado a lo que duele (el coche que no encuentras, las vueltas,
            los puntos que nadie apunta, el premio que pilla lejos). */}
        <div style={{ background: '#0A2A36', borderRadius: 26, padding: 'clamp(28px,4vw,44px)', marginBottom: 30, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -140, right: -120, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(63,213,146,.16),transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 720, marginBottom: 30 }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#3FD592', marginBottom: 12 }}>{tech.eyebrow}</div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.2rem)', lineHeight: 1.12, letterSpacing: '-.5px', color: '#fff', margin: '0 0 12px' }}>{tech.title}</h3>
            <p style={{ fontSize: 16.5, lineHeight: 1.6, color: '#B9CBD1', margin: 0 }}>{tech.intro}</p>
          </div>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16 }}>
            {tech.items.map(({ t: title, d }, i) => (
              <div key={title} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: '22px 20px' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{TECH_ICONS[i]}</div>
                <h4 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17.5, color: '#fff', margin: '0 0 7px' }}>{title}</h4>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#B9CBD1', margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
          <p style={{ position: 'relative', fontSize: 13.5, lineHeight: 1.6, color: '#7E99A1', margin: '22px 0 0' }}>{tech.note}</p>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {features.map(({ icon, iconBg, title, desc, dark }) => (
            <div key={title} style={{ background: dark ? '#0A2A36' : '#fff', border: dark ? 'none' : '1px solid rgba(10,42,54,.07)', borderRadius: 24, padding: '34px 32px', boxShadow: dark ? 'none' : '0 12px 30px rgba(10,42,54,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 21, margin: 0, color: dark ? '#fff' : '#0A2A36' }}>{title}</h3>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: dark ? '#B9CBD1' : '#5C7681', margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
