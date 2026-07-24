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

const CoinIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#11607A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4" />
  </svg>
)
const GiftIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF6A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" />
  </svg>
)
const TagIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#11607A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.6 12.6 12 21.2 2.8 12 2 3l9 .8 8.6 8.8Z" /><circle cx="7.5" cy="7.5" r="1.5" />
  </svg>
)
const FootstepsIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#FF6A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
)
const ScaleIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#1FB877" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M5 7l-3 7a3.5 3.5 0 0 0 7 0l-3-7ZM19 7l-3 7a3.5 3.5 0 0 0 7 0l-3-7Z" /><path d="M5 7h14M9 21h6" />
  </svg>
)
const MapPinSmallIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#11607A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
)
const GiftSmallIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" />
  </svg>
)
const DoorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1FB877" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17" /><path d="M3 21h18" /><circle cx="12.5" cy="12" r="1" fill="#1FB877" />
  </svg>
)

interface Plan {
  key: 'bronze' | 'silver' | 'gold'
  name: string
  standardFee: number
  founderFee: number
  reward: number
  recommended: boolean
}

function PlanCard({ plan, t }: { plan: Plan; t: ReturnType<typeof useLang>['t'] }) {
  const recommended = plan.recommended
  return (
    <div style={{
      position: 'relative',
      background: '#fff',
      borderRadius: 24,
      padding: '32px 28px',
      border: recommended ? '2px solid #FF6A3D' : '1px solid rgba(10,42,54,.08)',
      boxShadow: recommended ? '0 24px 56px rgba(255,106,61,.16)' : '0 12px 30px rgba(10,42,54,.05)',
      transform: recommended ? 'translateY(-6px)' : 'none',
    }}>
      {recommended && (
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#FF6A3D', color: '#fff', fontSize: 12.5, fontWeight: 800, letterSpacing: '.5px', padding: '6px 16px', borderRadius: 999, boxShadow: '0 8px 18px rgba(255,106,61,.35)', whiteSpace: 'nowrap' }}>
          {t.spPlanRecommended}
        </div>
      )}
      <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22, color: '#0A2A36', marginBottom: 18, textAlign: 'center' }}>{plan.name}</div>

      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 15, color: '#A4B2B8', textDecoration: 'line-through', fontWeight: 600 }}>€{plan.standardFee}</span>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 42, color: '#0A2A36' }}>€{plan.founderFee}</span>
      </div>
      <div style={{ textAlign: 'center', fontSize: 13.5, color: '#5C7681', fontWeight: 600, marginBottom: 18 }}>{t.spPlanCashLabel}</div>

      <div style={{ background: '#E6F7EF', border: '1px solid #BFEAD6', borderRadius: 14, padding: '14px 16px', textAlign: 'center', marginBottom: 22 }}>
        <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 20, color: '#1B8A5A' }}>+ €{plan.reward}</span>
        <div style={{ fontSize: 12.5, color: '#3E7A5D', fontWeight: 600, marginTop: 2 }}>{t.spPlanRewardLabel}</div>
      </div>

      <a href="#sponsor-form"
        style={{ display: 'block', textAlign: 'center', textDecoration: 'none', width: '100%', background: recommended ? '#FF6A3D' : '#fff', color: recommended ? '#fff' : '#0A2A36', fontWeight: 700, fontSize: 15, padding: '14px', borderRadius: 13, border: recommended ? 'none' : '1.5px solid rgba(10,42,54,.14)', boxShadow: recommended ? '0 10px 26px rgba(255,106,61,.32)' : 'none' }}>
        {t.spPlanCta}
      </a>
    </div>
  )
}

export default function SponsorsSection() {
  const { t } = useLang()

  const plans: Plan[] = [
    { key: 'bronze', name: t.spPlanBronzeName, standardFee: 99, founderFee: 69, reward: 50, recommended: false },
    { key: 'silver', name: t.spPlanSilverName, standardFee: 199, founderFee: 139, reward: 100, recommended: true },
    { key: 'gold', name: t.spPlanGoldName, standardFee: 399, founderFee: 279, reward: 150, recommended: false },
  ]

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

        {/* ===== FREE FIRST MONTH BANNER — the zero-friction hook ===== */}
        <div style={{
          background: 'linear-gradient(135deg,#E9FBF2,#F1FBF6)',
          border: '1.5px solid rgba(31,184,119,.35)',
          borderRadius: 24,
          padding: 'clamp(26px,4vw,38px)',
          marginBottom: 32,
          boxShadow: '0 20px 50px rgba(31,184,119,.10)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ flex: '1 1 420px' }}>
            <span style={{ display: 'inline-block', background: '#1FB877', color: '#fff', fontSize: 12.5, fontWeight: 800, letterSpacing: '.5px', padding: '6px 14px', borderRadius: 999, marginBottom: 14, boxShadow: '0 8px 18px rgba(31,184,119,.3)' }}>
              {t.spFreeMonthBadge}
            </span>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(1.3rem,2.6vw,1.7rem)', lineHeight: 1.2, color: '#0A2A36', marginBottom: 10, maxWidth: 560 }}>
              {t.spFreeMonthTitle}
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#3E5B54', margin: '0 0 8px', maxWidth: 560 }}>{t.spFreeMonthDesc}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1B8A5A', margin: 0 }}>✓ {t.spFreeMonthNote}</p>
          </div>
          <a href="#sponsor-form" style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', background: '#1FB877', color: '#fff', fontWeight: 700, fontSize: 15, padding: '15px 26px', borderRadius: 14, boxShadow: '0 12px 28px rgba(31,184,119,.32)', whiteSpace: 'nowrap' }}>
            {t.spFreeMonthCta}
          </a>
        </div>

        {/* ===== MODEL EXPLAINER: fee + rewards ===== */}
        <div style={{ background: '#fff', border: '1px solid rgba(10,42,54,.08)', borderRadius: 28, padding: 'clamp(28px,4vw,48px)', marginBottom: 40, boxShadow: '0 20px 50px rgba(10,42,54,.06)' }}>
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 36px' }}>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#FF6A3D', marginBottom: 14 }}>{t.spModelEyebrow}</div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2.1rem)', lineHeight: 1.15, letterSpacing: '-.5px', color: '#0A2A36', margin: '0 0 14px' }}>{t.spModelH2}</h3>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: '#45626C', margin: 0 }}>{t.spModelSub}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginBottom: 36 }}>
            <div style={{ background: '#F8FAFB', border: '1px solid rgba(17,96,122,.14)', borderRadius: 20, padding: 26 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: '#E6F1F4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><CoinIcon /></div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 19, color: '#0A2A36', marginBottom: 8 }}>{t.spModelCashTitle}</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#5C7681', margin: 0 }}>{t.spModelCashDesc}</p>
            </div>
            <div style={{ background: '#FEF6F2', border: '1px solid rgba(255,106,61,.18)', borderRadius: 20, padding: 26 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: '#FDE9E0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><GiftIcon /></div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 19, color: '#0A2A36', marginBottom: 8 }}>{t.spModelRewardTitle}</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#5C7681', margin: 0 }}>{t.spModelRewardDesc}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
            <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
              <div style={{ flex: 'none', marginTop: 2 }}><TagIcon /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0A2A36', marginBottom: 3 }}>{t.spWhy1t}</div>
                <div style={{ fontSize: 13.5, color: '#5C7681', lineHeight: 1.55 }}>{t.spWhy1d}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
              <div style={{ flex: 'none', marginTop: 2 }}><FootstepsIcon /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0A2A36', marginBottom: 3 }}>{t.spWhy2t}</div>
                <div style={{ fontSize: 13.5, color: '#5C7681', lineHeight: 1.55 }}>{t.spWhy2d}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
              <div style={{ flex: 'none', marginTop: 2 }}><ScaleIcon /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0A2A36', marginBottom: 3 }}>{t.spWhy3t}</div>
                <div style={{ fontSize: 13.5, color: '#5C7681', lineHeight: 1.55 }}>{t.spWhy3d}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== FLOW: report -> redeem -> walk in ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 48, alignItems: 'stretch' }}>
          {[
            { icon: <MapPinSmallIcon />, bg: '#E6F1F4', title: t.spFlow1t, desc: t.spFlow1d },
            { icon: <GiftSmallIcon />, bg: '#FDE9E0', title: t.spFlow2t, desc: t.spFlow2d },
            { icon: <DoorIcon />, bg: '#E6F7EF', title: t.spFlow3t, desc: t.spFlow3d },
          ].map((step, i) => (
            <div key={step.title} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ background: '#fff', border: '1px solid rgba(10,42,54,.07)', borderRadius: 20, padding: '24px 22px', boxShadow: '0 12px 30px rgba(10,42,54,.05)', flex: 1 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{step.icon}</div>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17, color: '#0A2A36', marginBottom: 6 }}>{step.title}</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#5C7681', margin: 0 }}>{step.desc}</p>
              </div>
              {i < 2 && <span className="sp-flow-arrow" style={{ fontSize: 22, color: '#C9B79A', flex: 'none' }}>→</span>}
            </div>
          ))}
        </div>

        {/* ===== FOUNDER DISCOUNT BANNER ===== */}
        <div style={{ background: 'linear-gradient(135deg,#FFF4EE,#FEF6F2)', border: '1.5px solid rgba(255,106,61,.3)', borderRadius: 22, padding: '28px 30px', marginBottom: 36, display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 380px' }}>
            <span style={{ display: 'inline-block', background: '#FF6A3D', color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 999, marginBottom: 12 }}>🔥 {t.spFounderBadge}</span>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 20, color: '#0A2A36', marginBottom: 6 }}>{t.spFounderTitle}</div>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#5C7681', margin: '0 0 6px', maxWidth: 560 }}>{t.spFounderDesc}</p>
            <p style={{ fontSize: 12.5, color: '#8A9BA2', margin: 0 }}>{t.spFounderNote}</p>
          </div>
        </div>

        {/* ===== PRICING CARDS ===== */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 32px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#11607A', marginBottom: 14 }}>{t.spPlansEyebrow}</div>
          <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3.2vw,2.2rem)', lineHeight: 1.15, letterSpacing: '-.5px', color: '#0A2A36', margin: '0 0 14px' }}>{t.spPlansH2}</h3>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#45626C', margin: 0 }}>{t.spPlansSub}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 26, marginBottom: 56, alignItems: 'start' }}>
          {plans.map(plan => <PlanCard key={plan.key} plan={plan} t={t} />)}
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

            {/* Hidden until we have 3+ real sponsors - APP-73 */}
            {false && (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8A9BA2', marginBottom: 16 }}>{t.spComing}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(135px,1fr))', gap: 12 }}>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <div key={n} style={{ height: 78, background: '#fff', border: '1.5px dashed rgba(10,42,54,.14)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 12, color: '#A4B2B8', fontWeight: 600 }}>{t.spLogo}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: form */}
          <div id="sponsor-form" style={{ scrollMarginTop: 96, flex: '1 1 380px', minWidth: 300, background: '#fff', border: '1px solid rgba(10,42,54,.08)', borderRadius: 26, padding: '36px 34px', boxShadow: '0 24px 56px rgba(10,42,54,.10)' }}>
            <SponsorForm />
          </div>
        </div>
      </div>
    </section>
  )
}
