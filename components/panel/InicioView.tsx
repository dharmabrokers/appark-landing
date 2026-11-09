'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePanel } from './PanelShell'
import { fetchLocations, fetchPrizes, fetchResults, fetchVouchers, redeemCode, type LocationRow, type Voucher } from '@/lib/panel/data'
import { setupChecklist, type ChecklistKey } from '@/lib/panel/sponsorProfile'
import { delta, type SponsorResults } from '@/lib/panel/sponsorResults'
import { trialState } from '@/lib/panel/trialStatus'
import { errorMessage, longDate, n, shortDateTime, VOUCHER_STATUS } from '@/lib/panel/text'
import { Button, C, Card, grid, H2, inputStyle, labelStyle, Notice, Stat } from './ui'

const CHECK_TEXT: Record<ChecklistKey, string> = {
  location: 'Añade tu local para salir en el mapa',
  prize: 'Publica un premio para que tengan motivo para entrar',
  logo: 'Sube tu logo',
  description: 'Cuenta en dos líneas qué ofreces',
  hours: 'Pon tu horario',
  cover: 'Sube una foto de portada',
  poster: 'Pon el cartel «Punto de canje» en el escaparate',
}

export default function InicioView() {
  const { sponsor } = usePanel()
  const [week, setWeek] = useState<SponsorResults | null>(null)
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [locations, setLocations] = useState<LocationRow[]>([])
  const [activePrizes, setActivePrizes] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(async () => {
    const [w, v, l, p] = await Promise.all([
      fetchResults(7),
      fetchVouchers(5),
      fetchLocations(sponsor.id).catch(() => []),
      fetchPrizes(sponsor.id).catch(() => []),
    ])
    setWeek(w)
    setVouchers(v)
    setLocations(l)
    setActivePrizes(p.filter((x) => x.status === 'active').length)
    setLoaded(true)
  }, [sponsor.id])

  useEffect(() => {
    void load()
  }, [load])

  const trial = trialState(sponsor.status, sponsor.trialEndsAt, Date.now())
  const checklist = setupChecklist({
    logoUrl: sponsor.logoUrl,
    details: sponsor.details,
    activeLocations: locations.filter((l) => l.active).length,
    activePrizes,
  })
  const pending = checklist.filter((c) => !c.done)

  return (
    <>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem,3.5vw,2rem)', color: C.ink, margin: 0 }}>
          Hola, {sponsor.name}
        </h1>
      </div>

      {trial.kind === 'counting' && (
        <Notice kind="info">
          Estás en tu mes de prueba: te quedan {trial.daysLeft} {trial.daysLeft === 1 ? 'día' : 'días'} (hasta el {longDate(sponsor.trialEndsAt)}).{' '}
          {sponsor.hasSubscription ? 'Después se cobra solo con la tarjeta que registraste.' : <Link href="/panel/plan" style={{ color: C.sea }}>Elige tu paquete</Link>}
        </Notice>
      )}
      {trial.kind === 'ended' && (
        <Notice kind="warn">
          Tu prueba ha terminado y tu comercio no sale en la app. <Link href="/panel/plan" style={{ color: 'inherit' }}>Mira cómo seguir</Link>.
        </Notice>
      )}
      {(sponsor.status === 'suspended' || sponsor.status === 'expired') && trial.kind === 'none' && (
        <Notice kind="warn">
          Tu cuenta no está activa ahora mismo. <Link href="/panel/plan" style={{ color: 'inherit' }}>Mira tu plan</Link> o escríbenos a hola@appark.es.
        </Notice>
      )}

      {loaded && pending.length > 0 && (
        <Card>
          <H2>Para atraer más clientes</H2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
            {checklist.map((c) => (
              <li key={c.key} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14.5 }}>
                <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, background: c.done ? '#E6F7EF' : 'rgba(10,42,54,.06)', color: c.done ? '#1B8A5A' : C.muted }}>
                  {c.done ? '✓' : ''}
                </span>
                {c.done || c.key === 'poster' ? (
                  <span style={{ color: c.done ? C.muted : C.ink, textDecoration: c.done ? 'line-through' : 'none' }}>{CHECK_TEXT[c.key]}</span>
                ) : (
                  <Link href={c.section === 'prizes' ? '/panel/premios' : '/panel/negocio'} style={{ color: C.sea, fontWeight: 700 }}>{CHECK_TEXT[c.key]}</Link>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <H2>Últimos 7 días</H2>
        {week ? (
          <div style={grid(150)}>
            <WeekStat label="Te vieron en el mapa" cur={week.current.impressions} prev={week.previous.impressions} />
            <WeekStat label="Vales conseguidos" cur={week.current.vouchers_issued} prev={week.previous.vouchers_issued} />
            <WeekStat label="Vales canjeados" cur={week.current.vouchers_redeemed} prev={week.previous.vouchers_redeemed} />
            <WeekStat label="Clientes distintos" cur={week.current.unique_customers} prev={week.previous.unique_customers} />
          </div>
        ) : (
          <p style={{ margin: 0, color: C.muted, fontSize: 14 }}>{loaded ? 'Aún no hay datos de esta semana.' : 'Cargando…'}</p>
        )}
        <p style={{ margin: '12px 0 0', fontSize: 14 }}>
          <Link href="/panel/resultados" style={{ color: C.sea, fontWeight: 800 }}>Ver todos los resultados →</Link>
        </p>
      </Card>

      <RedeemCard locations={locations.filter((l) => l.active)} onDone={load} />

      <Card>
        <H2>Últimos vales</H2>
        {vouchers.length === 0 ? (
          <p style={{ margin: 0, color: C.muted, fontSize: 14 }}>{loaded ? 'Todavía nadie ha conseguido un vale tuyo.' : 'Cargando…'}</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
            {vouchers.map((v) => (
              <li key={v.reward_id} style={{ display: 'flex', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap', fontSize: 14, borderBottom: `1px solid ${C.line}`, paddingBottom: 8 }}>
                <span style={{ fontWeight: 700, color: C.ink }}>{v.prize_title}</span>
                <span style={{ color: C.sub }}>
                  {VOUCHER_STATUS[v.status] ?? v.status} · {shortDateTime(v.redeemed_at ?? v.acquired_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}

function WeekStat({ label, cur, prev }: { label: string; cur: number; prev: number }) {
  const d = delta(cur, prev)
  const sub = d ? `${d.pct > 0 ? '+' : ''}${d.pct} % frente a la semana anterior` : undefined
  return <Stat label={label} value={n(cur)} sub={sub} />
}

function RedeemCard({ locations, onDone }: { locations: LocationRow[]; onDone: () => void }) {
  const [code, setCode] = useState('')
  const [loc, setLoc] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setBusy(true)
    setResult(null)
    try {
      const title = await redeemCode(code.trim(), loc || locations[0]?.id || null)
      setResult({ ok: true, msg: `✓ Canjeado: ${title}` })
      setCode('')
      onDone()
    } catch (err) {
      setResult({ ok: false, msg: errorMessage(err, 'No se ha podido canjear. Inténtalo de nuevo.') })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <H2>Validar un vale con su código</H2>
      <p style={{ margin: '0 0 12px', fontSize: 14, color: C.sub, lineHeight: 1.5 }}>
        Lo normal es canjearlo deslizando en el móvil del cliente. Si no puede, pídele el código de su vale y escríbelo aquí.
      </p>
      <form onSubmit={submit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 180px' }}>
          <label htmlFor="r-code" style={labelStyle}>Código del vale</label>
          <input id="r-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} style={{ ...inputStyle, letterSpacing: 2 }} autoComplete="off" />
        </div>
        {locations.length > 1 && (
          <div style={{ flex: '1 1 180px' }}>
            <label htmlFor="r-loc" style={labelStyle}>Local</label>
            <select id="r-loc" value={loc} onChange={(e) => setLoc(e.target.value)} style={inputStyle}>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        )}
        <Button type="submit" disabled={busy || !code.trim()}>{busy ? 'Comprobando…' : 'Canjear'}</Button>
      </form>
      {result && <div style={{ marginTop: 12 }}><Notice kind={result.ok ? 'ok' : 'error'}>{result.msg}</Notice></div>}
    </Card>
  )
}
