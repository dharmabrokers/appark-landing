'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { panelDb } from '@/lib/panel/supabase'
import { Button, C, Card, hintStyle, inputStyle, labelStyle, Notice } from './ui'

/**
 * Entrar al panel con un código al correo, igual que en la app (0090/PR 147).
 *
 * shouldCreateUser: false. Un correo que no tiene cuenta no crea un usuario vacío:
 * Supabase no manda nada y aquí se dice lo mismo en los dos casos, para no revelar
 * qué correos son de un comercio. El correo trae también un enlace, que vuelve a
 * /panel ya con la sesión abierta.
 */
export default function PanelLogin({ notSponsor }: { notSponsor?: boolean }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(notSponsor ? 'Ese correo no tiene un comercio en Appark.' : '')

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const clean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return setError('Escribe un correo válido.')
    setBusy(true)
    const { error: err } = await panelDb().auth.signInWithOtp({
      email: clean,
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/panel/inicio` },
    })
    setBusy(false)
    // Un correo sin cuenta da error aquí; se sigue igual para no decir si existe.
    if (err && /rate|limit|security purposes/i.test(err.message)) {
      return setError('Has pedido varios códigos seguidos. Espera un minuto y vuelve a probar.')
    }
    setEmail(clean)
    setStep('code')
  }

  const verify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const token = code.replace(/\D/g, '')
    if (token.length < 6) return setError('El código tiene 6 cifras.')
    setBusy(true)
    const { error: err } = await panelDb().auth.verifyOtp({ email, token, type: 'email' })
    setBusy(false)
    if (err) return setError('El código no es correcto o ha caducado. Pide otro.')
    // PanelShell recibe SIGNED_IN y comprueba que es un comercio.
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#FBF6EE 0%,#F8FAFB 60%)', padding: '18px 16px 60px' }}>
      <header style={{ maxWidth: 1080, margin: '0 auto 28px' }}>
        <Link href="/" aria-label="Appark" style={{ display: 'inline-flex' }}>
          <Image src="/logo-appark-logotipo.png" alt="Appark" width={0} height={0} sizes="120px" priority style={{ display: 'block', height: 30, width: 'auto' }} />
        </Link>
      </header>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 'clamp(1.7rem,4vw,2.2rem)', color: C.ink, margin: '0 0 8px', lineHeight: 1.1 }}>
          Panel del comercio
        </h1>
        <p style={{ fontSize: 15.5, color: C.sub, lineHeight: 1.55, margin: '0 0 20px' }}>
          Tus premios, tus resultados y los datos de tu negocio, desde el ordenador. Es la misma cuenta que usas en la app.
        </p>
        <Card>
          {step === 'email' ? (
            <form onSubmit={sendCode} style={{ display: 'grid', gap: 14 }}>
              <div>
                <label htmlFor="p-email" style={labelStyle}>Correo de tu comercio</label>
                <input id="p-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                <div style={hintStyle}>El que diste al darte de alta. Te mandamos un código para entrar, sin contraseña.</div>
              </div>
              {error && <Notice kind="error">{error}</Notice>}
              <Button type="submit" disabled={busy}>{busy ? 'Enviando…' : 'Enviarme el código'}</Button>
            </form>
          ) : (
            <form onSubmit={verify} style={{ display: 'grid', gap: 14 }}>
              <Notice kind="info">Si {email} es el correo de un comercio de Appark, te acaba de llegar un código. Mira también en spam.</Notice>
              <div>
                <label htmlFor="p-code" style={labelStyle}>Código de 6 cifras</label>
                <input
                  id="p-code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code}
                  onChange={(e) => setCode(e.target.value)} style={{ ...inputStyle, fontSize: 22, letterSpacing: 6, textAlign: 'center' }}
                />
                <div style={hintStyle}>También puedes pulsar el enlace del mismo correo.</div>
              </div>
              {error && <Notice kind="error">{error}</Notice>}
              <Button type="submit" disabled={busy}>{busy ? 'Comprobando…' : 'Entrar'}</Button>
              <Button kind="ghost" onClick={() => { setStep('email'); setCode(''); setError('') }}>Usar otro correo</Button>
            </form>
          )}
        </Card>
        <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.55, marginTop: 18 }}>
          ¿Aún no tienes tu comercio en Appark? <Link href="/alta" style={{ color: C.sea, fontWeight: 800 }}>Date de alta</Link> con el primer mes gratis.
          ¿Problemas para entrar? Escríbenos a <a href="mailto:hola@appark.es" style={{ color: C.sea, fontWeight: 800 }}>hola@appark.es</a>.
        </p>
      </div>
    </div>
  )
}
