'use client'
import { useEffect, useState } from 'react'
import { inviteWindowOpen, vecinoErrorText } from '@/lib/panel/vecino'
import { acceptSponsorInvite, fetchMyInviteCode } from '@/lib/panel/vecinoApi'
import { longDate } from '@/lib/panel/text'
import { Button, C, Card, H2, inputStyle, Notice } from '../ui'

/** Ya dijo quién le invitó: se recuerda en este navegador para no volver a ofrecer el campo. */
const ACCEPTED_KEY = 'appark.vecino.inviteAccepted.'

/**
 * Invitar a otro comercio (§2.2 regla 7, 0126), como InviteCard de la app.
 * Cuando el invitado publica su premio y tiene su primer canje, los dos ganan
 * 15 días de métricas Plata y +1 canje por semana (quien invita, +3 como mucho).
 *
 * - El código propio ('V…', my_sponsor_invite_code), para copiar o compartir.
 * - «¿Te invitó otro comercio?»: sponsor_accept_invite, mientras el servidor lo
 *   admite (sponsor.invite_window_days desde el alta).
 */
export default function InviteCard({ sponsorId, createdAt, windowDays }: { sponsorId: string; createdAt: string | null; windowDays: number }) {
  const [code, setCode] = useState<string | null>(null)
  const [accepted, setAccepted] = useState<boolean | null>(null)
  const [typed, setTyped] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    void fetchMyInviteCode().then(setCode)
    try {
      setAccepted(localStorage.getItem(ACCEPTED_KEY + sponsorId) === '1')
    } catch {
      setAccepted(false)
    }
  }, [sponsorId])

  const markAccepted = () => {
    setAccepted(true)
    try {
      localStorage.setItem(ACCEPTED_KEY + sponsorId, '1')
    } catch {}
  }

  const message = code
    ? `Te invito a Appark: anuncia tu negocio gratis a los conductores de Palma. Descárgate Appark, ve a la pestaña Comercio y, al darte de alta, pon mi código ${code}. Cuando publiques tu premio y tengas tu primer canje, los dos tenemos 15 días de Plata y un canje más por semana.`
    : ''

  const share = async () => {
    if (!code) return
    try {
      if (navigator.share) {
        await navigator.share({ text: message })
        return
      }
    } catch {
      return // canceló el menú de compartir
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener')
  }

  const copy = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const redeem = async (e: React.FormEvent) => {
    e.preventDefault()
    const c = typed.trim().toUpperCase()
    if (!c || saving) return
    setSaving(true)
    setMsg(null)
    try {
      await acceptSponsorInvite(c)
      markAccepted()
      setMsg({ ok: true, text: 'Código guardado. Cuando tengas tu primer canje, os llegan los 15 días de Plata a los dos.' })
    } catch (err) {
      const raw = String((err as { message?: unknown } | null)?.message ?? '')
      if (raw.includes('ALREADY_INVITED') || raw.includes('INVITE_TOO_LATE')) markAccepted()
      setMsg({ ok: false, text: vecinoErrorText(raw) ?? 'No se ha podido guardar el código. Inténtalo de nuevo.' })
    } finally {
      setSaving(false)
    }
  }

  const showRedeem = inviteWindowOpen(createdAt, Date.now(), windowDays) && accepted === false
  if (!code && !showRedeem && !msg) return null
  const until = createdAt ? longDate(new Date(Date.parse(createdAt) + windowDays * 86_400_000).toISOString()) : ''

  return (
    <Card>
      {code && (
        <>
          <H2>🤝 Invita a otro comercio</H2>
          <p style={{ margin: 0, fontSize: 14.5, color: C.sub, lineHeight: 1.5 }}>
            Cuando publique su premio y tenga su primer canje, los dos tenéis 15 días de Plata y un canje más por semana.
          </p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}>
            <span style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: 3, color: C.ink }}>{code}</span>
            <Button kind="ghost" onClick={copy}>{copied ? 'Copiado ✓' : 'Copiar'}</Button>
            <Button kind="ghost" onClick={share}>Enviar invitación</Button>
          </div>
        </>
      )}
      {showRedeem && (
        <form onSubmit={redeem} style={{ borderTop: code ? `1px solid ${C.line}` : 'none', marginTop: code ? 16 : 0, paddingTop: code ? 14 : 0 }}>
          <div style={{ fontWeight: 800, color: C.ink, fontSize: 14.5, marginBottom: 4 }}>¿Te invitó otro comercio?</div>
          <p style={{ margin: '0 0 10px', fontSize: 13.5, color: C.sub }}>
            Pon su código hasta el {until}. Cuando tengas tu primer canje, los dos tenéis 15 días de Plata y un canje más por semana.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value.toUpperCase().replace(/\s+/g, ''))}
              placeholder="V1A2B3C"
              maxLength={7}
              aria-label="Código de invitación"
              style={{ ...inputStyle, letterSpacing: 3, fontWeight: 800, flex: 1 }}
            />
            <Button type="submit" disabled={saving || typed.trim().length < 7}>{saving ? 'Guardando…' : 'Usar código'}</Button>
          </div>
        </form>
      )}
      {msg && <div style={{ marginTop: 12 }}><Notice kind={msg.ok ? 'ok' : 'error'}>{msg.text}</Notice></div>}
    </Card>
  )
}
