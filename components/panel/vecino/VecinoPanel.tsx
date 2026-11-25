'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  avgTicket, DEFAULT_FREE_RULES, freePrizeFix, hasLostDemand, lostSalesEstimate, upgradeSentText, vecinoPanelErrorText,
  type CatalogEntry, type FreePrizeRules, type LostDemand, type WeeklyQuota,
} from '@/lib/panel/vecino'
import {
  fetchCatalog, fetchLostDemand, fetchPausedPrizes, fetchWeeklyQuota, publishFixedPrize, requestUpgrade, type PausedPrize, type VecinoConfig,
} from '@/lib/panel/vecinoApi'
import { isFounder } from '@/lib/alta'
import { PLAN_FEES } from '@/lib/plans'
import { n } from '@/lib/panel/text'
import { Button, C, Card, grid, H2, Notice, Stat } from '../ui'
import PosterCard from './PosterCard'
import InviteCard from './InviteCard'

const CATEGORY_LABEL: Record<string, string> = {
  restaurant: 'restauración', shop: 'tienda', fitness: 'deporte', beauty: 'belleza', leisure: 'ocio',
  services: 'servicios', health: 'salud', automotive: 'motor', other: 'tu categoría',
}

/**
 * La portada del panel web para un comercio en Vecino (§2.2, 0124-0126), encima
 * de lo de siempre. Paridad con VecinoPanel de la app:
 *
 *   1. Demanda perdida: el cupo agotado y quién se quedó sin el premio, con la
 *      estimación de ventas rotulada como estimación.
 *   2. Canjes de la semana, con el bonus (cartel, invitación).
 *   3. El premio que la bajada a Vecino pausó por tipo o coste, con «Ajustar y
 *      publicar»; o el pausado por reportes, que revisa el equipo.
 *   4. El cartel cada 60 días (solo con el interruptor) e invitar a otro comercio.
 *   5. La subida de plan. En la web SÍ lleva precio (la norma de las tiendas es
 *      de la app iOS); la petición es la misma, sponsor_upgrade_request, y el
 *      enlace de pago llega por WhatsApp o correo con el código de su comercial.
 */
export default function VecinoPanel({
  sponsorId, category, createdAt, freemiumOn, config, onPrizesChanged,
}: {
  sponsorId: string
  category: string
  createdAt: string | null
  freemiumOn: boolean
  config: VecinoConfig
  onPrizesChanged?: () => void
}) {
  const [quota, setQuota] = useState<WeeklyQuota | null>(null)
  const [demand, setDemand] = useState<LostDemand | null>(null)
  const [rules, setRules] = useState<FreePrizeRules>(DEFAULT_FREE_RULES)
  const [bronze, setBronze] = useState<CatalogEntry | null>(null)
  const [paused, setPaused] = useState<PausedPrize[]>([])
  const [fixing, setFixing] = useState<string | null>(null)
  const [fixMsg, setFixMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [asking, setAsking] = useState(false)
  const [sent, setSent] = useState<string | null>(null)
  const [askError, setAskError] = useState('')

  const loadPaused = useCallback(async () => setPaused(await fetchPausedPrizes(sponsorId)), [sponsorId])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const [q, d, cat] = await Promise.all([fetchWeeklyQuota(), fetchLostDemand(7), fetchCatalog()])
      if (cancelled) return
      setQuota(q)
      setDemand(d)
      setRules(cat.rules)
      setBronze(cat.limits.bronze ?? null)
    })()
    void loadPaused()
    return () => {
      cancelled = true
    }
  }, [loadPaused])

  const fix = async (p: PausedPrize) => {
    const f = freePrizeFix(p, rules)
    if (!f || fixing) return
    setFixing(p.id)
    setFixMsg(null)
    try {
      await publishFixedPrize(p.id, f.patch)
      setFixMsg({ ok: true, text: 'Premio ajustado y publicado 💚' })
      await loadPaused()
      onPrizesChanged?.()
    } catch (err) {
      setFixMsg({ ok: false, text: vecinoPanelErrorText(String((err as { message?: unknown } | null)?.message ?? ''), true) ?? 'No se ha podido publicar. Inténtalo de nuevo.' })
    } finally {
      setFixing(null)
    }
  }

  const ask = async () => {
    if (asking) return
    setAsking(true)
    setAskError('')
    try {
      setSent(upgradeSentText(await requestUpgrade('bronze')))
    } catch (err) {
      const raw = String((err as { message?: unknown } | null)?.message ?? '')
      if (raw.includes('TOO_MANY_REQUESTS')) setSent('Ya nos lo has pedido hoy: te escribimos enseguida.')
      else setAskError(vecinoPanelErrorText(raw, true) ?? 'No se ha podido enviar. Inténtalo de nuevo.')
    } finally {
      setAsking(false)
    }
  }

  const agotado = quota?.left === 0
  const estimate = lostSalesEstimate(demand, avgTicket(category, config.avgTicket))
  const founder = isFounder()
  const fee = founder ? PLAN_FEES.bronze.founderFee : PLAN_FEES.bronze.standardFee

  return (
    <>
      {/* 1. Demanda perdida */}
      {(agotado || hasLostDemand(demand)) && (
        <Card style={{ background: '#FFF3EE', border: '1px solid rgba(255,78,0,.25)' }}>
          <H2>{agotado ? 'Tu canje de la semana está agotado' : 'Gente que se quedó sin tu premio'}</H2>
          {demand && hasLostDemand(demand) && (
            <p style={{ margin: 0, fontSize: 14.5, color: C.ink, lineHeight: 1.5 }}>
              En los últimos {demand.days} días, {n(demand.nearbyQualified)} conductores con puntos aparcaron cerca y {n(demand.quotaBlocked)} intentaron canjear tu premio.
            </p>
          )}
          {estimate !== null && (
            <p style={{ margin: '6px 0 0', fontSize: 13, color: C.sub }}>
              Estimación de ventas no captadas: unos {n(estimate)} € (ticket medio de {CATEGORY_LABEL[category] ?? 'tu categoría'}). Es una estimación, no una cifra real.
            </p>
          )}
          {agotado && <p style={{ margin: '6px 0 0', fontSize: 13, fontWeight: 800, color: C.sub }}>Vuelve el lunes.</p>}
        </Card>
      )}

      {/* 2. Canjes de la semana */}
      {quota && (
        <Card>
          <div style={grid(170)}>
            <Stat
              label="Canjes esta semana"
              value={quota.cap === null ? n(quota.used) : `${n(quota.used)} / ${n(quota.cap)}`}
              sub={quota.bonus > 0 ? `Incluye +${quota.bonus} de bonus` : 'Plan Vecino: 1 por semana, +1 con el cartel'}
            />
            <Stat label="Tu premio" value={`${rules.maxPoints} pts`} sub={`Como mucho. Descuento mínimo del ${rules.minDiscountPct} %. Vale de 24 h.`} />
          </div>
        </Card>
      )}

      {/* 3. El premio que no cabe en Vecino */}
      {fixMsg && <Notice kind={fixMsg.ok ? 'ok' : 'error'}>{fixMsg.text}</Notice>}
      {paused.map((p) => {
        const f = p.pausedByReports ? null : freePrizeFix(p, rules)
        if (!p.pausedByReports && !f) return null
        const changes = f
          ? [
              f.patch.prize_type ? 'producto gratis' : null,
              f.patch.discount_pct ? `descuento del ${f.patch.discount_pct} %` : null,
              f.patch.points_cost ? `${f.patch.points_cost} puntos` : null,
            ].filter(Boolean).join(' · ')
          : ''
        return (
          <Card key={p.id} style={{ background: '#FFF8E8', border: '1px solid rgba(154,91,0,.25)' }}>
            <H2>Tu premio «{p.title}» está pausado</H2>
            {p.pausedByReports ? (
              <p style={{ margin: 0, fontSize: 14, color: '#7A4A00' }}>Pausado porque varios conductores dicen que no se lo dieron. Lo revisamos nosotros y te escribimos.</p>
            ) : (
              <>
                <p style={{ margin: 0, fontSize: 14, color: '#7A4A00' }}>
                  En el plan Vecino el premio es un producto, un servicio, un 2x1 o un descuento de al menos el {rules.minDiscountPct} %, y cuesta como mucho {rules.maxPoints} puntos.
                </p>
                {changes && <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 800, color: '#7A4A00' }}>Lo dejamos así: {changes}</p>}
                <div style={{ marginTop: 12 }}>
                  <Button onClick={() => fix(p)} disabled={!!fixing}>{fixing === p.id ? 'Publicando…' : 'Ajustar y publicar'}</Button>
                </div>
              </>
            )}
          </Card>
        )
      })}

      {/* 4. El cartel e invitar a otro comercio */}
      {freemiumOn && <PosterCard sponsorId={sponsorId} verifyUrl={config.verifyUrl} />}
      <InviteCard sponsorId={sponsorId} createdAt={createdAt} windowDays={config.inviteWindowDays} />

      {/* 5. Subir de plan: en la web, con precio */}
      <Card style={{ background: C.ink, border: `1px solid ${C.ink}` }}>
        <h2 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 19, color: '#fff', margin: '0 0 8px' }}>No dejes a nadie sin su premio</h2>
        {sent ? (
          <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: '#9FD9BE' }}>✓ {sent}</p>
        ) : (
          <>
            <p style={{ margin: '0 0 12px', fontSize: 14.5, color: '#C9DCE1', lineHeight: 1.5 }}>
              Bronce: {bronze ? `${bronze.prizes} premios y hasta ${bronze.redemptionsWeek} canjes por semana` : 'más premios y más canjes por semana'}.{' '}
              <strong style={{ color: '#fff' }}>{fee} €/mes + IVA</strong>
              {founder ? ` (precio fundador los 12 primeros meses de pago; después ${PLAN_FEES.bronze.standardFee} €)` : ''}. Sin permanencia.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button onClick={ask} disabled={asking}>{asking ? 'Enviando…' : 'Pasar a Bronce'}</Button>
              <Link href="/panel/plan" style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>Ver todos los paquetes →</Link>
            </div>
            <p style={{ margin: '10px 0 0', fontSize: 12.5, color: '#9DB4BB' }}>Te mandamos el enlace para darte de alta con la tarjeta por WhatsApp o correo. Si no sigues, te quedas en Vecino.</p>
            {askError && <div style={{ marginTop: 10 }}><Notice kind="error">{askError}</Notice></div>}
          </>
        )}
      </Card>
    </>
  )
}
