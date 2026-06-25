'use client'
import { useState } from 'react'
import { useLang } from '@/components/LangContext'

const SpinnerIcon = () => (
  <span className="animate-spin2" style={{ width: 17, height: 17, border: '2.5px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
)

const CheckSuccessIcon = () => (
  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E6F7EF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1FB877" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.8 7 10 18.8 4.2 13" />
    </svg>
  </div>
)

type Status = 'idle' | 'loading' | 'success' | 'error'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 15px', border: '1.5px solid rgba(10,42,54,.14)', borderRadius: 12,
  fontSize: 15, fontFamily: "'Manrope',sans-serif", color: '#0A2A36', outline: 'none',
  background: '#FCFAF6', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 700, fontSize: 13.5, color: '#0A2A36', marginBottom: 6,
}

export default function SponsorForm() {
  const { t } = useLang()
  const [empresa, setEmpresa] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [tipo, setTipo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const tipoOptions = [t.spTipo1, t.spTipo2, t.spTipo3, t.spTipo4, t.spTipo5, t.spTipo6, t.spTipo7]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!empresa.trim()) { setStatus('error'); setError(t.spErrEmpresa); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('error'); setError(t.spErrEmail); return }
    if (!tipo) { setStatus('error'); setError(t.spErrTipo); return }

    setStatus('loading'); setError('')

    try {
      let recaptchaToken = ''
      if (typeof window !== 'undefined' && window.grecaptcha && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        recaptchaToken = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'sponsor_contact' })
      }

      const res = await fetch('/api/sponsor-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empresa, email, telefono, tipoNegocio: tipo, mensaje, recaptchaToken }),
      })

      if (!res.ok) throw new Error('Server error')
      setStatus('success')
    } catch {
      setStatus('error')
      setError(`${t.spErrEmail} Escríbenos a hola@appark.es`)
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '30px 6px' }}>
        <CheckSuccessIcon />
        <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 23, color: '#0A2A36', margin: '0 0 10px' }}>{t.spSuccessTitle}</h3>
        <p style={{ fontSize: 15.5, color: '#5C7681', lineHeight: 1.6, margin: 0 }}>{t.spSuccessBody}</p>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 24, color: '#0A2A36', margin: '0 0 6px' }}>{t.spFormTitle}</h3>
      <p style={{ fontSize: 14.5, color: '#5C7681', margin: '0 0 24px', lineHeight: 1.5 }}>{t.spFormSub}</p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div>
            <label htmlFor="sp-empresa" style={labelStyle}>{t.spLabelEmpresa} <span style={{ color: '#FF6A3D' }}>*</span></label>
            <input id="sp-empresa" type="text" value={empresa} onChange={e => { setEmpresa(e.target.value); if (status === 'error') setStatus('idle') }}
              placeholder={t.spPhEmpresa} style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#11607A'; e.target.style.boxShadow = '0 0 0 3px rgba(17,96,122,.10)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(10,42,54,.14)'; e.target.style.boxShadow = '' }} />
          </div>
          <div>
            <label htmlFor="sp-email" style={labelStyle}>{t.spLabelEmail} <span style={{ color: '#FF6A3D' }}>*</span></label>
            <input id="sp-email" type="email" value={email} onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
              placeholder="hola@tunegocio.es" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#11607A'; e.target.style.boxShadow = '0 0 0 3px rgba(17,96,122,.10)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(10,42,54,.14)'; e.target.style.boxShadow = '' }} />
          </div>
          <div>
            <label htmlFor="sp-tel" style={labelStyle}>{t.spLabelTel}</label>
            <input id="sp-tel" type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
              placeholder="600 000 000" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#11607A'; e.target.style.boxShadow = '0 0 0 3px rgba(17,96,122,.10)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(10,42,54,.14)'; e.target.style.boxShadow = '' }} />
          </div>
          <div>
            <label htmlFor="sp-tipo" style={labelStyle}>{t.spLabelTipo} <span style={{ color: '#FF6A3D' }}>*</span></label>
            <select id="sp-tipo" value={tipo} onChange={e => { setTipo(e.target.value); if (status === 'error') setStatus('idle') }}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#11607A'; e.target.style.boxShadow = '0 0 0 3px rgba(17,96,122,.10)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(10,42,54,.14)'; e.target.style.boxShadow = '' }}>
              <option value="">{t.spTipoSelect}</option>
              {tipoOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sp-msg" style={labelStyle}>{t.spLabelMsg}</label>
            <textarea id="sp-msg" value={mensaje} onChange={e => setMensaje(e.target.value.slice(0, 500))}
              maxLength={500} rows={3} placeholder={t.spPhMsg}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => { e.target.style.borderColor = '#11607A'; e.target.style.boxShadow = '0 0 0 3px rgba(17,96,122,.10)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(10,42,54,.14)'; e.target.style.boxShadow = '' }} />
            <div style={{ textAlign: 'right', fontSize: 12, color: '#A4B2B8', marginTop: 4 }}>{mensaje.length}/500</div>
          </div>

          {status === 'error' && (
            <div style={{ background: '#FDEAE6', border: '1px solid #F8C7BC', borderRadius: 10, padding: '11px 14px', fontSize: 13.5, color: '#C23B1C', fontWeight: 600 }}>{error}</div>
          )}

          <button type="submit" disabled={status === 'loading'}
            style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#FF6A3D', color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: "'Manrope',sans-serif", padding: 16, borderRadius: 13, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', boxShadow: '0 10px 26px rgba(255,106,61,.32)', opacity: status === 'loading' ? 0.75 : 1 }}>
            {status === 'loading' && <SpinnerIcon />}
            {status === 'loading' ? t.spSending : t.spBtn}
          </button>

          <p style={{ fontSize: 12.5, color: '#8A9BA2', textAlign: 'center', margin: '2px 0 0' }}>{t.spFormNote}</p>
        </div>
      </form>
    </div>
  )
}
