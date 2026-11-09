'use client'
import { useEffect, useState } from 'react'
import { usePanel } from './PanelShell'
import { chooseTier, fetchTierUsage, type Tier, type TierUsageRow } from '@/lib/panel/data'
import { trialState } from '@/lib/panel/trialStatus'
import { errorMessage, longDate, TIER_NAMES } from '@/lib/panel/text'
import { PLAN_FEES } from '@/lib/plans'
import { TRANS } from '@/lib/i18n'
import { Button, C, Card, grid, H2, Notice } from './ui'

/**
 * El plan del comercio: qué tiene, qué incluye cada paquete (con precios: esto es la
 * web, no la app, así que no aplica la norma de las tiendas) y cómo cambiarlo.
 *
 * - En la prueba y sin tarjeta: elige paquete (choose_sponsor_tier); el bot le manda
 *   su enlace de alta.
 * - Con suscripción: facturas, tarjeta y baja en el portal de clientes de Stripe
 *   (NEXT_PUBLIC_STRIPE_PORTAL_URL). El cambio de paquete NO: cada paquete lleva su
 *   cupón de fundador y el portal lo arrastraría (ver el bot, trialReminderMessage.js),
 *   así que el portal no lo permite y lo cambia el equipo.
 */

const T = TRANS.es
const FEATURES: Record<Tier, string[]> = { bronze: T.spPlanFeatBronze, silver: T.spPlanFeatSilver, gold: T.spPlanFeatGold }
const ORDER: Tier[] = ['bronze', 'silver', 'gold']
const PORTAL = process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL

export default function PlanView() {
  const { sponsor, reload } = usePanel()
  const [usage, setUsage] = useState<TierUsageRow | null>(null)
  const [busy, setBusy] = useState<Tier | null>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    void fetchTierUsage().then(setUsage)
  }, [])

  const trial = trialState(sponsor.status, sponsor.trialEndsAt, Date.now())
  const founder = !!sponsor.createdAt && new Date(sponsor.createdAt).getTime() < Date.UTC(2027, 0, 1)
  const canChoose = !sponsor.hasSubscription && (sponsor.status === 'trial' || sponsor.status === 'expired')

  const choose = async (t: Tier) => {
    setBusy(t)
    setMsg(null)
    try {
      await chooseTier(t)
      await reload()
      setMsg({ ok: true, text: `Apuntado: quieres el paquete ${TIER_NAMES[t]}. En unos minutos te llega por WhatsApp y correo el enlace para darte de alta con la tarjeta.` })
    } catch (err) {
      setMsg({ ok: false, text: errorMessage(err, 'No se ha podido guardar tu elección.') })
    } finally {
      setBusy(null)
    }
  }

  const statusText =
    trial.kind === 'counting' ? `Mes de prueba: quedan ${trial.daysLeft} ${trial.daysLeft === 1 ? 'día' : 'días'} (hasta el ${longDate(sponsor.trialEndsAt)}).`
    : trial.kind === 'ended' ? 'Tu prueba ha terminado.'
    : trial.kind === 'open' ? 'Estás en la prueba.'
    : sponsor.status === 'active' ? 'Activo.'
    : sponsor.status === 'suspended' ? 'En pausa: hay un cobro pendiente o la cuenta está suspendida.'
    : 'Sin plan activo.'

  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem,3.5vw,2rem)', color: C.ink, margin: 0 }}>Tu plan</h1>

      <Card>
        <div style={grid(220)}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: C.muted }}>PAQUETE</div>
            <div style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 26, color: C.ink }}>{TIER_NAMES[sponsor.tier]}</div>
            {sponsor.chosenTier && sponsor.chosenTier !== sponsor.tier && (
              <div style={{ fontSize: 13.5, color: C.sub }}>Has pedido {TIER_NAMES[sponsor.chosenTier]}: se aplica con el alta o el siguiente cobro.</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: C.muted }}>ESTADO</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginTop: 6 }}>{statusText}</div>
            {usage && (
              <div style={{ fontSize: 13.5, color: C.sub, marginTop: 4 }}>
                {usage.locationsUsed} {usage.locationsUsed === 1 ? 'local' : 'locales'}{usage.locationsLimit ? ` de ${usage.locationsLimit}` : ''} ·{' '}
                {usage.prizesUsed} {usage.prizesUsed === 1 ? 'premio activo' : 'premios activos'}{usage.prizesLimit ? ` de ${usage.prizesLimit}` : ''}
              </div>
            )}
          </div>
        </div>
        {sponsor.hasSubscription && (
          <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {PORTAL ? (
              <a href={PORTAL} target="_blank" rel="noopener noreferrer" style={{ background: C.coral, color: '#fff', fontWeight: 800, fontSize: 14, padding: '10px 16px', borderRadius: 12, textDecoration: 'none' }}>
                Facturas, tarjeta o baja
              </a>
            ) : null}
            <span style={{ fontSize: 13.5, color: C.sub }}>
              {PORTAL ? 'Se abre el portal seguro de Stripe: entra con el correo de tu alta.' : 'Para facturas, tarjeta o baja, usa el enlace de los correos de Stripe.'}{' '}
              Para cambiar de paquete, escríbenos a hola@appark.es o contesta al WhatsApp de Appark y lo cambiamos nosotros.
            </span>
          </div>
        )}
      </Card>

      {msg && <Notice kind={msg.ok ? 'ok' : 'error'}>{msg.text}</Notice>}

      <Card>
        <H2>Paquetes</H2>
        <div style={grid(230)}>
          {ORDER.map((t) => {
            const fee = PLAN_FEES[t]
            const mine = t === sponsor.tier
            return (
              <div key={t} style={{ border: `${mine ? 2 : 1}px solid ${mine ? C.coral : C.line}`, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 20, color: C.ink }}>
                  {TIER_NAMES[t]} {mine && <span style={{ fontSize: 12, color: C.coral }}>· el tuyo</span>}
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 26, color: C.ink }}>{founder ? fee.founderFee : fee.standardFee} €</span>
                  <span style={{ fontSize: 13, color: C.sub }}> / mes + IVA</span>
                  {founder && <div style={{ fontSize: 12.5, color: C.muted }}><s>{fee.standardFee} €</s> · precio fundador los 12 primeros meses de pago</div>}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 4, flex: 1 }}>
                  {FEATURES[t].map((x) => (
                    <li key={x} style={{ fontSize: 13.5, color: C.sub, display: 'flex', gap: 6 }}><span style={{ color: '#1B8A5A', fontWeight: 800 }}>✓</span>{x}</li>
                  ))}
                </ul>
                {canChoose && !mine && (
                  <Button kind={sponsor.chosenTier === t ? 'primary' : 'ghost'} onClick={() => choose(t)} disabled={busy !== null}>
                    {busy === t ? 'Guardando…' : sponsor.chosenTier === t ? 'Elegido' : `Quiero ${TIER_NAMES[t]}`}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
        <p style={{ margin: '12px 0 0', fontSize: 12.5, color: C.muted }}>{T.spPlanFounderTerms}</p>
      </Card>
    </>
  )
}
