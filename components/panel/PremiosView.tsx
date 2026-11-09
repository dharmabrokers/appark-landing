'use client'
import { useCallback, useEffect, useState } from 'react'
import { usePanel } from './PanelShell'
import ImageField from './ImageField'
import { fetchPrizes, fetchTierUsage, PRIZE_TYPES, savePrize, setPrizeActive, type Prize, type PrizeType, type TierUsageRow } from '@/lib/panel/data'
import { isAtLimit, nextTier, usageLabel } from '@/lib/panel/tierUsage'
import { errorMessage, PRIZE_TYPE_LABELS, TIER_NAMES } from '@/lib/panel/text'
import { Button, C, Card, grid, H2, hintStyle, inputStyle, labelStyle, Notice } from './ui'

interface Form {
  id: string | null
  title: string
  description: string
  prize_type: PrizeType
  points_cost: string
  quantity_total: string
  discount_pct: string
  image_url: string | null
  validity_days: string
}

const EMPTY: Form = { id: null, title: '', description: '', prize_type: 'product', points_cost: '50', quantity_total: '25', discount_pct: '', image_url: null, validity_days: '' }

export default function PremiosView() {
  const { sponsor } = usePanel()
  const [prizes, setPrizes] = useState<Prize[] | null>(null)
  const [usage, setUsage] = useState<TierUsageRow | null>(null)
  const [form, setForm] = useState<Form | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    try {
      setPrizes(await fetchPrizes(sponsor.id))
    } catch {
      setPrizes([])
      setError('No se han podido cargar tus premios.')
    }
    setUsage(await fetchTierUsage())
  }, [sponsor.id])

  useEffect(() => {
    void load()
  }, [load])

  const prizeUsage = usage ? { tier: sponsor.tier, used: usage.prizesUsed, limit: usage.prizesLimit } : null
  const next = nextTier(sponsor.tier)

  const edit = (p: Prize) =>
    setForm({
      id: p.id, title: p.title, description: p.description, prize_type: p.prize_type,
      points_cost: String(p.points_cost), quantity_total: String(p.quantity_total),
      discount_pct: p.discount_pct != null ? String(p.discount_pct) : '', image_url: p.image_url,
      validity_days: p.validity_days ? String(p.validity_days) : '',
    })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form || !form.title.trim()) return
    setSaving(true)
    setError('')
    try {
      await savePrize(sponsor.id, {
        id: form.id,
        title: form.title.trim(),
        description: form.description.trim(),
        prize_type: form.prize_type,
        points_cost: Math.max(1, parseInt(form.points_cost, 10) || 1),
        quantity_total: Math.max(1, parseInt(form.quantity_total, 10) || 1),
        discount_pct: form.discount_pct ? Math.min(100, Math.max(1, parseInt(form.discount_pct, 10) || 0)) : null,
        image_url: form.image_url,
        validity_days: form.validity_days.trim() ? Math.min(365, Math.max(1, parseInt(form.validity_days, 10) || 1)) : null,
      })
      setForm(null)
      setMsg('Premio guardado.')
      await load()
    } catch (err) {
      setError(errorMessage(err, 'No se ha podido guardar el premio.'))
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (p: Prize) => {
    setError('')
    setMsg('')
    try {
      await setPrizeActive(p.id, p.status !== 'active')
      await load()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const f = form
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    f && setForm({ ...f, [k]: e.target.value })

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem,3.5vw,2rem)', color: C.ink, margin: 0, flex: 1 }}>Tus premios</h1>
        {!f && <Button onClick={() => { setForm(EMPTY); setMsg(''); setError('') }}>+ Nuevo premio</Button>}
      </div>

      {prizeUsage && prizeUsage.limit > 0 && (
        <Notice kind={isAtLimit(prizeUsage) ? 'warn' : 'info'}>
          Premios activos: {usageLabel(prizeUsage)} en tu paquete {TIER_NAMES[sponsor.tier]}.
          {isAtLimit(prizeUsage) && next ? ` Con ${TIER_NAMES[next]} puedes tener más.` : ''}
        </Notice>
      )}
      {msg && <Notice kind="ok">{msg}</Notice>}
      {error && <Notice kind="error">{error}</Notice>}

      {f && (
        <Card>
          <H2>{f.id ? 'Editar premio' : 'Nuevo premio'}</H2>
          <form onSubmit={save} style={{ display: 'grid', gap: 14 }}>
            <div>
              <label htmlFor="pz-title" style={labelStyle}>Qué ofreces</label>
              <input id="pz-title" required maxLength={80} value={f.title} onChange={set('title')} placeholder="Un café gratis" style={inputStyle} />
            </div>
            <div>
              <label htmlFor="pz-desc" style={labelStyle}>Condiciones</label>
              <textarea id="pz-desc" rows={2} maxLength={300} value={f.description} onChange={set('description')} placeholder="De lunes a viernes, con cualquier consumición." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={grid(170)}>
              <div>
                <label htmlFor="pz-type" style={labelStyle}>Tipo</label>
                <select id="pz-type" value={f.prize_type} onChange={set('prize_type')} style={inputStyle}>
                  {PRIZE_TYPES.map((t) => <option key={t} value={t}>{PRIZE_TYPE_LABELS[t]}</option>)}
                </select>
              </div>
              {f.prize_type === 'discount' && (
                <div>
                  <label htmlFor="pz-pct" style={labelStyle}>Descuento (%)</label>
                  <input id="pz-pct" type="number" min={1} max={100} value={f.discount_pct} onChange={set('discount_pct')} style={inputStyle} />
                </div>
              )}
              <div>
                <label htmlFor="pz-pts" style={labelStyle}>Puntos que cuesta</label>
                <input id="pz-pts" type="number" min={1} value={f.points_cost} onChange={set('points_cost')} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="pz-qty" style={labelStyle}>Unidades</label>
                <input id="pz-qty" type="number" min={1} value={f.quantity_total} onChange={set('quantity_total')} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="pz-days" style={labelStyle}>Días para usarlo</label>
                <input id="pz-days" type="number" min={1} max={365} value={f.validity_days} onChange={set('validity_days')} placeholder="Por defecto" style={inputStyle} />
              </div>
            </div>
            <div style={hintStyle}>Los premios los pones tú, de tu propio género y a tu precio de coste.</div>
            <ImageField sponsorId={sponsor.id} folder="prizes" label="Foto del premio (opcional)" value={f.image_url} onChange={(url) => setForm({ ...f, image_url: url })} />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar premio'}</Button>
              <Button kind="ghost" onClick={() => setForm(null)} disabled={saving}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      {prizes === null ? (
        <p style={{ color: C.muted }}>Cargando…</p>
      ) : prizes.length === 0 ? (
        <Card><p style={{ margin: 0, color: C.sub }}>Aún no tienes premios. Crea el primero: es el motivo para que los conductores entren en tu comercio.</p></Card>
      ) : (
        <div style={grid(260)}>
          {prizes.map((p) => (
            <Card key={p.id} style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: C.sand, overflow: 'hidden', flexShrink: 0 }}>
                  {p.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: C.ink, fontSize: 15.5 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: C.sub }}>
                    {p.points_cost} puntos · {p.quantity_remaining} de {p.quantity_total} disponibles
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 800, marginTop: 4, color: p.status === 'active' ? '#1B8A5A' : C.muted }}>
                    {p.status === 'active' ? '● Publicado' : p.status === 'paused' ? '○ En pausa por tu paquete' : '○ En pausa'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <Button kind="ghost" onClick={() => { edit(p); setMsg(''); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Editar</Button>
                {p.status !== 'paused' && (
                  <Button kind="ghost" onClick={() => toggle(p)}>{p.status === 'active' ? 'Pausar' : 'Publicar'}</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
