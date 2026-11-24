'use client'
import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { panelDb } from '@/lib/panel/supabase'
import { fetchSponsor, savePrize } from '@/lib/panel/data'
import { ALTA_TEXT } from '@/lib/altaI18n'
import { CATEGORIES, CODE_STORAGE_KEY, CODE_TTL_MS, cleanCode, type Category } from '@/lib/alta'
import { DEFAULT_FREE_RULES, freeViolations, isSponsorInviteCode, splitAltaCode, vecinoErrorText, type FreePrizeRules } from '@/lib/panel/vecino'
import { acceptSponsorInvite, claimSponsorFree, fetchCatalog, fetchFreemiumOn } from '@/lib/panel/vecinoApi'
import { Button, C, Card, H2, hintStyle, inputStyle, labelStyle, Notice } from '@/components/panel/ui'

const LocationPicker = dynamic(() => import('@/components/panel/LocationPicker'), { ssr: false })

type Kind = 'product' | 'service' | '2x1' | 'discount'
const KIND_LABEL: Record<Kind, (pct: number) => string> = {
  product: () => 'Producto gratis',
  service: () => 'Servicio gratis',
  '2x1': () => '2x1',
  discount: (pct) => `Descuento ≥${pct} %`,
}
/** Existencias del premio que se crea en el alta: las mismas que en la app. */
const ALTA_QUANTITY = 25
/** El borrador del formulario sobrevive al enlace del correo (vuelve a esta página). */
const DRAFT_KEY = 'appark_vecino_alta_draft'

type Gate =
  | { kind: 'checking' }
  /** El servidor admite el alta gratis para quien está (o para todos, sin sesión). */
  | { kind: 'open'; email: string | null }
  /** Cerrada: sin sesión, se puede entrar con una cuenta de Appark por si es probadora. */
  | { kind: 'closed'; email: string | null }
  /** Esa cuenta ya es un comercio. */
  | { kind: 'sponsor' }

interface Draft {
  empresa: string
  category: Category | ''
  address: string
  point: { lat: number; lng: number } | null
  code: string
  kind: Kind
  what: string
  pct: string
  points: number
  phone: string
  contact: string
}

const EMPTY_DRAFT: Draft = { empresa: '', category: '', address: '', point: null, code: '', kind: 'product', what: '', pct: '', points: 40, phone: '', contact: '' }

/**
 * appark.es/alta?plan=gratis — el alta del plan Vecino, sin tarjeta
 * (§2.5 de docs/MODELO-FREEMIUM.md, claim_sponsor_free de la 0124). Los tres
 * pasos de la app (VecinoAlta.tsx): negocio, premio y entrar.
 *
 * EL INTERRUPTOR. claim_sponsor_free decide por auth.uid() (FREEMIUM_SIGNUP_OFF):
 * un comercio nuevo aún no tiene uuid en la lista de flags.freemium_sponsors.
 * Por eso, aquí:
 *   - Sin sesión, my_flag solo da true con `all: true`. Entonces se abre a todos
 *     y el último paso crea la cuenta con un código al correo.
 *   - Si no, la página dice que el alta gratis aún no está abierta y deja entrar
 *     con una cuenta de Appark que YA exista (shouldCreateUser: false): así no se
 *     crean usuarios vacíos, y una cuenta probadora (su uuid en `users`) sigue.
 *   - Con una cuenta que no está en la lista, se queda en «aún no está abierta».
 *
 * El enlace del comercial (?c=CODIGO, recordado 30 días como en /alta) va a
 * claim_sponsor_free, que atribuye la ficha a su dueño en bo. Un código de otro
 * comercio ('V…') se canjea después con sponsor_accept_invite.
 */
export default function VecinoAltaFlow() {
  const params = useSearchParams()
  const t = ALTA_TEXT.es
  const [gate, setGate] = useState<Gate>({ kind: 'checking' })
  const [rules, setRules] = useState<FreePrizeRules>(DEFAULT_FREE_RULES)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [d, setD] = useState<Draft>(EMPTY_DRAFT)
  const [pinKey, setPinKey] = useState(0)
  const [locating, setLocating] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [accept, setAccept] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<{ prizeFailed: boolean; inviteNote: string | null } | null>(null)

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }))

  /** Quién está y si el alta gratis está abierta para él. */
  const check = useCallback(async () => {
    try {
      const db = panelDb()
      const { data } = await db.auth.getSession()
      const user = data.session?.user ?? null
      if (user && (await fetchSponsor(user.id))) return setGate({ kind: 'sponsor' })
      const on = await fetchFreemiumOn()
      setGate(on ? { kind: 'open', email: user?.email ?? null } : { kind: 'closed', email: user?.email ?? null })
      if (user?.email) setEmail(user.email)
    } catch {
      setGate({ kind: 'closed', email: null })
    }
  }, [])

  useEffect(() => {
    // El código del comercial: de la URL o el recordado hace menos de 30 días (como /alta).
    const fromUrl = (params.get('c') ?? '').trim().toUpperCase()
    let code = cleanCode(fromUrl) ?? (isSponsorInviteCode(fromUrl) ? fromUrl : null)
    try {
      if (cleanCode(fromUrl)) localStorage.setItem(CODE_STORAGE_KEY, JSON.stringify({ c: cleanCode(fromUrl), at: Date.now() }))
      else if (!code) {
        const saved = JSON.parse(localStorage.getItem(CODE_STORAGE_KEY) || 'null') as { c?: string; at?: number } | null
        if (saved?.c && saved.at && Date.now() - saved.at < CODE_TTL_MS) code = cleanCode(saved.c)
      }
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null') as Draft | null
      if (draft && typeof draft.empresa === 'string') {
        setD({ ...EMPTY_DRAFT, ...draft })
        if (draft.empresa && draft.point) setStep(3)
      } else if (code) {
        const c = code
        setD((x) => ({ ...x, code: c }))
      }
    } catch {
      if (code) setD((x) => ({ ...x, code: code as string }))
    }
    // Un clic por visita para el embudo del comercial, igual que /alta.
    if (cleanCode(fromUrl)) {
      try {
        if (!sessionStorage.getItem('appark_alta_click')) {
          sessionStorage.setItem('appark_alta_click', '1')
          fetch('/api/alta/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: cleanCode(fromUrl) }), keepalive: true }).catch(() => {})
        }
      } catch {}
    }
    void check()
    void fetchCatalog().then((c) => {
      setRules(c.rules)
      setD((x) => ({ ...x, points: Math.min(x.points, c.rules.maxPoints > 0 ? c.rules.maxPoints : x.points) }))
    })
    let unsubscribe = () => {}
    try {
      const { data } = panelDb().auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') void check()
      })
      unsubscribe = () => data.subscription.unsubscribe()
    } catch {}
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveDraft = (x: Draft) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(x))
    } catch {}
  }

  const useGps = () => {
    if (!navigator.geolocation) return setError('Tu navegador no da la ubicación. Marca la puerta en el mapa.')
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set('point', { lat: pos.coords.latitude, lng: pos.coords.longitude })
        setPinKey((k) => k + 1)
        setLocating(false)
      },
      () => {
        setError('No hemos podido situarte. Busca la dirección o marca la puerta en el mapa.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    )
  }

  const discount = d.kind === 'discount' ? parseInt(d.pct, 10) || 0 : null
  const prizeProblems = d.what.trim() ? freeViolations({ prize_type: d.kind, discount_pct: discount, points_cost: d.points }, rules) : []

  const next = () => {
    setError('')
    if (step === 1) {
      if (d.empresa.trim().length < 2) return setError('Escribe el nombre de tu negocio.')
      if (!d.point) return setError('Marca en el mapa dónde está tu puerta.')
      saveDraft(d)
      setStep(2)
    } else if (step === 2) {
      if (prizeProblems.includes('discount')) return setError(`En el plan Vecino el descuento es de al menos el ${rules.minDiscountPct} %.`)
      saveDraft(d)
      setStep(3)
    }
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {}
  }

  /** Código al correo. Con el alta abierta a todos crea la cuenta; cerrada, solo entra en una que exista. */
  const sendCode = async (createUser: boolean) => {
    setError('')
    const clean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return setError('Revisa el correo: no parece válido.')
    setBusy(true)
    saveDraft(d)
    const { error: err } = await panelDb().auth.signInWithOtp({
      email: clean,
      options: { shouldCreateUser: createUser, emailRedirectTo: `${window.location.origin}/alta?plan=gratis` },
    })
    setBusy(false)
    if (err && /rate|limit|security purposes/i.test(err.message)) return setError('Has pedido varios códigos seguidos. Espera un minuto y vuelve a probar.')
    if (err && createUser) return setError('No hemos podido enviarte el código. Inténtalo de nuevo en un momento.')
    setEmail(clean)
    setOtpSent(true)
  }

  const verifyCode = async (): Promise<boolean> => {
    const token = otp.replace(/\D/g, '')
    if (token.length < 6) {
      setError('El código tiene 6 cifras.')
      return false
    }
    const { error: err } = await panelDb().auth.verifyOtp({ email, token, type: 'email' })
    if (err) {
      setError('El código no es correcto o ha caducado. Pide otro.')
      return false
    }
    return true
  }

  const publish = async () => {
    setError('')
    if (!accept) return setError('Para seguir, acepta las condiciones.')
    if (!d.point) return setError('Marca en el mapa dónde está tu puerta.')
    setBusy(true)
    try {
      const db = panelDb()
      let session = (await db.auth.getSession()).data.session
      if (!session) {
        if (!(await verifyCode())) return
        session = (await db.auth.getSession()).data.session
        if (!session) return setError('No hemos podido abrir tu sesión. Pide otro código.')
      }
      const { seller, invite } = splitAltaCode(d.code)
      try {
        await claimSponsorFree({
          empresa: d.empresa.trim().slice(0, 150),
          category: d.category || null,
          address: d.address.trim() || null,
          telefono: d.phone.trim() || null,
          contactPerson: d.contact.trim() || null,
          email: session.user.email ?? email,
          lat: d.point.lat,
          lng: d.point.lng,
          code: seller,
        })
      } catch (err) {
        const raw = String((err as { message?: unknown } | null)?.message ?? '')
        // Ya era comercio: a su panel.
        if (raw.includes('ALREADY_A_SPONSOR') && !raw.includes('CONTACT_ALREADY_A_SPONSOR')) {
          setGate({ kind: 'sponsor' })
          return
        }
        if (raw.includes('FREEMIUM_SIGNUP_OFF')) setGate({ kind: 'closed', email: session.user.email ?? null })
        setError(vecinoErrorText(raw) ?? 'No se ha podido dar de alta tu negocio. Inténtalo de nuevo.')
        return
      }

      let inviteNote: string | null = null
      if (invite) {
        try {
          await acceptSponsorInvite(invite)
          inviteNote = 'Código de invitación guardado: cuando tengas tu primer canje, los dos tenéis 15 días de Plata.'
        } catch (err) {
          inviteNote = vecinoErrorText(String((err as { message?: unknown } | null)?.message ?? '')) ?? 'El código de invitación no se ha podido guardar. Ponlo desde tu panel.'
        }
      }

      let prizeFailed = false
      if (d.what.trim() && prizeProblems.length === 0) {
        try {
          await savePrize(session.user.id, {
            id: null,
            title: d.what.trim().slice(0, 80),
            description: '',
            prize_type: d.kind,
            points_cost: d.points,
            quantity_total: ALTA_QUANTITY,
            discount_pct: discount,
            image_url: null,
            validity_days: null,
          })
        } catch {
          prizeFailed = true
        }
      }
      try {
        localStorage.removeItem(DRAFT_KEY)
      } catch {}
      setDone({ prizeFailed, inviteNote })
      try {
        window.gtag?.('event', 'alta_vecino_done', { has_code: !!seller, has_invite: !!invite })
      } catch {}
    } finally {
      setBusy(false)
    }
  }

  // ── Pantallas ──────────────────────────────────────────────
  const shell = (children: React.ReactNode) => (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'grid', gap: 16 }}>
      <div style={{ textAlign: 'center', margin: '8px auto 6px' }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#FF6A3D', marginBottom: 12 }}>Plan Vecino · gratis</div>
        <h1 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 'clamp(1.9rem,4.5vw,2.6rem)', lineHeight: 1.08, letterSpacing: '-1px', color: C.ink, margin: '0 0 12px' }}>
          Anuncia tu negocio gratis
        </h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.6, color: C.sub, margin: 0 }}>
          Sin tarjeta y sin fecha de fin. Sales en el mapa de los conductores de Palma y ofreces un premio a la semana.
        </p>
      </div>
      {children}
    </div>
  )

  if (gate.kind === 'checking') return shell(<p style={{ textAlign: 'center', color: C.muted }} aria-busy="true">Cargando…</p>)

  if (gate.kind === 'sponsor') {
    return shell(
      <Card>
        <H2>Tu cuenta ya tiene un negocio en Appark</H2>
        <p style={{ margin: '0 0 14px', color: C.sub }}>Gestiona tus premios, tu cartel y tus resultados desde tu panel.</p>
        <Link href="/panel/inicio" style={{ display: 'inline-block', background: C.coral, color: '#fff', fontWeight: 800, padding: '11px 18px', borderRadius: 12, textDecoration: 'none' }}>
          Ir a mi panel
        </Link>
      </Card>,
    )
  }

  if (done) {
    return shell(
      <Card>
        <H2>¡Ya estás en el mapa! 💚</H2>
        <p style={{ margin: '0 0 12px', color: C.sub, lineHeight: 1.55 }}>
          Tu negocio está dado de alta en el plan Vecino. Desde tu panel puedes subir tu logo, poner el cartel «Punto de canje» (ganas 1 canje más por semana) y ver cuántos te ven.
        </p>
        {done.prizeFailed && <div style={{ marginBottom: 10 }}><Notice kind="warn">Tu negocio ya está dado de alta, pero el premio no se ha guardado. Créalo desde Premios.</Notice></div>}
        {done.inviteNote && <div style={{ marginBottom: 10 }}><Notice kind="info">{done.inviteNote}</Notice></div>}
        <Link href="/panel/inicio" style={{ display: 'inline-block', background: C.coral, color: '#fff', fontWeight: 800, padding: '11px 18px', borderRadius: 12, textDecoration: 'none' }}>
          Ir a mi panel
        </Link>
      </Card>,
    )
  }

  if (gate.kind === 'closed') {
    return shell(
      <Card>
        <H2>El alta gratis aún no está abierta</H2>
        {gate.email ? (
          <p style={{ margin: '0 0 14px', color: C.sub, lineHeight: 1.55 }}>
            La estamos abriendo poco a poco y aún no está disponible para {gate.email}. Mientras tanto puedes darte de alta con el primer mes gratis.
          </p>
        ) : (
          <>
            <p style={{ margin: '0 0 14px', color: C.sub, lineHeight: 1.55 }}>
              La estamos abriendo poco a poco. Si te hemos invitado a probarla, entra con tu cuenta de Appark (el mismo correo que en la app).
            </p>
            {!otpSent ? (
              <form onSubmit={(e) => { e.preventDefault(); void sendCode(false) }} style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
                <label htmlFor="vc-email0" style={labelStyle}>Tu correo de Appark</label>
                <input id="vc-email0" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                <Button type="submit" disabled={busy}>{busy ? 'Enviando…' : 'Enviarme el código'}</Button>
              </form>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError('')
                  setBusy(true)
                  if (await verifyCode()) await check()
                  setBusy(false)
                }}
                style={{ display: 'grid', gap: 10, marginBottom: 14 }}
              >
                <Notice kind="info">Si {email} tiene cuenta en Appark, te acaba de llegar un código. Mira también en spam.</Notice>
                <label htmlFor="vc-otp0" style={labelStyle}>Código de 6 cifras</label>
                <input id="vc-otp0" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={otp} onChange={(e) => setOtp(e.target.value)} style={{ ...inputStyle, fontSize: 22, letterSpacing: 6, textAlign: 'center' }} />
                <Button type="submit" disabled={busy}>{busy ? 'Comprobando…' : 'Entrar'}</Button>
              </form>
            )}
          </>
        )}
        {error && <div style={{ marginBottom: 12 }}><Notice kind="error">{error}</Notice></div>}
        <Link href={`/alta${d.code && cleanCode(d.code) ? `?c=${cleanCode(d.code)}` : ''}`} style={{ color: C.sea, fontWeight: 800 }}>
          Darme de alta con el primer mes gratis →
        </Link>
      </Card>,
    )
  }

  // gate.kind === 'open'
  const stepLabels = ['1 · Negocio', '2 · Premio', '3 · Entrar']
  return shell(
    <>
      <ol aria-label="Pasos" style={{ listStyle: 'none', display: 'flex', gap: 8, padding: 0, margin: 0 }}>
        {stepLabels.map((label, i) => (
          <li key={label} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: 5, borderRadius: 99, background: step >= i + 1 ? '#FF6A3D' : 'rgba(10,42,54,.10)', marginBottom: 6 }} />
            <span style={{ fontSize: 12.5, fontWeight: 800, color: step === i + 1 ? C.ink : C.muted }} aria-current={step === i + 1 ? 'step' : undefined}>{label}</span>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <Card>
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label htmlFor="vc-name" style={labelStyle}>Nombre del negocio</label>
              <input id="vc-name" value={d.empresa} maxLength={150} autoComplete="organization" onChange={(e) => set('empresa', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="vc-cat" style={labelStyle}>Categoría</label>
              <select id="vc-cat" value={d.category} onChange={(e) => set('category', e.target.value as Category)} style={inputStyle}>
                <option value="">{t.tipoSelect}</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{t.categories[c]}</option>)}
              </select>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                <span style={{ ...labelStyle, marginBottom: 0 }}>Dónde está tu puerta</span>
                <Button kind="ghost" onClick={useGps} disabled={locating} style={{ padding: '6px 12px' }}>{locating ? 'Buscando…' : 'Usar mi ubicación'}</Button>
              </div>
              <LocationPicker key={pinKey} address={d.address} onAddress={(v) => set('address', v)} point={d.point} onPoint={(p) => set('point', p)} />
              {d.point && <div style={{ ...hintStyle, color: '#1B8A5A', fontWeight: 700 }}>Ubicación guardada ✓</div>}
            </div>
            <div>
              <label htmlFor="vc-code" style={labelStyle}>Código de quien te visitó (opcional)</label>
              <input id="vc-code" value={d.code} maxLength={14} autoComplete="off" onChange={(e) => set('code', e.target.value.toUpperCase().replace(/\s+/g, ''))} style={{ ...inputStyle, letterSpacing: 2 }} />
              <div style={hintStyle}>El de tu comercial, o el de otro comercio que te invitó (empieza por V).</div>
            </div>
          </div>
          {error && <div style={{ marginTop: 12 }}><Notice kind="error">{error}</Notice></div>}
          <div style={{ marginTop: 18 }}><Button onClick={next} style={{ width: '100%', padding: '14px 16px', fontSize: 16 }}>Seguir</Button></div>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <H2>Elige un premio que de verdad apetezca</H2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }} role="radiogroup" aria-label="Tipo de premio">
            {(['product', 'service', '2x1', 'discount'] as Kind[]).filter((k) => rules.types.includes(k)).map((k) => (
              <Button key={k} kind={d.kind === k ? 'primary' : 'ghost'} onClick={() => set('kind', k)} style={{ padding: '8px 12px' }}>
                {KIND_LABEL[k](rules.minDiscountPct)}
              </Button>
            ))}
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label htmlFor="vc-what" style={labelStyle}>Qué das</label>
              <input id="vc-what" value={d.what} maxLength={80} placeholder="Café + croissant gratis" onChange={(e) => set('what', e.target.value)} style={inputStyle} />
            </div>
            {d.kind === 'discount' && (
              <div>
                <label htmlFor="vc-pct" style={labelStyle}>Descuento (mínimo {rules.minDiscountPct} %)</label>
                <input id="vc-pct" type="number" min={rules.minDiscountPct} max={100} value={d.pct} onChange={(e) => set('pct', e.target.value)} style={inputStyle} />
              </div>
            )}
            <div>
              <label htmlFor="vc-pts" style={labelStyle}>Puntos que cuesta: {d.points} (máximo {rules.maxPoints})</label>
              <input id="vc-pts" type="range" min={10} max={Math.max(10, rules.maxPoints)} step={5} value={d.points} onChange={(e) => set('points', Number(e.target.value))} style={{ width: '100%', accentColor: C.coral }} />
            </div>
            <Notice kind="info">Das 1 a la semana. Cada vale dura 24 h: si el conductor no viene, el cupo vuelve.</Notice>
          </div>
          {error && <div style={{ marginTop: 12 }}><Notice kind="error">{error}</Notice></div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <Button kind="ghost" onClick={() => { setError(''); setStep(1) }}>← Volver</Button>
            <Button kind="ghost" onClick={() => { setD((x) => ({ ...x, what: '' })); setError(''); saveDraft({ ...d, what: '' }); setStep(3) }}>Lo creo luego</Button>
            <Button onClick={next} style={{ flex: 1 }}>Seguir</Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <H2>Con el plan Vecino tienes</H2>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'grid', gap: 5 }}>
            {['1 local en el mapa y 1 premio', '1 canje a la semana, +1 si pones el cartel', 'Cuántos te ven y cuántos canjean'].map((x) => (
              <li key={x} style={{ fontSize: 14.5, color: C.sub, display: 'flex', gap: 8 }}><span style={{ color: '#1B8A5A', fontWeight: 800 }}>✓</span>{x}</li>
            ))}
          </ul>
          <div style={{ display: 'grid', gap: 14 }}>
            {gate.email ? (
              <Notice kind="info">Entras con tu cuenta de Appark: {gate.email}.</Notice>
            ) : (
              <div>
                <label htmlFor="vc-email" style={labelStyle}>Tu correo</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input id="vc-email" type="email" autoComplete="email" value={email} disabled={otpSent} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                  {!otpSent && <Button kind="ghost" onClick={() => sendCode(true)} disabled={busy}>{busy ? 'Enviando…' : 'Enviar código'}</Button>}
                </div>
                <div style={hintStyle}>Entras sin contraseña: te mandamos un código. Aquí te escribiremos sobre tu negocio. Si ya usas Appark, pon el mismo correo.</div>
                {otpSent && (
                  <div style={{ marginTop: 10 }}>
                    <label htmlFor="vc-otp" style={labelStyle}>Código de 6 cifras</label>
                    <input id="vc-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={otp} onChange={(e) => setOtp(e.target.value)} style={{ ...inputStyle, fontSize: 22, letterSpacing: 6, textAlign: 'center' }} />
                    <div style={hintStyle}>Mira también en spam. Si el correo trae un enlace, también vale: vuelves aquí con tus datos.</div>
                  </div>
                )}
              </div>
            )}
            <div>
              <label htmlFor="vc-contact" style={labelStyle}>Tu nombre (opcional)</label>
              <input id="vc-contact" value={d.contact} maxLength={120} autoComplete="name" onChange={(e) => set('contact', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="vc-phone" style={labelStyle}>Teléfono (opcional)</label>
              <input id="vc-phone" type="tel" inputMode="tel" value={d.phone} maxLength={40} autoComplete="tel" onChange={(e) => set('phone', e.target.value)} style={inputStyle} />
            </div>
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14.5, color: C.ink, fontWeight: 600, cursor: 'pointer' }}>
              <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} style={{ width: 20, height: 20, marginTop: 1, flex: 'none', accentColor: C.coral }} />
              <span>
                Acepto las <a href="/legal/patrocinio#vecino" target="_blank" rel="noopener" style={{ color: C.sea, fontWeight: 800 }}>condiciones del plan Vecino</a> y la{' '}
                <a href="/legal/privacidad" target="_blank" rel="noopener" style={{ color: C.sea, fontWeight: 800 }}>política de privacidad</a>.
              </span>
            </label>
          </div>
          {error && <div style={{ marginTop: 12 }}><Notice kind="error">{error}</Notice></div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <Button kind="ghost" onClick={() => { setError(''); setStep(2) }} disabled={busy}>← Volver</Button>
            <Button onClick={publish} disabled={busy || (!gate.email && !otpSent)} style={{ flex: 1, padding: '14px 16px', fontSize: 16 }}>
              {busy ? 'Publicando…' : 'Publicar gratis'}
            </Button>
          </div>
        </Card>
      )}
    </>,
  )
}
