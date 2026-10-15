'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLang } from '@/components/LangContext'
import { ALTA_TEXT } from '@/lib/altaI18n'
import { longDate, type Tier } from '@/lib/alta'

interface SessionInfo {
  ok: boolean
  plan?: Tier | null
  firstChargeAt?: number | null
  email?: string | null
}

/**
 * Vuelta de Stripe. La cuenta la crea el webhook del CRM en segundos: aquí solo se
 * confirma lo que ha pasado y se dice qué hacer ahora (descargar la app y entrar con
 * el mismo correo). Si Stripe aún no ha cerrado la sesión, se reintenta un poco.
 */
export default function AltaDone() {
  const { lang, t: tHome } = useLang()
  const t = ALTA_TEXT[lang]
  const params = useSearchParams()
  const id = params.get('session_id') ?? ''
  const [info, setInfo] = useState<SessionInfo | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    let tries = 0
    const load = () => {
      fetch(`/api/alta/session?session_id=${encodeURIComponent(id)}`)
        .then((r) => r.json())
        .then((s: SessionInfo) => {
          if (cancelled) return
          if (s.ok) {
            setInfo(s)
            try {
              window.gtag?.('event', 'alta_done', { plan: s.plan })
            } catch {}
          } else if (++tries < 5) setTimeout(load, 1500)
          else setFailed(true)
        })
        .catch(() => !cancelled && setFailed(true))
    }
    if (id) load()
    else setFailed(true)
    return () => {
      cancelled = true
    }
  }, [id])

  const planName = { bronze: tHome.spPlanBronzeName, silver: tHome.spPlanSilverName, gold: tHome.spPlanGoldName }
  const panelUrl = process.env.NEXT_PUBLIC_SPONSOR_PANEL_URL
  const card: React.CSSProperties = {
    maxWidth: 620, margin: '24px auto 0', background: '#fff', border: '1px solid rgba(10,42,54,.08)',
    borderRadius: 24, boxShadow: '0 24px 56px rgba(10,42,54,.08)', padding: 'clamp(24px,5vw,40px)', textAlign: 'center',
  }

  if (failed) {
    return (
      <div style={card}>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#45626C', margin: 0 }}>{t.okFail}</p>
      </div>
    )
  }
  if (!info) {
    return (
      <div style={card}>
        <span className="animate-spin2" style={{ width: 26, height: 26, border: '3px solid rgba(17,96,122,.2)', borderTopColor: '#11607A', borderRadius: '50%', display: 'inline-block' }} />
        <p style={{ fontSize: 15, color: '#5C7681', margin: '12px 0 0' }}>{t.okWait}</p>
      </div>
    )
  }

  return (
    <div style={card}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E6F7EF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1FB877" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21.8 7 10 18.8 4.2 13" />
        </svg>
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#1B8A5A', marginBottom: 10 }}>
        {t.okEyebrow}{info.plan ? ` · ${planName[info.plan]}` : ''}
      </div>
      <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', lineHeight: 1.1, color: '#0A2A36', margin: '0 0 12px' }}>{t.okTitle}</h1>
      {info.firstChargeAt && <p style={{ fontSize: 16, lineHeight: 1.6, color: '#45626C', margin: '0 0 6px' }}>{t.okNoCharge(longDate(info.firstChargeAt, lang))}</p>}
      {info.email && <p style={{ fontSize: 16, lineHeight: 1.6, color: '#45626C', margin: 0 }}>{t.okEmail(info.email)}</p>}

      <div style={{ textAlign: 'left', background: '#F8FAFB', border: '1px solid rgba(17,96,122,.12)', borderRadius: 18, padding: '18px 20px', margin: '24px 0' }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: '#0A2A36', marginBottom: 10 }}>{t.okStepsTitle}</div>
        <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8 }}>
          {t.okSteps.map((s) => <li key={s} style={{ fontSize: 14.5, lineHeight: 1.55, color: '#45626C' }}>{s}</li>)}
        </ol>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {/* /descargar manda a cada móvil a su tienda (y cuenta el clic como «alta»). */}
        <a href="/descargar?c=alta" style={{ flex: '1 1 200px', textDecoration: 'none', background: '#FF6A3D', color: '#fff', fontWeight: 800, fontSize: 15.5, padding: '15px 18px', borderRadius: 13, boxShadow: '0 10px 26px rgba(255,106,61,.32)' }}>
          {t.okApp}
        </a>
        {panelUrl && (
          <a href={panelUrl} style={{ flex: '1 1 200px', textDecoration: 'none', background: '#fff', color: '#0A2A36', fontWeight: 700, fontSize: 15, padding: '15px 18px', borderRadius: 13, border: '1.5px solid rgba(10,42,54,.14)' }}>
            {t.okPanel}
          </a>
        )}
      </div>
    </div>
  )
}
