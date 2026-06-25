'use client'
import { useLang } from '@/components/LangContext'
import SponsorForm from '@/components/forms/SponsorForm'

const BenefitRow = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div style={{ display: 'flex', gap: 15, alignItems: 'flex-start' }}>
    <div style={{ flex: 'none', width: 42, height: 42, borderRadius: 12, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div>
      <div style={{ fontWeight: 700, fontSize: 15.5, color: '#0A2A36', marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 14.5, color: '#5C7681', lineHeight: 1.5 }}>{desc}</div>
    </div>
  </div>
)

export default function SponsorsSection() {
  const { t } = useLang()

  const benefits = [
    {
      iconBg: '#E6F1F4',
      icon: <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#11607A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>,
      title: t.spB1t, desc: t.spB1d,
    },
    {
      iconBg: '#FDE9E0',
      icon: <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#FF6A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" /></svg>,
      title: t.spB2t, desc: t.spB2d,
    },
    {
      iconBg: '#FBF0D8',
      icon: <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#E0A12A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M9 13.5 8 22l4-2 4 2-1-8.5" /></svg>,
      title: t.spB3t, desc: t.spB3d,
    },
    {
      iconBg: '#E6F7EF',
      icon: <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#1FB877" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11 21 3l-8 18-2.5-7.5L3 11Z" /></svg>,
      title: t.spB4t, desc: t.spB4d,
    },
    {
      iconBg: '#E6F1F4',
      icon: <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#11607A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><rect x="7" y="11" width="3" height="6" /><rect x="13" y="7" width="3" height="10" /></svg>,
      title: t.spB5t, desc: t.spB5d,
    },
  ]

  return (
    <section id="sponsors" style={{ scrollMarginTop: 72, padding: '96px 24px', background: '#F8FAFB' }}>
      <div style={{ width: '100%', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 50px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#11607A', marginBottom: 16 }}>{t.spEyebrow}</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.1rem)', lineHeight: 1.08, letterSpacing: '-1px', color: '#0A2A36', margin: '0 0 18px' }}>{t.spH2}</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#45626C', margin: 0 }}>{t.spSub}</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '44px 56px', alignItems: 'flex-start' }}>
          {/* Left: body + benefits + logo grid */}
          <div style={{ flex: '1 1 420px', minWidth: 300 }}>
            <p style={{ fontSize: 16.5, lineHeight: 1.7, color: '#45626C', margin: '0 0 28px' }}>
              {t.spBodyA}<strong style={{ color: '#0A2A36' }}>{t.spBodyStrong}</strong>{t.spBodyB}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
              {benefits.map(({ iconBg, icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: 15, alignItems: 'flex-start' }}>
                  <div style={{ flex: 'none', width: 42, height: 42, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15.5, color: '#0A2A36', marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 14.5, color: '#5C7681', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8A9BA2', marginBottom: 16 }}>{t.spComing}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(135px,1fr))', gap: 12 }}>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} style={{ height: 78, background: '#fff', border: '1.5px dashed rgba(10,42,54,.14)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 12, color: '#A4B2B8', fontWeight: 600 }}>{t.spLogo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div style={{ flex: '1 1 380px', minWidth: 300, background: '#fff', border: '1px solid rgba(10,42,54,.08)', borderRadius: 26, padding: '36px 34px', boxShadow: '0 24px 56px rgba(10,42,54,.10)' }}>
            <SponsorForm />
          </div>
        </div>
      </div>
    </section>
  )
}
