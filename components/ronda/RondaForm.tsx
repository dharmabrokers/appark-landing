'use client'
import { useState } from 'react'

/**
 * El formulario de appark.es/ronda. Lo guarda el CRM (migración 0120): llega un acuse por
 * correo y Erik revisa cada solicitud a mano. Aquí no se enseña ninguna condición de la
 * ronda: solo van, en privado, a quien Erik aprueba.
 */

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 15px', border: '1.5px solid rgba(10,42,54,.14)', borderRadius: 12,
  fontSize: 16, fontFamily: 'var(--font-body), sans-serif', color: '#0A2A36', outline: 'none',
  background: '#FCFAF6', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 700, fontSize: 13.5, color: '#0A2A36', marginBottom: 6 }
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, alignItems: 'end' }
const check: React.CSSProperties = { display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.55, color: '#45626C', cursor: 'pointer' }
const box: React.CSSProperties = { marginTop: 3, width: 17, height: 17, accentColor: '#FF4E00', flexShrink: 0 }
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

// Tienen que coincidir con TICKET_LABELS de apps/crm/src/lib/inversores.ts.
const RANGES: [string, string][] = [
  ['1-2', '1.000 – 2.000 €'],
  ['2-5', '2.000 – 5.000 €'],
  ['5-10', '5.000 – 10.000 €'],
  ['10+', 'Más de 10.000 €'],
]

function track(event: string) {
  try {
    window.gtag?.('event', event)
  } catch {}
}

export default function RondaForm({ initialReferrer = '' }: { initialReferrer?: string }) {
  const [f, setF] = useState({
    full_name: '', email: '', phone: '', referrer: initialReferrer, ticket_range: '', message: '', risk_ack: false, privacy: false, website: '',
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
      recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'ronda' }).catch(() => '')
    }
    const res = await fetch('/api/ronda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, recaptchaToken }),
    }).catch(() => null)
    const body = res ? ((await res.json().catch(() => null)) as { ok?: boolean; mensaje?: string } | null) : null
    if (!res || !res.ok || !body?.ok) {
      setError(body?.mensaje ?? 'No se ha podido enviar. Inténtalo de nuevo o escríbenos a hola@appark.es.')
      setState('idle')
      return
    }
    track('ronda_solicitud')
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
        <h3 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 23, color: '#0A2A36', margin: '0 0 10px' }}>¡Gracias!</h3>
        <p style={{ fontSize: 15.5, color: '#45626C', lineHeight: 1.6, margin: 0 }}>
          Te acaba de llegar un correo de confirmación. Erik revisa cada solicitud personalmente y te escribe en menos de 48 horas.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
      <div>
        <label htmlFor="r-name" style={labelStyle}>Nombre y apellidos</label>
        <input id="r-name" required value={f.full_name} onChange={set('full_name')} autoComplete="name" maxLength={120} style={inputStyle} {...focus} />
      </div>
      <div style={grid2}>
        <div>
          <label htmlFor="r-email" style={labelStyle}>Correo</label>
          <input id="r-email" required type="email" value={f.email} onChange={set('email')} autoComplete="email" maxLength={200} style={inputStyle} {...focus} />
        </div>
        <div>
          <label htmlFor="r-phone" style={labelStyle}>Móvil</label>
          <input id="r-phone" required type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" maxLength={40} style={inputStyle} {...focus} />
        </div>
      </div>
      <div style={grid2}>
        <div>
          <label htmlFor="r-ref" style={labelStyle}>¿Quién te ha pasado la invitación?</label>
          <input id="r-ref" required value={f.referrer} onChange={set('referrer')} maxLength={120} placeholder="Nombre y apellido" style={inputStyle} {...focus} />
        </div>
        <div>
          <label htmlFor="r-range" style={labelStyle}>Importe orientativo</label>
          <select id="r-range" required value={f.ticket_range} onChange={set('ticket_range')} style={inputStyle} {...focus}>
            <option value="">Elige…</option>
            {RANGES.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="r-msg" style={labelStyle}>¿Algo que quieras contarnos o preguntarnos? (opcional)</label>
        <textarea id="r-msg" value={f.message} onChange={set('message')} rows={3} maxLength={1000} style={{ ...inputStyle, resize: 'vertical' }} {...focus} />
      </div>
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        name="website"
        value={f.website}
        onChange={set('website')}
        style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }}
      />
      <label style={check}>
        <input type="checkbox" required checked={f.risk_ack} onChange={set('risk_ack')} style={box} />
        <span>
          Entiendo que invertir en una empresa que empieza tiene riesgo: puedo perder lo que aporte. Solo pondría una cantidad que pueda
          permitirme perder.
        </span>
      </label>
      <label style={check}>
        <input type="checkbox" required checked={f.privacy} onChange={set('privacy')} style={box} />
        <span>
          DHARMA BROKERS’ CONSULTING, S.L. (NIF B27607480) trata estos datos solo para gestionar tu solicitud para esta ronda y escribirte
          sobre ella. No los cedemos. Si no llegas a participar, los conservamos solo para avisarte de la próxima ronda y los borramos cuando
          nos lo pidas. Puedes pedir acceso, rectificación o supresión en hola@appark.es, y reclamar ante la AEPD (aepd.es). Más en la{' '}
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
        {state === 'sending' ? 'Enviando…' : 'Reservar mi plaza'}
      </button>
    </form>
  )
}
