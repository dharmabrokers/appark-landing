'use client'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLang } from '@/components/LangContext'
import { ALTA_TEXT } from '@/lib/altaI18n'
import {
  CATEGORIES, CODE_STORAGE_KEY, CODE_TTL_MS, PLANS, TIERS, asTier, cleanCode, cleanRef, cleanToken,
  firstChargeAt, isFounder, longDate, type Category, type Tier,
} from '@/lib/alta'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const track = (event: string, params: Record<string, unknown> = {}) => {
  try {
    window.gtag?.('event', event, params)
  } catch {}
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 15px', border: '1.5px solid rgba(10,42,54,.14)', borderRadius: 12,
  fontSize: 16, fontFamily: "'Manrope',sans-serif", color: '#0A2A36', outline: 'none',
  background: '#FCFAF6', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 700, fontSize: 13.5, color: '#0A2A36', marginBottom: 6 }
const hintStyle: React.CSSProperties = { fontSize: 12.5, color: '#7C919A', marginTop: 5, lineHeight: 1.45 }
const card: React.CSSProperties = {
  background: '#fff', border: '1px solid rgba(10,42,54,.08)', borderRadius: 22,
  boxShadow: '0 24px 56px rgba(10,42,54,.08)', padding: 'clamp(20px,4vw,32px)',
}
const focus = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#11607A'
    e.target.style.boxShadow = '0 0 0 3px rgba(17,96,122,.10)'
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(10,42,54,.14)'
    e.target.style.boxShadow = ''
  },
}

interface Prefill {
  kind: 'lead' | 'sponsor'
  empresa?: string | null
  tipo?: string | null
  telefono?: string | null
  contact_person?: string | null
  email?: string | null
  address?: string | null
  tax_id?: string | null
  plan?: string | null
  referral_code?: string | null
  trial_ends_at?: string | null
}

type Step = 1 | 2 | 3
type Field = 'empresa' | 'contact' | 'tel' | 'email' | 'cif' | 'dir' | 'tipo'

export default function AltaFlow() {
  const { lang, t: tHome } = useLang()
  const t = ALTA_TEXT[lang]
  const params = useSearchParams()

  const token = cleanToken(params.get('t'))
  const [code, setCode] = useState<string | null>(null)
  const [plan, setPlan] = useState<Tier>(asTier(params.get('plan')) ?? 'silver')
  const [step, setStep] = useState<Step>(asTier(params.get('plan')) ? 2 : 1)

  const [empresa, setEmpresa] = useState('')
  const [contact, setContact] = useState('')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [cif, setCif] = useState('')
  const [dir, setDir] = useState('')
  const [tipo, setTipo] = useState<Category | ''>('')
  const [ref, setRef] = useState(cleanRef(params.get('ref')) ?? '')
  const [accept, setAccept] = useState(false)
  const [prefilled, setPrefilled] = useState(false)
  const [existingTrialEnd, setExistingTrialEnd] = useState<string | null>(null)

  const [errors, setErrors] = useState<Partial<Record<Field | 'accept', string>>>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  // El comercial del enlace: de la URL, o el que se recordó hace menos de 30 días.
  useEffect(() => {
    const fromUrl = cleanCode(params.get('c'))
    let c = fromUrl
    try {
      if (fromUrl) {
        localStorage.setItem(CODE_STORAGE_KEY, JSON.stringify({ c: fromUrl, at: Date.now() }))
      } else {
        const saved = JSON.parse(localStorage.getItem(CODE_STORAGE_KEY) || 'null') as { c?: string; at?: number } | null
        if (saved?.c && saved.at && Date.now() - saved.at < CODE_TTL_MS) c = cleanCode(saved.c)
      }
    } catch {}
    setCode(c)
    // Un clic por visita, para el embudo del comercial.
    if (fromUrl || token) {
      try {
        if (!sessionStorage.getItem('appark_alta_click')) {
          sessionStorage.setItem('appark_alta_click', '1')
          fetch('/api/alta/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: fromUrl, token }), keepalive: true }).catch(() => {})
        }
      } catch {}
    }
    track('alta_view', { has_code: !!c, has_token: !!token })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Con token, la página sale rellena con lo que ya sabe la ficha.
  useEffect(() => {
    if (!token) return
    fetch(`/api/alta/prefill?t=${token}`)
      .then((r) => r.json())
      .then((p: Prefill | null) => {
        if (!p) return
        setEmpresa(p.empresa ?? '')
        setContact(p.contact_person ?? '')
        setTel(p.telefono ?? '')
        setEmail(p.email ?? '')
        setCif(p.tax_id ?? '')
        setDir(p.address ?? '')
        if (p.tipo && (CATEGORIES as readonly string[]).includes(p.tipo)) setTipo(p.tipo as Category)
        if (p.referral_code) setRef(p.referral_code)
        if (!params.get('plan') && asTier(p.plan)) setPlan(asTier(p.plan) as Tier)
        if (p.trial_ends_at) setExistingTrialEnd(p.trial_ends_at)
        setPrefilled(true)
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const founder = isFounder()
  const charge = useMemo(() => firstChargeAt(Date.now(), existingTrialEnd), [existingTrialEnd])
  const fee = founder ? PLANS[plan].founder : PLANS[plan].standard
  const planName = { bronze: tHome.spPlanBronzeName, silver: tHome.spPlanSilverName, gold: tHome.spPlanGoldName }
  const feats = { bronze: tHome.spPlanFeatBronze, silver: tHome.spPlanFeatSilver, gold: tHome.spPlanFeatGold }

  const go = (s: Step) => {
    setStep(s)
    setFormError('')
    track('alta_step', { step: s, plan })
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {}
  }

  function validateBusiness(): boolean {
    const e: Partial<Record<Field, string>> = {}
    if (empresa.trim().length < 2) e.empresa = t.errEmpresa
    if (contact.trim().length < 2) e.contact = t.errContact
    if (tel.replace(/\D/g, '').length < 9) e.tel = t.errTel
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = t.errEmail
    if (cif.trim().length < 8) e.cif = t.errCif
    if (dir.trim().length < 5) e.dir = t.errDir
    if (!tipo) e.tipo = t.errTipo
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit() {
    if (!validateBusiness()) {
      go(2)
      return
    }
    if (!accept) {
      setErrors({ accept: t.errAccept })
      return
    }
    setLoading(true)
    setFormError('')
    track('alta_checkout', { plan })
    try {
      let recaptchaToken = ''
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      if (siteKey && typeof window !== 'undefined' && window.grecaptcha) {
        recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'alta' }).catch(() => '')
      }
      const res = await fetch('/api/alta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan, empresa: empresa.trim(), contactPerson: contact.trim(), telefono: tel.trim(), email: email.trim(),
          cif: cif.trim(), direccion: dir.trim(), tipo, referralCode: cleanRef(ref) ?? undefined,
          token: token ?? undefined, code: code ?? undefined, accept: true, language: lang, recaptchaToken,
          utm: {
            source: params.get('utm_source') ?? params.get('src') ?? undefined,
            medium: params.get('utm_medium') ?? undefined,
            campaign: params.get('utm_campaign') ?? undefined,
          },
        }),
      })
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
      if (res.ok && json.url) {
        window.location.href = json.url
        return
      }
      setFormError(json.error === 'already' ? t.errAlready : t.errServer)
    } catch {
      setFormError(t.errServer)
    }
    setLoading(false)
  }

  const field = (id: Field, label: string, input: React.ReactNode, hint?: string) => (
    <div>
      <label htmlFor={`alta-${id}`} style={labelStyle}>
        {label} <span style={{ color: '#FF6A3D' }}>*</span>
      </label>
      {input}
      {errors[id] ? <div role="alert" style={{ ...hintStyle, color: '#C23B1C', fontWeight: 700 }}>{errors[id]}</div> : hint && <div style={hintStyle}>{hint}</div>}
    </div>
  )
  const clear = (f: Field) => errors[f] && setErrors((e) => ({ ...e, [f]: undefined }))

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      {/* Cabecera */}
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '8px auto 26px' }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#FF6A3D', marginBottom: 12 }}>{t.eyebrow}</div>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(1.9rem,4.5vw,2.8rem)', lineHeight: 1.08, letterSpacing: '-1px', color: '#0A2A36', margin: '0 0 14px' }}>{t.title}</h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.6, color: '#45626C', margin: '0 0 16px' }}>{t.sub}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {[t.pillToday, t.pillCancel, ...(founder ? [t.pillFounder] : [])].map((p, i) => (
            <span key={p} style={{ fontSize: 13, fontWeight: 800, padding: '7px 13px', borderRadius: 999, background: i === 0 ? '#E6F7EF' : '#fff', color: i === 0 ? '#1B8A5A' : '#11607A', border: `1px solid ${i === 0 ? '#BFEAD6' : 'rgba(17,96,122,.18)'}` }}>
              {i === 0 ? '✓ ' : ''}{p}
            </span>
          ))}
        </div>
      </div>

      {/* Pasos */}
      <ol aria-label="Pasos" style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', gap: 8, padding: 0, margin: '0 auto 22px', maxWidth: 520 }}>
        {[t.step1, t.step2, t.step3].map((label, i) => {
          const n = (i + 1) as Step
          const active = step === n
          const done = step > n
          return (
            <li key={label} style={{ flex: 1 }}>
              <button
                type="button"
                onClick={() => (n < step ? go(n) : undefined)}
                disabled={n >= step}
                aria-current={active ? 'step' : undefined}
                style={{ width: '100%', background: 'none', border: 'none', padding: 0, cursor: n < step ? 'pointer' : 'default', textAlign: 'center' }}
              >
                <div style={{ height: 5, borderRadius: 99, background: active || done ? '#FF6A3D' : 'rgba(10,42,54,.10)', marginBottom: 7 }} />
                <span style={{ fontSize: 12.5, fontWeight: 800, color: active ? '#0A2A36' : done ? '#45626C' : '#A4B2B8' }}>{n}. {label}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start', justifyContent: 'center' }}>
        <div style={{ flex: '1 1 520px', maxWidth: 640, minWidth: 0 }}>
          {/* 1. Paquete */}
          {step === 1 && (
            <div style={{ display: 'grid', gap: 14 }}>
              {TIERS.map((k) => {
                const p = PLANS[k]
                const on = plan === k
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setPlan(k)}
                    aria-pressed={on}
                    style={{ ...card, padding: 20, textAlign: 'left', cursor: 'pointer', border: on ? '2px solid #FF6A3D' : '1px solid rgba(10,42,54,.08)', boxShadow: on ? '0 20px 44px rgba(255,106,61,.14)' : card.boxShadow, position: 'relative' }}
                  >
                    {k === 'silver' && (
                      <span style={{ position: 'absolute', top: -11, right: 18, background: '#FF6A3D', color: '#fff', fontSize: 11.5, fontWeight: 800, padding: '4px 11px', borderRadius: 999 }}>{t.recommended}</span>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 21, color: '#0A2A36' }}>{planName[k]}</span>
                      <span>
                        <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 26, color: '#0A2A36' }}>{founder ? p.founder : p.standard} €</span>
                        <span style={{ fontSize: 13, color: '#5C7681', fontWeight: 600 }}> {t.perMonth}</span>
                      </span>
                    </div>
                    {founder && (
                      <div style={{ fontSize: 12.5, color: '#7C919A', fontWeight: 600, marginTop: 2 }}>
                        <span style={{ textDecoration: 'line-through' }}>{p.standard} €</span> · {t.founderFor12}, {t.thenStandard(p.standard)}
                      </div>
                    )}
                    <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'grid', gap: 5 }}>
                      {feats[k].map((f) => (
                        <li key={f} style={{ fontSize: 13.5, color: '#45626C', display: 'flex', gap: 8 }}>
                          <span style={{ color: '#1B8A5A', fontWeight: 800 }}>✓</span>{f}
                        </li>
                      ))}
                      <li style={{ fontSize: 13.5, color: '#45626C', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#1B8A5A', fontWeight: 800 }}>✓</span>
                        {p.redemptionsWeek === 0 ? t.limitsNone : `${p.redemptionsWeek} ${t.limitsRedemptions} · ${p.maxPrizePoints} ${t.limitsPoints}`}
                      </li>
                    </ul>
                    <div style={{ marginTop: 14, fontSize: 14, fontWeight: 800, color: on ? '#FF6A3D' : '#11607A' }}>{on ? `● ${t.chosen}` : `○ ${t.choose}`}</div>
                  </button>
                )
              })}
              <PrimaryButton onClick={() => go(2)}>{t.next}</PrimaryButton>
            </div>
          )}

          {/* 2. Tu negocio */}
          {step === 2 && (
            <div style={card}>
              <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22, color: '#0A2A36', margin: '0 0 6px' }}>{t.bizTitle}</h2>
              {prefilled && <p style={{ fontSize: 13.5, color: '#1B8A5A', fontWeight: 700, margin: '0 0 14px' }}>✓ {t.prefilled}</p>}
              <div style={{ display: 'grid', gap: 15, marginTop: 14 }}>
                {field('empresa', t.lEmpresa, <input id="alta-empresa" value={empresa} autoComplete="organization" placeholder={t.phEmpresa} maxLength={150} onChange={(e) => { setEmpresa(e.target.value); clear('empresa') }} style={inputStyle} {...focus} />)}
                {field('contact', t.lContact, <input id="alta-contact" value={contact} autoComplete="name" placeholder={t.phContact} maxLength={120} onChange={(e) => { setContact(e.target.value); clear('contact') }} style={inputStyle} {...focus} />)}
                {field('tel', t.lTel, <input id="alta-tel" type="tel" inputMode="tel" value={tel} autoComplete="tel" placeholder="600 000 000" maxLength={40} onChange={(e) => { setTel(e.target.value); clear('tel') }} style={inputStyle} {...focus} />, t.hTel)}
                {field('email', t.lEmail, <input id="alta-email" type="email" inputMode="email" value={email} autoComplete="email" placeholder="hola@tunegocio.es" maxLength={200} onChange={(e) => { setEmail(e.target.value); clear('email') }} style={inputStyle} {...focus} />, t.hEmail)}
                {field('cif', t.lCif, <input id="alta-cif" value={cif} placeholder="B12345678" maxLength={20} onChange={(e) => { setCif(e.target.value.toUpperCase()); clear('cif') }} style={inputStyle} {...focus} />, t.hCif)}
                {field('dir', t.lDir, <input id="alta-dir" value={dir} autoComplete="street-address" placeholder={t.phDir} maxLength={200} onChange={(e) => { setDir(e.target.value); clear('dir') }} style={inputStyle} {...focus} />)}
                {field('tipo', t.lTipo, (
                  <select id="alta-tipo" value={tipo} onChange={(e) => { setTipo(e.target.value as Category); clear('tipo') }} style={inputStyle} {...focus}>
                    <option value="">{t.tipoSelect}</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{t.categories[c]}</option>)}
                  </select>
                ))}
                <div>
                  <label htmlFor="alta-ref" style={labelStyle}>{t.lRef}</label>
                  <input id="alta-ref" value={ref} placeholder="APKXXXXXX" maxLength={12} autoComplete="off" onChange={(e) => setRef(e.target.value.toUpperCase().replace(/\s+/g, ''))} style={inputStyle} {...focus} />
                  <div style={hintStyle}>{t.hRef}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                <SecondaryButton onClick={() => go(1)}>{t.back}</SecondaryButton>
                <PrimaryButton onClick={() => validateBusiness() && go(3)}>{t.next}</PrimaryButton>
              </div>
            </div>
          )}

          {/* 3. Confirmar */}
          {step === 3 && (
            <div style={card}>
              <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22, color: '#0A2A36', margin: '0 0 16px' }}>{t.summaryTitle}</h2>
              <dl style={{ display: 'grid', gap: 12, margin: 0 }}>
                <Row label={t.sumPlan} value={`${planName[plan]} · ${empresa.trim()}`} />
                <Row label={t.sumToday} value="0 €" strong />
                <Row label={t.sumFirst(longDate(charge.at, lang))} value={t.sumFee(fee, founder ? PLANS[plan].standard : null)} />
              </dl>
              <p style={{ fontSize: 13.5, color: '#1B8A5A', fontWeight: 700, background: '#E6F7EF', border: '1px solid #BFEAD6', borderRadius: 12, padding: '11px 13px', margin: '16px 0' }}>✓ {t.sumCancel}</p>

              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14.5, color: '#0A2A36', fontWeight: 600, cursor: 'pointer' }}>
                <input type="checkbox" checked={accept} onChange={(e) => { setAccept(e.target.checked); setErrors((x) => ({ ...x, accept: undefined })) }} style={{ width: 20, height: 20, marginTop: 1, flex: 'none', accentColor: '#FF6A3D' }} />
                <span>
                  {t.accept[0]}
                  <a href="/legal/patrocinio" target="_blank" rel="noopener" style={{ color: '#11607A', fontWeight: 800 }}>{t.accept[1]}</a>
                  {t.accept[2]}
                </span>
              </label>
              {errors.accept && <div role="alert" style={{ ...hintStyle, color: '#C23B1C', fontWeight: 700 }}>{errors.accept}</div>}

              {formError && (
                <div role="alert" style={{ background: '#FDEAE6', border: '1px solid #F8C7BC', borderRadius: 10, padding: '11px 14px', fontSize: 13.5, color: '#C23B1C', fontWeight: 600, marginTop: 16 }}>{formError}</div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <SecondaryButton onClick={() => go(2)} disabled={loading}>{t.back}</SecondaryButton>
                <PrimaryButton onClick={submit} disabled={loading}>
                  {loading && <span className="animate-spin2" style={{ width: 17, height: 17, border: '2.5px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />}
                  {loading ? t.ctaLoading : t.cta}
                </PrimaryButton>
              </div>
              <p style={{ fontSize: 12.5, color: '#7C919A', textAlign: 'center', margin: '12px 0 0' }}>🔒 {t.secure}</p>
            </div>
          )}
        </div>

        {/* Dudas */}
        <aside style={{ flex: '1 1 300px', maxWidth: 400, minWidth: 0 }}>
          <div style={{ ...card, boxShadow: '0 12px 30px rgba(10,42,54,.05)' }}>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 18, color: '#0A2A36', margin: '0 0 12px' }}>{t.faqTitle}</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {t.faq.map(([q, a]) => (
                <details key={q} style={{ borderTop: '1px solid rgba(10,42,54,.07)', paddingTop: 10 }}>
                  <summary style={{ fontWeight: 800, fontSize: 14.5, color: '#0A2A36', cursor: 'pointer' }}>{q}</summary>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: '#5C7681', margin: '8px 0 0' }}>{a}</p>
                </details>
              ))}
            </div>
            <a href="/#sponsor-form" style={{ display: 'inline-block', marginTop: 16, fontSize: 14, fontWeight: 800, color: '#11607A' }}>{t.helpCall} →</a>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', borderBottom: '1px solid rgba(10,42,54,.06)', paddingBottom: 10 }}>
      <dt style={{ fontSize: 14, color: '#5C7681', fontWeight: 700 }}>{label}</dt>
      <dd style={{ margin: 0, fontSize: strong ? 20 : 14.5, fontWeight: 800, color: strong ? '#1B8A5A' : '#0A2A36', textAlign: 'right' }}>{value}</dd>
    </div>
  )
}

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#FF6A3D', color: '#fff', fontWeight: 800, fontSize: 16, fontFamily: "'Manrope',sans-serif", padding: '16px 18px', borderRadius: 13, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', boxShadow: '0 10px 26px rgba(255,106,61,.32)', opacity: disabled ? 0.75 : 1 }}
    >
      {children}
    </button>
  )
}

function SecondaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ flex: 'none', background: '#fff', color: '#0A2A36', fontWeight: 700, fontSize: 15, padding: '16px 18px', borderRadius: 13, border: '1.5px solid rgba(10,42,54,.14)', cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {children}
    </button>
  )
}
