'use client'
import { useEffect, useState } from 'react'
import { vecinoErrorText, weeklyLimitRange, weeklyLimitToSend, type WeeklyQuota } from '@/lib/panel/vecino'
import { fetchWeeklyQuota, setWeeklyLimit } from '@/lib/panel/vecinoApi'
import { Button, C, Card, H2, Notice } from '../ui'

/**
 * Bronce y Plata eligen su tope de canjes por semana (§2.2 regla 4,
 * sponsor_set_weekly_limit de la 0124), como WeeklyLimitCard de la app. Solo con
 * flags.freemium_sponsors encendido: sin él, my_weekly_quota no trae custom_min
 * y esto no se pinta.
 */
export default function WeeklyLimitCard() {
  const [quota, setQuota] = useState<WeeklyQuota | null>(null)
  const [value, setValue] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    void fetchWeeklyQuota().then((q) => {
      setQuota(q)
      setValue(weeklyLimitRange(q)?.value ?? null)
    })
  }, [])

  const range = weeklyLimitRange(quota)
  if (!range || value === null) return null

  const save = async () => {
    setSaving(true)
    setMsg(null)
    try {
      const q = await setWeeklyLimit(weeklyLimitToSend(value, range))
      if (q) {
        setQuota(q)
        setValue(weeklyLimitRange(q)?.value ?? value)
      }
      setMsg({ ok: true, text: 'Tope guardado.' })
    } catch (err) {
      setMsg({ ok: false, text: vecinoErrorText(String((err as { message?: unknown } | null)?.message ?? '')) ?? 'No se ha podido guardar. Inténtalo de nuevo.' })
    } finally {
      setSaving(false)
    }
  }

  const step = (d: number) => setValue((v) => Math.min(range.max, Math.max(range.min, (v ?? range.max) + d)))

  return (
    <Card>
      <H2>Canjes por semana</H2>
      <p style={{ margin: '0 0 12px', fontSize: 14.5, color: C.sub }}>
        Elige cuántos das como mucho cada semana (entre {range.min} y {range.max}).
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Button kind="ghost" onClick={() => step(-1)} disabled={saving || value <= range.min}>−</Button>
        <span style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 22, color: C.ink, minWidth: 140, textAlign: 'center' }}>
          {value} por semana
        </span>
        <Button kind="ghost" onClick={() => step(1)} disabled={saving || value >= range.max}>+</Button>
        <Button onClick={save} disabled={saving || value === range.value}>{saving ? 'Guardando…' : 'Guardar'}</Button>
      </div>
      {value === range.max && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: C.muted }}>Con {range.max} usas todo tu paquete.</p>}
      {msg && <div style={{ marginTop: 12 }}><Notice kind={msg.ok ? 'ok' : 'error'}>{msg.text}</Notice></div>}
    </Card>
  )
}
