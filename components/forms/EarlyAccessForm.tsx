'use client'
import { useState } from 'react'
import { useLang } from '@/components/LangContext'

type Status = 'idle' | 'loading' | 'success' | 'error'

const SpinnerIcon = () => (
  <span className="animate-spin2" style={{ width: 17, height: 17, border: '2.5px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
)

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '14px 15px', border: '1.5px solid rgba(10,42,54,.14)', borderRadius: 12,
  fontSize: 15, fontFamily: "'Manrope',sans-serif", color: '#0A2A36', outline: 'none',
  background: '#FCFAF6', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 700, fontSize: 13.5, color: '#0A2A36', marginBottom: 6,
}

export default function EarlyAccessForm() {
  const { t, lang } = useLang()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [accepts, setAccepts] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) { setStatus('error'); setError(t.eaErrName); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('error'); setError(t.eaErrEmail); return }
    if (!accepts) { setStatus('error'); setError(t.eaErrAccept); return }

    setStatus('loading'); setError('')

    try {
      let recaptchaToken = ''
      if (typeof window !== 'undefined' && window.grecaptcha && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        recaptchaToken = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'early_access' })
      }

      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, acceptsUpdates: accepts, language: lang, recaptchaToken }),
      })

      if (!res.ok) throw new Error('Server error')
      setStatus('success')
    } catch {
      setStatus('error')
      setError(`${t.eaErrEmail} Inténtalo de nuevo o escríbenos a hola@appark.es`)
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '24px 6px' }}>
        <div style={{ fontSize: 46, lineHeight: 1, marginBottom: 14 }}>🎉</div>
        <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 23, color: '#0A2A36', margin: '0 0 10px' }}>{t.eaSuccessTitle}</h3>
        <p style={{ fontSize: 15.5, color: '#5C7681', lineHeight: 1.6, margin: 0 }}>{t.eaSuccessBody}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <div>
          <label htmlFor="ea-nombre" style={labelStyle}>{t.eaLabelName} <span style={{ color: '#FF6A3D' }}>*</span></label>
          <input id="ea-nombre" type="text" value={nombre} onChange={e => { setNombre(e.target.value); if (status === 'error') setStatus('idle') }}
            placeholder={t.eaPhName} style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#11607A'; e.target.style.boxShadow = '0 0 0 3px rgba(17,96,122,.10)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(10,42,54,.14)'; e.target.style.boxShadow = '' }} />
        </div>
        <div>
          <label htmlFor="ea-email" style={labelStyle}>{t.eaLabelEmail} <span style={{ color: '#FF6A3D' }}>*</span></label>
          <input id="ea-email" type="email" value={email} onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
            placeholder="tu@email.com" style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#11607A'; e.target.style.boxShadow = '0 0 0 3px rgba(17,96,122,.10)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(10,42,54,.14)'; e.target.style.boxShadow = '' }} />
        </div>
        <label style={{ display: 'flex', gap: 11, alignItems: 'flex-start', cursor: 'pointer', padding: '2px 0' }}>
          <input type="checkbox" checked={accepts} onChange={e => { setAccepts(e.target.checked); if (status === 'error') setStatus('idle') }}
            style={{ width: 19, height: 19, margin: '1px 0 0', accentColor: '#FF6A3D', flex: 'none', cursor: 'pointer' }} />
          <span style={{ fontSize: 13, color: '#5C7681', lineHeight: 1.5 }}>{t.eaCheckbox}</span>
        </label>

        {status === 'error' && (
          <div style={{ background: '#FDEAE6', border: '1px solid #F8C7BC', borderRadius: 10, padding: '11px 14px', fontSize: 13.5, color: '#C23B1C', fontWeight: 600 }}>{error}</div>
        )}

        <button type="submit" disabled={status === 'loading'}
          style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#FF6A3D', color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: "'Manrope',sans-serif", padding: 16, borderRadius: 13, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', boxShadow: '0 10px 26px rgba(255,106,61,.34)', opacity: status === 'loading' ? 0.75 : 1 }}>
          {status === 'loading' && <SpinnerIcon />}
          {status === 'loading' ? t.eaSending : t.eaBtn}
        </button>

        <p style={{ fontSize: 12.5, color: '#8A9BA2', textAlign: 'center', margin: '2px 0 0' }}>{t.eaFormNote}</p>
      </div>
    </form>
  )
}
