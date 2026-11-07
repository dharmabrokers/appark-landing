'use client'
import { useState } from 'react'
import { NICHES, ZONES } from '@/lib/colabora'

/**
 * El formulario de appark.es/colabora. Lo guarda el CRM (ver lib/colabora.ts): al
 * enviarlo, la base filtra (comisión y fuera de Palma) y el bot le escribe por
 * WhatsApp, con la presentación y el enlace para reservar la llamada o con un
 * «ahora no encaja».
 */

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 15px', border: '1.5px solid rgba(10,42,54,.14)', borderRadius: 12,
  fontSize: 16, fontFamily: 'var(--font-body), sans-serif', color: '#0A2A36', outline: 'none',
  background: '#FCFAF6', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 700, fontSize: 13.5, color: '#0A2A36', marginBottom: 6 }
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, alignItems: 'end' }
const focus = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#11607A'
    e.target.style.boxShadow = '0 0 0 3px rgba(17,96,122,.10)'
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgba(10,42,54,.14)'
    e.target.style.boxShadow = 'none'
  },
}

function track(event: string) {
  try {
    window.gtag?.('event', event)
  } catch {}
}

export default function ColaboraForm() {
  const [f, setF] = useState({
    full_name: '', email: '', phone: '', zone: '', niche: '', hours_week: '', modality: '', occupation: '',
    accepts_commission: '', privacy: false, website: '',
  })
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setState('sending')
    let recaptchaToken = ''
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (siteKey && typeof window !== 'undefined' && window.grecaptcha) {
      recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'colabora' }).catch(() => '')
    }
    const res = await fetch('/api/colabora', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...f,
        hours_week: f.hours_week === '' ? null : Number(f.hours_week),
        modality: f.modality || null,
        accepts_commission: f.accepts_commission === '' ? undefined : f.accepts_commission === 'yes',
        recaptchaToken,
      }),
    }).catch(() => null)
    const body = res ? ((await res.json().catch(() => null)) as { ok?: boolean; mensaje?: string } | null) : null
    if (!res || !res.ok || !body?.ok) {
      setError(body?.mensaje ?? 'No se ha podido enviar. Inténtalo de nuevo o escríbenos a hola@appark.es.')
      setState('idle')
      return
    }
    track('colabora_enviado')
    setState('done')
  }

  if (state === 'done') {
    return (
      <div style={{ textAlign: 'center', padding: '26px 6px' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E6F7EF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1FB877" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21.8 7 10 18.8 4.2 13" />
          </svg>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 23, color: '#0A2A36', margin: '0 0 10px' }}>¡Recibido!</h3>
        <p style={{ fontSize: 15.5, color: '#45626C', lineHeight: 1.6, margin: 0 }}>
          En unos minutos te escribimos por WhatsApp desde el número de Appark con los siguientes pasos.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
      <div>
        <label htmlFor="c-name" style={labelStyle}>Nombre y apellidos</label>
        <input id="c-name" required value={f.full_name} onChange={set('full_name')} autoComplete="name" maxLength={120} style={inputStyle} {...focus} />
      </div>
      <div style={grid2}>
        <div>
          <label htmlFor="c-email" style={labelStyle}>Correo</label>
          <input id="c-email" required type="email" value={f.email} onChange={set('email')} autoComplete="email" maxLength={200} style={inputStyle} {...focus} />
        </div>
        <div>
          <label htmlFor="c-phone" style={labelStyle}>Móvil con WhatsApp</label>
          <input id="c-phone" required type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" maxLength={40} style={inputStyle} {...focus} />
        </div>
      </div>
      <div style={grid2}>
        <div>
          <label htmlFor="c-zone" style={labelStyle}>Por dónde te mueves</label>
          <select id="c-zone" required value={f.zone} onChange={set('zone')} style={inputStyle} {...focus}>
            <option value="">Elige…</option>
            {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="c-niche" style={labelStyle}>¿Algún sector en el que ya tengas contactos?</label>
          <select id="c-niche" required value={f.niche} onChange={set('niche')} style={inputStyle} {...focus}>
            <option value="">Elige…</option>
            {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div style={grid2}>
        <div>
          <label htmlFor="c-hours" style={labelStyle}>Horas a la semana que podrías dedicarle</label>
          <input id="c-hours" required type="number" inputMode="numeric" min={0} max={60} value={f.hours_week} onChange={set('hours_week')} style={inputStyle} {...focus} />
        </div>
        <div>
          <label htmlFor="c-mod" style={labelStyle}>¿Eres autónomo o tienes empresa?</label>
          <select id="c-mod" value={f.modality} onChange={set('modality')} style={inputStyle} {...focus}>
            <option value="">Aún no</option>
            <option value="autonomo">Autónomo</option>
            <option value="sl">Tengo empresa</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="c-job" style={labelStyle}>¿A qué te dedicas ahora? ¿Entras en comercios por trabajo?</label>
        <textarea id="c-job" value={f.occupation} onChange={set('occupation')} rows={3} maxLength={1000} style={{ ...inputStyle, resize: 'vertical' }} {...focus} />
      </div>
      <div>
        <label htmlFor="c-comm" style={labelStyle}>Es una colaboración a comisión, sin sueldo fijo. ¿Te encaja?</label>
        <select id="c-comm" required value={f.accepts_commission} onChange={set('accepts_commission')} style={inputStyle} {...focus}>
          <option value="">Elige…</option>
          <option value="yes">Sí, me encaja</option>
          <option value="no">No, busco un sueldo fijo</option>
        </select>
      </div>
      {/* Campo trampa: oculto para las personas, los robots lo rellenan. */}
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        name="website"
        value={f.website}
        onChange={set('website')}
        style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }}
      />
      <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.55, color: '#45626C', cursor: 'pointer' }}>
        <input type="checkbox" required checked={f.privacy} onChange={set('privacy')} style={{ marginTop: 3, width: 17, height: 17, accentColor: '#FF4E00', flexShrink: 0 }} />
        <span>
          DHARMA BROKERS’ CONSULTING, S.L. (NIF B27607480) trata estos datos solo para este proceso de selección y para escribirte por
          WhatsApp o correo sobre él. No los cedemos. Si no sigues en el proceso, los borramos en 30 días. Puedes pedir acceso,
          rectificación o supresión en hola@appark.es, y reclamar ante la AEPD (aepd.es). Más en la{' '}
          <a href="/legal/privacidad" style={{ color: '#11607A', fontWeight: 700 }}>política de privacidad</a>.
        </span>
      </label>
      {error && (
        <p role="alert" style={{ margin: 0, padding: '11px 14px', borderRadius: 12, background: '#FDECE8', color: '#B3341A', fontSize: 14, fontWeight: 700 }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === 'sending'}
        style={{
          width: '100%', padding: '15px 18px', border: 'none', borderRadius: 14, background: '#FF4E00', color: '#fff',
          fontFamily: 'var(--font-body), sans-serif', fontWeight: 800, fontSize: 16, cursor: state === 'sending' ? 'wait' : 'pointer',
          opacity: state === 'sending' ? 0.6 : 1, boxShadow: '0 14px 30px rgba(255,78,0,.25)',
        }}
      >
        {state === 'sending' ? 'Enviando…' : 'Quiero colaborar'}
      </button>
    </form>
  )
}
