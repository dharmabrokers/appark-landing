'use client'
import { useLang } from '@/components/LangContext'

export default function ProblemSection() {
  const { t } = useLang()
  return (
    <section id="como-funciona" style={{ scrollMarginTop: 72, padding: '96px 24px', background: '#FBF6EE' }}>
      <div style={{ width: '100%', maxWidth: 1180, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '56px 64px', alignItems: 'center' }}>
        <div style={{ flex: '1 1 440px', minWidth: 300 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#FF6A3D', marginBottom: 16 }}>{t.probEyebrow}</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.1rem)', lineHeight: 1.08, letterSpacing: '-1px', color: '#0A2A36', margin: '0 0 16px' }}>{t.probH2}</h2>
          <p style={{ fontStyle: 'italic', fontSize: 18, color: '#11607A', fontWeight: 600, margin: '0 0 28px', lineHeight: 1.5 }}>{t.probQuote}</p>
          <p style={{ fontSize: 16.5, lineHeight: 1.7, color: '#45626C', margin: '0 0 16px' }}>{t.probP1}</p>
          <p style={{ fontSize: 16.5, lineHeight: 1.7, color: '#45626C', margin: '0 0 16px' }}>{t.probP2}</p>
          <p style={{ fontSize: 16.5, lineHeight: 1.7, color: '#45626C', margin: 0 }}>
            {t.probP3a}<strong style={{ color: '#0A2A36' }}>{t.probP3strong}</strong>{t.probP3b}
          </p>
        </div>

        <div style={{ flex: '1 1 300px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <StatCard big="0 €" bigColor="#FF6A3D" desc={t.stat1} />
          <StatCard big={t.stat2big} bigColor="#11607A" bigSize={30} desc={t.stat2} />
          <StatCard big="4" bigColor="#1FB877" desc={t.stat3} />
        </div>
      </div>
    </section>
  )
}

function StatCard({ big, bigColor, bigSize = 46, desc }: { big: string; bigColor: string; bigSize?: number; desc: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(10,42,54,.07)', borderRadius: 22, padding: '28px 30px', boxShadow: '0 14px 36px rgba(10,42,54,.06)', display: 'flex', alignItems: 'baseline', gap: 18 }}>
      <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: bigSize, color: bigColor, lineHeight: 1, whiteSpace: 'nowrap' }}>{big}</div>
      <div style={{ fontSize: 15.5, color: '#45626C', fontWeight: 500 }}>{desc}</div>
    </div>
  )
}
