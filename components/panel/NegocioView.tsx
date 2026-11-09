'use client'
import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePanel } from './PanelShell'
import ImageField from './ImageField'
import {
  fetchGoldBanner, fetchLocations, fetchTierUsage, saveGoldBanner, saveLocation, setLocationActive, updateProfile,
  type GoldBanner, type LocationRow, type ProfilePatch, type TierUsageRow,
} from '@/lib/panel/data'
import { DESCRIPTION_MAX, HOURS_MAX, normalizeInstagram, normalizePhone, normalizeWebsite } from '@/lib/panel/sponsorProfile'
import { CATEGORY_META, SPONSOR_CATEGORIES, normalizeCategory } from '@/lib/panel/categories'
import { isAtLimit, nextTier, usageLabel } from '@/lib/panel/tierUsage'
import { errorMessage, TIER_NAMES } from '@/lib/panel/text'
import { Button, C, Card, grid, H2, hintStyle, inputStyle, labelStyle, Notice } from './ui'

// El mapa solo en el navegador: Leaflet usa window.
const LocationPicker = dynamic(() => import('./LocationPicker'), { ssr: false })

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: 'Restauración', shop: 'Tienda', fitness: 'Deporte', beauty: 'Belleza', leisure: 'Ocio',
  services: 'Servicios', health: 'Salud', automotive: 'Motor', other: 'Otro',
}

export default function NegocioView() {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem,3.5vw,2rem)', color: C.ink, margin: 0 }}>Mi negocio</h1>
      <ProfileCard />
      <LocationsCard />
      <BannerCard />
      <PrivateCard />
    </>
  )
}

function ProfileCard() {
  const { sponsor, reload } = usePanel()
  const d = sponsor.details
  const [f, setF] = useState({
    name: sponsor.name,
    category: normalizeCategory(sponsor.category),
    description: d.description ?? '',
    opening_hours: d.openingHours ?? '',
    website: d.website ?? '',
    instagram: d.instagram ?? '',
    public_phone: d.publicPhone ?? '',
  })
  const [logo, setLogo] = useState(sponsor.logoUrl)
  const [cover, setCover] = useState(d.coverUrl)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })

  const saveImage = async (patch: ProfilePatch) => {
    try {
      await updateProfile(sponsor.id, patch)
      await reload()
    } catch (err) {
      setMsg({ ok: false, text: errorMessage(err) })
    }
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    const website = normalizeWebsite(f.website)
    const instagram = normalizeInstagram(f.instagram)
    const phone = normalizePhone(f.public_phone)
    if (!f.name.trim()) return setMsg({ ok: false, text: 'El nombre no puede quedar vacío.' })
    if (website === 'invalid') return setMsg({ ok: false, text: 'La web no parece una dirección válida.' })
    if (instagram === 'invalid') return setMsg({ ok: false, text: 'El Instagram no es válido: escribe solo tu usuario.' })
    if (phone === 'invalid') return setMsg({ ok: false, text: 'El teléfono no es válido.' })
    setBusy(true)
    try {
      await updateProfile(sponsor.id, {
        name: f.name.trim(),
        category: f.category,
        description: f.description.trim() || null,
        opening_hours: f.opening_hours.trim() || null,
        website,
        instagram,
        public_phone: phone,
      })
      await reload()
      setMsg({ ok: true, text: 'Guardado. Los conductores ya lo ven en tu ficha.' })
    } catch (err) {
      setMsg({ ok: false, text: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <H2>Tu ficha en la app</H2>
      <div style={{ ...grid(260), marginBottom: 16 }}>
        <ImageField sponsorId={sponsor.id} folder="logos" label="Logo" value={logo} onChange={(url) => { setLogo(url); void saveImage({ logo_url: url }) }} />
        <ImageField sponsorId={sponsor.id} folder="covers" label="Foto de portada" aspect="16 / 9" hint="Horizontal. La fachada o el interior funcionan muy bien." value={cover} onChange={(url) => { setCover(url); void saveImage({ cover_url: url }) }} />
      </div>
      <form onSubmit={save} style={{ display: 'grid', gap: 14 }}>
        <div style={grid(220)}>
          <div>
            <label htmlFor="b-name" style={labelStyle}>Nombre del comercio</label>
            <input id="b-name" maxLength={150} value={f.name} onChange={set('name')} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="b-cat" style={labelStyle}>Categoría</label>
            <select id="b-cat" value={f.category} onChange={set('category')} style={inputStyle}>
              {SPONSOR_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_META[c].emoji} {CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="b-desc" style={labelStyle}>Qué ofreces</label>
          <textarea id="b-desc" rows={3} maxLength={DESCRIPTION_MAX} value={f.description} onChange={set('description')} style={{ ...inputStyle, resize: 'vertical' }} />
          <div style={hintStyle}>{f.description.length}/{DESCRIPTION_MAX}</div>
        </div>
        <div>
          <label htmlFor="b-hours" style={labelStyle}>Horario</label>
          <input id="b-hours" maxLength={HOURS_MAX} value={f.opening_hours} onChange={set('opening_hours')} placeholder="L-V 8:00-20:00 · S 9:00-14:00" style={inputStyle} />
        </div>
        <div style={grid(200)}>
          <div>
            <label htmlFor="b-web" style={labelStyle}>Web</label>
            <input id="b-web" value={f.website} onChange={set('website')} placeholder="tunegocio.es" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="b-ig" style={labelStyle}>Instagram</label>
            <input id="b-ig" value={f.instagram} onChange={set('instagram')} placeholder="@tunegocio" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="b-tel" style={labelStyle}>Teléfono para clientes</label>
            <input id="b-tel" type="tel" value={f.public_phone} onChange={set('public_phone')} style={inputStyle} />
          </div>
        </div>
        {msg && <Notice kind={msg.ok ? 'ok' : 'error'}>{msg.text}</Notice>}
        <div><Button type="submit" disabled={busy}>{busy ? 'Guardando…' : 'Guardar ficha'}</Button></div>
      </form>
    </Card>
  )
}

interface LocForm { id: string | null; name: string; address: string; point: { lat: number; lng: number } | null }

function LocationsCard() {
  const { sponsor } = usePanel()
  const [rows, setRows] = useState<LocationRow[] | null>(null)
  const [usage, setUsage] = useState<TierUsageRow | null>(null)
  const [form, setForm] = useState<LocForm | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const load = useCallback(async () => {
    setRows(await fetchLocations(sponsor.id).catch(() => []))
    setUsage(await fetchTierUsage())
  }, [sponsor.id])

  useEffect(() => {
    void load()
  }, [load])

  const locUsage = usage ? { tier: sponsor.tier, used: usage.locationsUsed, limit: usage.locationsLimit } : null
  const next = nextTier(sponsor.tier)

  const save = async () => {
    if (!form) return
    setMsg(null)
    if (!form.name.trim()) return setMsg({ ok: false, text: 'Ponle un nombre al local.' })
    setBusy(true)
    try {
      await saveLocation(sponsor.id, { id: form.id, name: form.name.trim(), address: form.address.trim(), lat: form.point?.lat ?? null, lng: form.point?.lng ?? null })
      setForm(null)
      setMsg({ ok: true, text: 'Local guardado.' })
      await load()
    } catch (err) {
      setMsg({ ok: false, text: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  const toggle = async (l: LocationRow) => {
    setMsg(null)
    try {
      await setLocationActive(l.id, !l.active)
      await load()
    } catch (err) {
      setMsg({ ok: false, text: errorMessage(err) })
    }
  }

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: 1 }}><H2>Tus locales en el mapa</H2></div>
        {!form && <Button kind="ghost" onClick={() => { setForm({ id: null, name: sponsor.name, address: sponsor.details.address ?? '', point: null }); setMsg(null) }}>+ Añadir local</Button>}
      </div>
      {locUsage && locUsage.limit > 0 && (
        <p style={{ margin: '0 0 10px', fontSize: 13.5, color: isAtLimit(locUsage) ? '#9A5B00' : C.sub }}>
          Locales: {usageLabel(locUsage)} en tu paquete {TIER_NAMES[sponsor.tier]}.{isAtLimit(locUsage) && next ? ` Con ${TIER_NAMES[next]} puedes tener más.` : ''}
        </p>
      )}
      {msg && <div style={{ marginBottom: 10 }}><Notice kind={msg.ok ? 'ok' : 'error'}>{msg.text}</Notice></div>}

      {form && (
        <div style={{ display: 'grid', gap: 12, padding: 14, borderRadius: 14, background: C.sand, marginBottom: 12 }}>
          <div>
            <label htmlFor="l-name" style={labelStyle}>Nombre del local</label>
            <input id="l-name" maxLength={150} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          </div>
          <LocationPicker
            address={form.address}
            onAddress={(v) => setForm((f) => (f ? { ...f, address: v } : f))}
            point={form.point}
            onPoint={(p) => setForm((f) => (f ? { ...f, point: p } : f))}
          />
          {form.id && !form.point && <div style={hintStyle}>Si no tocas el mapa, el punto se queda donde estaba.</div>}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button onClick={save} disabled={busy || (!form.id && !form.point)}>{busy ? 'Guardando…' : 'Guardar local'}</Button>
            <Button kind="ghost" onClick={() => setForm(null)} disabled={busy}>Cancelar</Button>
          </div>
        </div>
      )}

      {rows === null ? (
        <p style={{ margin: 0, color: C.muted }}>Cargando…</p>
      ) : rows.length === 0 ? (
        <p style={{ margin: 0, color: C.sub, fontSize: 14 }}>Aún no tienes ningún local: sin él no sales en el mapa.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
          {rows.map((l) => (
            <li key={l.id} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', borderTop: `1px solid ${C.line}`, paddingTop: 8 }}>
              <span style={{ flex: '1 1 200px', minWidth: 0 }}>
                <strong style={{ color: C.ink }}>{l.name}</strong>
                <span style={{ display: 'block', fontSize: 13, color: C.sub }}>{l.address || 'Sin dirección'} · {l.active ? 'En el mapa' : 'Oculto'}</span>
              </span>
              <Button kind="ghost" onClick={() => { setForm({ id: l.id, name: l.name, address: l.address ?? '', point: null }); setMsg(null) }}>Editar</Button>
              <Button kind="ghost" onClick={() => toggle(l)}>{l.active ? 'Ocultar' : 'Mostrar'}</Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function BannerCard() {
  const { sponsor } = usePanel()
  const [banner, setBanner] = useState<GoldBanner | null>(null)
  const [img, setImg] = useState<string | null>(null)
  const [link, setLink] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const eligible = sponsor.tier === 'gold'
  const live = sponsor.status === 'active'

  useEffect(() => {
    if (!eligible || !live) return
    void fetchGoldBanner(sponsor.id).then((b) => {
      setBanner(b)
      setImg(b?.creativeUrl || null)
      setLink(b?.linkUrl ?? '')
    })
  }, [eligible, live, sponsor.id])

  if (!eligible) return null
  if (!live) {
    return (
      <Card>
        <H2>Tu banner en la app</H2>
        <p style={{ margin: 0, fontSize: 14.5, color: C.sub }}>El banner del paquete Oro se publica a partir del primer cobro.</p>
      </Card>
    )
  }

  const save = async (active: boolean) => {
    if (!img) return setMsg({ ok: false, text: 'Sube primero la imagen del banner.' })
    const url = link.trim() ? normalizeWebsite(link) : null
    if (url === 'invalid') return setMsg({ ok: false, text: 'El enlace no parece una dirección válida.' })
    setBusy(true)
    setMsg(null)
    try {
      const b = { creativeUrl: img, linkUrl: url, active }
      await saveGoldBanner(b)
      setBanner(b)
      setMsg({ ok: true, text: active ? 'Banner publicado.' : 'Banner en pausa.' })
    } catch (err) {
      setMsg({ ok: false, text: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <H2>Tu banner en la app</H2>
      <div style={{ display: 'grid', gap: 14 }}>
        <ImageField sponsorId={sponsor.id} folder="banners" label="Imagen" aspect="6 / 1" hint="Muy horizontal (unos 1200 × 200 px). Pocas palabras y bien grandes." value={img} onChange={setImg} />
        <div>
          <label htmlFor="bn-link" style={labelStyle}>Enlace al tocarlo (opcional)</label>
          <input id="bn-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="tunegocio.es/oferta" style={inputStyle} />
        </div>
        {msg && <Notice kind={msg.ok ? 'ok' : 'error'}>{msg.text}</Notice>}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button onClick={() => save(true)} disabled={busy}>{banner?.active ? 'Guardar cambios' : 'Publicar banner'}</Button>
          {banner?.active && <Button kind="ghost" onClick={() => save(false)} disabled={busy}>Pausar</Button>}
          <span style={{ fontSize: 13, color: C.sub }}>{banner ? (banner.active ? '● Publicado' : '○ En pausa') : 'Sin publicar'}</span>
        </div>
      </div>
    </Card>
  )
}

function PrivateCard() {
  const { sponsor, reload } = usePanel()
  const d = sponsor.details
  const [f, setF] = useState({ contact_person: d.contactPerson ?? '', contact_phone: d.contactPhone ?? '', contact_email: d.contactEmail ?? '' })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    const phone = normalizePhone(f.contact_phone)
    if (phone === 'invalid') return setMsg({ ok: false, text: 'El teléfono no es válido.' })
    const email = f.contact_email.trim().toLowerCase()
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMsg({ ok: false, text: 'El correo no es válido.' })
    setBusy(true)
    try {
      await updateProfile(sponsor.id, { contact_person: f.contact_person.trim() || null, contact_phone: phone, contact_email: email || null })
      await reload()
      setMsg({ ok: true, text: 'Guardado.' })
    } catch (err) {
      setMsg({ ok: false, text: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <H2>Datos de contacto (privados)</H2>
      <p style={{ margin: '0 0 12px', fontSize: 13.5, color: C.sub }}>Solo los ve el equipo de Appark, para avisos de tu cuenta. No salen en la app.</p>
      <form onSubmit={save} style={{ display: 'grid', gap: 14 }}>
        <div style={grid(200)}>
          <div>
            <label htmlFor="pc-name" style={labelStyle}>Persona de contacto</label>
            <input id="pc-name" maxLength={120} value={f.contact_person} onChange={set('contact_person')} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="pc-tel" style={labelStyle}>Teléfono</label>
            <input id="pc-tel" type="tel" value={f.contact_phone} onChange={set('contact_phone')} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="pc-mail" style={labelStyle}>Correo de contacto</label>
            <input id="pc-mail" type="email" value={f.contact_email} onChange={set('contact_email')} style={inputStyle} />
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: C.sub }}>
          CIF: <strong style={{ color: C.ink }}>{d.taxId || '—'}</strong> · Para cambiarlo, escríbenos a hola@appark.es.
          {d.hasPoster ? ' · ✓ Cartel «Punto de canje» validado.' : ''}
        </div>
        {msg && <Notice kind={msg.ok ? 'ok' : 'error'}>{msg.text}</Notice>}
        <div><Button type="submit" disabled={busy}>{busy ? 'Guardando…' : 'Guardar contacto'}</Button></div>
        <div style={hintStyle}>Para entrar al panel se usa siempre el correo con el que te diste de alta, aunque cambies este.</div>
      </form>
    </Card>
  )
}
