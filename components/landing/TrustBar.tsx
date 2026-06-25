'use client'
import { useLang } from '@/components/LangContext'

export default function TrustBar() {
  const { t } = useLang()
  return (
    <div style={{ background: '#F1E8D8', borderTop: '1px solid rgba(10,42,54,.06)', borderBottom: '1px solid rgba(10,42,54,.06)' }}>
      <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto', padding: '18px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '14px 34px', textAlign: 'center' }}>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: '#34525C' }}>🏙️ {t.trust1}</span>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9B79A', display: 'inline-block' }} />
        <span style={{ fontSize: 14.5, fontWeight: 600, color: '#34525C' }}>✅ {t.trust2}</span>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9B79A', display: 'inline-block' }} />
        <span style={{ fontSize: 14.5, fontWeight: 600, color: '#34525C' }}>📅 {t.trust3}</span>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9B79A', display: 'inline-block' }} />
        <span style={{ fontSize: 14.5, fontWeight: 600, color: '#34525C' }}>🤝 {t.trust4}</span>
      </div>
    </div>
  )
}
