'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePanel } from './PanelShell'
import { fetchAudience, fetchOfferStats, fetchResults, fetchVouchers, type AudienceStats, type OfferStat, type Voucher } from '@/lib/panel/data'
import { delta, funnel, maxOf, rate, resultsCsv, trackingStartedMidPeriod, type SponsorResults } from '@/lib/panel/sponsorResults'
import { longDate, n, shortDateTime, VOUCHER_STATUS } from '@/lib/panel/text'
import { Bars, Button, C, Card, grid, H2, Stat } from './ui'

const DAYS = [7, 30, 90] as const
const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const STEP_LABEL = { impressions: 'Te vieron', taps: 'Abrieron tu ficha', directions: 'Pidieron cómo llegar', redeemed: 'Canjearon' }

export default function ResultadosView() {
  const { sponsor } = usePanel()
  const [days, setDays] = useState<number>(30)
  const [r, setR] = useState<SponsorResults | null | undefined>(undefined)
  const [offers, setOffers] = useState<OfferStat[] | null>(null)
  const [audience, setAudience] = useState<AudienceStats | null>(null)
  const [history, setHistory] = useState<Voucher[]>([])

  const load = useCallback(async () => {
    setR(undefined)
    const silverUp = sponsor.tier === 'silver' || sponsor.tier === 'gold'
    const [res, off, aud, h] = await Promise.all([
      fetchResults(days),
      fetchOfferStats(),
      silverUp ? fetchAudience() : Promise.resolve(null),
      fetchVouchers(100),
    ])
    setR(res)
    setOffers(off)
    setAudience(aud)
    setHistory(h)
  }, [days, sponsor.tier])

  useEffect(() => {
    void load()
  }, [load])

  const downloadCsv = () => {
    if (!r) return
    const blob = new Blob([resultsCsv(r)], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `appark-resultados-${r.from}-${r.to}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const c = r?.current
  const steps = c ? funnel(c) : null

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem,3.5vw,2rem)', color: C.ink, margin: 0, flex: 1 }}>Resultados</h1>
        <div role="group" aria-label="Periodo" style={{ display: 'flex', gap: 6 }}>
          {DAYS.map((d) => (
            <Button key={d} kind={d === days ? 'primary' : 'ghost'} onClick={() => setDays(d)} style={{ padding: '8px 12px' }}>{d} días</Button>
          ))}
        </div>
      </div>

      {r === undefined && <p style={{ color: C.muted }}>Cargando…</p>}
      {r === null && <Card><p style={{ margin: 0, color: C.sub }}>No se han podido cargar los resultados. Prueba en un rato.</p></Card>}

      {r && c && (
        <>
          {trackingStartedMidPeriod(r) && (
            <p style={{ margin: 0, fontSize: 13.5, color: C.sub }}>
              {r.tracking_since
                ? `Las visitas en el mapa se miden desde el ${longDate(r.tracking_since)}: antes de esa fecha salen a cero.`
                : 'Aún no hay visitas medidas: aparecerán en cuanto alguien te vea en el mapa.'}
            </p>
          )}
          <Card>
            <div style={grid(150)}>
              <DeltaStat label="Te vieron en el mapa" cur={c.impressions} prev={r.previous.impressions} />
              <DeltaStat label="Vales conseguidos" cur={c.vouchers_issued} prev={r.previous.vouchers_issued} />
              <DeltaStat label="Vales canjeados" cur={c.vouchers_redeemed} prev={r.previous.vouchers_redeemed} />
              <DeltaStat label="Clientes distintos" cur={c.unique_customers} prev={r.previous.unique_customers} />
            </div>
          </Card>

          <Card>
            <H2>Personas que te vieron en el mapa, día a día</H2>
            <DailyChart daily={r.daily} />
          </Card>

          {steps ? (
            <Card>
              <H2>De verte a entrar</H2>
              <p style={{ margin: '0 0 12px', fontSize: 13.5, color: C.sub }}>Personas distintas en cada paso, y cuántas pasan al siguiente.</p>
              <div style={grid(140)}>
                {steps.map((s) => (
                  <Stat key={s.key} label={STEP_LABEL[s.key]} value={n(s.value)} sub={s.rate != null ? `${s.rate} % del paso anterior` : undefined} />
                ))}
              </div>
              {c.prize_views !== undefined && <p style={{ margin: '12px 0 0', fontSize: 14, color: C.sub }}>{n(c.prize_views)} personas miraron tus premios.</p>}
            </Card>
          ) : (
            <Locked text="Con el paquete Plata verías quién abre tu ficha, cuántos piden cómo llegar y cada local por separado." />
          )}

          {r.by_location && r.by_location.length > 1 && (
            <Card>
              <H2>Por local</H2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: C.muted }}>
                      <th style={{ padding: '6px 8px' }}>Local</th><th style={{ padding: '6px 8px' }}>Te vieron</th><th style={{ padding: '6px 8px' }}>Fichas</th>
                      <th style={{ padding: '6px 8px' }}>Cómo llegar</th><th style={{ padding: '6px 8px' }}>Canjes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.by_location.map((l) => (
                      <tr key={l.location_id} style={{ borderTop: `1px solid ${C.line}` }}>
                        <td style={{ padding: '8px', fontWeight: 700, color: C.ink }}>{l.name}</td>
                        <td style={{ padding: '8px' }}>{n(l.impressions)}</td><td style={{ padding: '8px' }}>{n(l.taps)}</td>
                        <td style={{ padding: '8px' }}>{n(l.directions)}</td><td style={{ padding: '8px' }}>{n(l.redeemed)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {c.banner_impressions !== undefined ? (
            <>
              <Card>
                <H2>Tu banner en la app</H2>
                <p style={{ margin: 0, fontSize: 14.5, color: C.ink }}>
                  {n(c.banner_impressions)} personas lo vieron y {n(c.banner_taps ?? 0)} lo tocaron ({rate(c.banner_taps ?? 0, c.banner_impressions) ?? 0} %).
                </p>
              </Card>
              <div style={grid(300)}>
                {r.by_weekday && (
                  <Card>
                    <H2>Canjes por día de la semana</H2>
                    <Bars rows={r.by_weekday.map((w) => ({ label: WEEKDAYS[w.dow - 1] ?? String(w.dow), value: w.redeemed }))} max={maxOf(r.by_weekday.map((w) => w.redeemed))} />
                  </Card>
                )}
                {r.by_hour && (
                  <Card>
                    <H2>Canjes por hora</H2>
                    <Bars rows={r.by_hour.filter((h) => h.hour >= 7 && h.hour <= 23).map((h) => ({ label: `${h.hour} h`, value: h.redeemed }))} max={maxOf(r.by_hour.map((h) => h.redeemed))} />
                  </Card>
                )}
              </div>
              <Card>
                <H2>Frente a tu categoría</H2>
                <p style={{ margin: 0, fontSize: 14.5, color: C.ink }}>
                  {r.benchmark
                    ? `Te vieron ${n(c.impressions)} personas (media de tu categoría: ${n(r.benchmark.impressions)}) y canjeaste ${n(c.vouchers_redeemed)} vales (media: ${n(r.benchmark.vouchers_redeemed)}).`
                    : 'Aún hay pocos comercios de tu categoría para compararte sin que se sepa quién es quién.'}
                </p>
              </Card>
              <div><Button kind="ghost" onClick={downloadCsv}>⬇ Descargar datos (CSV)</Button></div>
            </>
          ) : (
            steps && <Locked text="Con el paquete Oro verías tu banner, los días y horas en que más se canjea, cómo vas frente a tu categoría y podrías descargar los datos." />
          )}
        </>
      )}

      {offers && offers.length > 0 && (
        <Card>
          <H2>Avisos al aparcar</H2>
          <p style={{ margin: '0 0 12px', fontSize: 13.5, color: C.sub }}>
            Cuando alguien aparca a menos de 500 m y ya tiene puntos de sobra, Appark le avisa de tu premio. Últimos 30 días.
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            {offers.map((o) => (
              <div key={o.prize_id} style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>
                <div style={{ fontWeight: 800, color: C.ink, marginBottom: 8 }}>{o.prize_title}</div>
                <div style={grid(110)}>
                  <Stat label="Lo vieron" value={n(o.shown)} />
                  <Stat label="Lo quieren" value={n(o.wanted)} />
                  <Stat label="Ahora no" value={n(o.dismissed)} />
                  <Stat label="Canjeado" value={n(o.redeemed)} sub={o.shown ? `${Math.round((o.redeemed / o.shown) * 100)} % de los que lo vieron` : undefined} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {audience && audience.sample_size > 0 && (
        <Card>
          <H2>Datos de tu audiencia</H2>
          <p style={{ margin: '0 0 12px', fontSize: 13.5, color: C.sub }}>
            Basado en {n(audience.sample_size)} conductores activos en un radio de {audience.radius_m} m de tus locales (últimos 90 días).
          </p>
          <div style={grid(260)}>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: C.muted, marginBottom: 6 }}>IDIOMA</div>
              <Bars rows={audience.by_language.map((l) => ({ label: l.language.toUpperCase(), value: l.count }))} max={maxOf(audience.by_language.map((l) => l.count))} />
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: C.muted, marginBottom: 6 }}>HORA DE ACTIVIDAD</div>
              <Bars rows={audience.by_hour.map((h) => ({ label: `${h.hour} h`, value: h.count }))} max={maxOf(audience.by_hour.map((h) => h.count))} />
            </div>
          </div>
        </Card>
      )}

      <Card>
        <H2>Historial de vales</H2>
        {history.length === 0 ? (
          <p style={{ margin: 0, color: C.muted, fontSize: 14 }}>Todavía no hay vales.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: C.muted }}>
                  <th style={{ padding: '6px 8px' }}>Premio</th><th style={{ padding: '6px 8px' }}>Estado</th><th style={{ padding: '6px 8px' }}>Conseguido</th><th style={{ padding: '6px 8px' }}>Canjeado</th>
                </tr>
              </thead>
              <tbody>
                {history.map((v) => (
                  <tr key={v.reward_id} style={{ borderTop: `1px solid ${C.line}` }}>
                    <td style={{ padding: '8px', fontWeight: 700, color: C.ink }}>{v.prize_title}</td>
                    <td style={{ padding: '8px' }}>{VOUCHER_STATUS[v.status] ?? v.status}</td>
                    <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>{shortDateTime(v.acquired_at)}</td>
                    <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>{shortDateTime(v.redeemed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}

function DeltaStat({ label, cur, prev }: { label: string; cur: number; prev: number }) {
  const d = delta(cur, prev)
  return <Stat label={label} value={n(cur)} sub={d ? `${d.dir === 'up' ? '▲' : d.dir === 'down' ? '▼' : '='} ${Math.abs(d.pct)} % frente al periodo anterior` : undefined} />
}

function DailyChart({ daily }: { daily: SponsorResults['daily'] }) {
  const max = maxOf(daily.map((d) => d.impressions))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 120 }} role="img" aria-label="Visitas por día">
      {daily.map((d) => (
        <div
          key={d.day}
          title={`${d.day}: ${d.impressions} personas, ${d.redeemed} canjes`}
          style={{ flex: 1, minWidth: 2, height: `${Math.max(2, Math.round((d.impressions / max) * 100))}%`, background: d.impressions ? C.sea : 'rgba(10,42,54,.08)', borderRadius: '4px 4px 0 0' }}
        />
      ))}
    </div>
  )
}

function Locked({ text }: { text: string }) {
  return (
    <Card style={{ background: '#F4F8F9' }}>
      <p style={{ margin: 0, fontSize: 14.5, color: C.sub }}>
        🔒 {text} <Link href="/panel/plan" style={{ color: C.sea, fontWeight: 800 }}>Ver paquetes</Link>
      </p>
    </Card>
  )
}
