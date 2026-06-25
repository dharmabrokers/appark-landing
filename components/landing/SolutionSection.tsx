'use client'
import { useLang } from '@/components/LangContext'

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

export default function SolutionSection() {
  const { t } = useLang()

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
    <section style={{ padding: '96px 24px', background: 'linear-gradient(180deg,#F4ECDF 0%,#FBF6EE 100%)' }}>
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
