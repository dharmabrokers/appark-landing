'use client'
import { panelDb } from './supabase'
import { sniffedImageType } from './imageType'
import type { SponsorResults } from './sponsorResults'
import type { SponsorDetails } from './sponsorProfile'

/**
 * Lo que lee y escribe el panel web. Las mismas consultas que el panel de la app
 * (apps/mobile/src/screens/SponsorScreen.tsx y services/sponsorClient.ts), con la
 * sesión del comercio: la base decide qué puede ver y tocar.
 */

export type Tier = 'bronze' | 'silver' | 'gold'

export interface Sponsor {
  id: string
  name: string
  icon: string | null
  logoUrl: string | null
  category: string
  status: string
  tier: Tier
  chosenTier: Tier | null
  trialEndsAt: string | null
  createdAt: string | null
  hasSubscription: boolean
  details: SponsorDetails
}

const s = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null)
const asTier = (v: unknown): Tier | null => (v === 'bronze' || v === 'silver' || v === 'gold' ? v : null)

function fromRow(r: Record<string, unknown>, hasSubscription: boolean): Sponsor {
  return {
    id: String(r.id),
    name: s(r.name) ?? 'Comercio',
    icon: s(r.icon),
    logoUrl: s(r.logo_url),
    category: s(r.category) ?? 'other',
    status: s(r.status) ?? 'active',
    tier: asTier(r.tier) ?? 'bronze',
    chosenTier: asTier(r.chosen_tier),
    trialEndsAt: s(r.trial_ends_at),
    createdAt: s(r.created_at),
    hasSubscription,
    details: {
      description: s(r.description),
      openingHours: s(r.opening_hours),
      website: s(r.website),
      instagram: s(r.instagram),
      publicPhone: s(r.public_phone),
      coverUrl: s(r.cover_url),
      address: s(r.address),
      contactPerson: s(r.contact_person),
      contactPhone: s(r.contact_phone),
      contactEmail: s(r.contact_email),
      taxId: s(r.tax_id),
      hasPoster: !!r.poster_since,
    },
  }
}

/**
 * El comercio de la sesión, o null si ese usuario no es un comercio.
 * Con sponsor_me() (0113). Si la 0113 aún no está ejecutada, la consulta de antes.
 */
export async function fetchSponsor(userId: string): Promise<Sponsor | null> {
  const db = panelDb()
  const me = await db.rpc('sponsor_me')
  if (!me.error) {
    const row = me.data as Record<string, unknown> | null
    return row && row.id === userId ? fromRow(row, row.has_subscription === true) : null
  }
  const { data, error } = await db
    .from('sponsors')
    .select('id, name, icon, logo_url, category, status, tier, chosen_tier, trial_ends_at, created_at, stripe_subscription_id, description, opening_hours, website, instagram, public_phone, cover_url, address, contact_person, contact_phone, contact_email, tax_id, poster_since')
    .eq('id', userId)
    .maybeSingle()
  if (error || !data) return null
  const row = data as Record<string, unknown>
  return fromRow(row, !!row.stripe_subscription_id)
}

// ---------------------------------------------------------------------------
// Inicio y resultados
// ---------------------------------------------------------------------------
export interface Kpis {
  vouchers_issued: number
  vouchers_redeemed: number
  vouchers_active: number
  unique_customers: number
  points_captured: number
  active_prizes: number
}

export interface Voucher {
  reward_id: string
  code: string
  prize_title: string
  status: string
  acquired_at: string
  redeemed_at: string | null
}

export interface OfferStat {
  prize_id: string
  prize_title: string
  shown: number
  wanted: number
  dismissed: number
  redeemed: number
}

export interface AudienceStats {
  radius_m: number
  sample_size: number
  by_language: { language: string; count: number }[]
  by_hour: { hour: number; count: number }[]
}

const titleOf = (t: unknown): string => {
  if (t && typeof t === 'object') {
    const o = t as Record<string, unknown>
    return s(o.es) ?? s(o.en) ?? s(Object.values(o)[0]) ?? 'Premio'
  }
  return s(t) ?? 'Premio'
}

export async function fetchKpis(): Promise<Kpis | null> {
  const { data, error } = await panelDb().rpc('sponsor_kpis')
  return error ? null : (data as Kpis)
}

export async function fetchResults(days: number): Promise<SponsorResults | null> {
  const { data, error } = await panelDb().rpc('sponsor_results', { p_days: days })
  return error ? null : (data as SponsorResults)
}

export async function fetchVouchers(limit: number): Promise<Voucher[]> {
  const { data, error } = await panelDb().rpc('sponsor_voucher_history', { p_limit: limit })
  if (error || !Array.isArray(data)) return []
  return data.map((d: Record<string, unknown>) => ({
    reward_id: String(d.reward_id),
    code: String(d.code ?? ''),
    prize_title: titleOf(d.prize_title),
    status: String(d.status ?? ''),
    acquired_at: String(d.acquired_at ?? ''),
    redeemed_at: s(d.redeemed_at),
  }))
}

export async function fetchOfferStats(): Promise<OfferStat[] | null> {
  const { data, error } = await panelDb().rpc('sponsor_offer_stats')
  if (error || !Array.isArray(data)) return null
  return data.map((d: Record<string, unknown>) => ({
    prize_id: String(d.prize_id),
    prize_title: titleOf(d.prize_title),
    shown: Number(d.shown ?? 0),
    wanted: Number(d.wanted ?? 0),
    dismissed: Number(d.dismissed ?? 0),
    redeemed: Number(d.redeemed ?? 0),
  }))
}

export async function fetchAudience(): Promise<AudienceStats | null> {
  const { data, error } = await panelDb().rpc('sponsor_audience_stats')
  return error ? null : (data as AudienceStats)
}

export async function redeemCode(code: string, locationId: string | null): Promise<string> {
  const { data, error } = await panelDb().rpc('sponsor_redeem_code', { p_code: code, p_location_id: locationId })
  if (error) throw error
  return titleOf((data as Record<string, unknown> | null)?.prize_title)
}

// ---------------------------------------------------------------------------
// Plan
// ---------------------------------------------------------------------------
export interface TierUsageRow {
  locationsUsed: number
  locationsLimit: number
  prizesUsed: number
  prizesLimit: number
}

export async function fetchTierUsage(): Promise<TierUsageRow | null> {
  const { data, error } = await panelDb().rpc('my_tier_usage')
  if (error || !Array.isArray(data) || data.length === 0) return null
  const r = data[0] as Record<string, unknown>
  return {
    locationsUsed: Number(r.locations_used ?? 0),
    locationsLimit: Number(r.locations_limit ?? 0),
    prizesUsed: Number(r.prizes_used ?? 0),
    prizesLimit: Number(r.prizes_limit ?? 0),
  }
}

export interface TierLimits {
  tier: Tier
  locations: number
  prizes: number
  redemptions_week: number
  max_prize_points: number
}

export async function fetchTierCatalog(): Promise<TierLimits[]> {
  const { data, error } = await panelDb().rpc('tier_catalog')
  if (error || !Array.isArray(data)) return []
  return data
    .map((r: Record<string, unknown>) => ({
      tier: asTier(r.tier) ?? 'bronze',
      locations: Number(r.locations ?? 0),
      prizes: Number(r.prizes ?? 0),
      redemptions_week: Number(r.redemptions_week ?? 0),
      max_prize_points: Number(r.max_prize_points ?? 0),
    }))
}

export async function chooseTier(tier: Tier): Promise<void> {
  const { error } = await panelDb().rpc('choose_sponsor_tier', { p_tier: tier })
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Premios
// ---------------------------------------------------------------------------
export const PRIZE_TYPES = ['product', 'service', 'discount', '2x1', 'other'] as const
export type PrizeType = (typeof PRIZE_TYPES)[number]

export interface Prize {
  id: string
  title: string
  description: string
  prize_type: PrizeType
  points_cost: number
  quantity_total: number
  quantity_remaining: number
  discount_pct: number | null
  image_url: string | null
  status: string
  validity_days: number | null
}

export async function fetchPrizes(sponsorId: string): Promise<Prize[]> {
  const { data, error } = await panelDb()
    .from('prizes')
    .select('*')
    .eq('sponsor_id', sponsorId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((d: Record<string, unknown>) => ({
    id: String(d.id),
    title: titleOf(d.title),
    description: d.description && typeof d.description === 'object' ? (s((d.description as Record<string, unknown>).es) ?? '') : '',
    prize_type: (PRIZE_TYPES as readonly string[]).includes(String(d.prize_type)) ? (d.prize_type as PrizeType) : 'product',
    points_cost: Number(d.points_cost ?? 0),
    quantity_total: Number(d.quantity_total ?? 0),
    quantity_remaining: Number(d.quantity_remaining ?? 0),
    discount_pct: d.discount_pct == null ? null : Number(d.discount_pct),
    image_url: s(d.image_url),
    status: String(d.status ?? ''),
    validity_days: d.validity_days == null ? null : Number(d.validity_days),
  }))
}

export interface PrizeInput {
  id: string | null
  title: string
  description: string
  prize_type: PrizeType
  points_cost: number
  quantity_total: number
  discount_pct: number | null
  image_url: string | null
  validity_days: number | null
}

export async function savePrize(sponsorId: string, p: PrizeInput): Promise<void> {
  const db = panelDb()
  const payload = {
    sponsor_id: sponsorId,
    title: { es: p.title },
    description: { es: p.description },
    prize_type: p.prize_type,
    points_cost: p.points_cost,
    discount_pct: p.prize_type === 'discount' ? p.discount_pct : null,
    image_url: p.image_url,
    // null = «usa el valor general»; igual que en la app.
    validity_days: p.validity_days,
    quantity_total: p.quantity_total,
  }
  if (p.id) {
    const { error } = await db.from('prizes').update(payload).eq('id', p.id)
    if (error) throw error
  } else {
    const { error } = await db.from('prizes').insert({ ...payload, quantity_remaining: p.quantity_total, status: 'active' })
    if (error) throw error
  }
}

export async function setPrizeActive(id: string, active: boolean): Promise<void> {
  const { error } = await panelDb().from('prizes').update({ status: active ? 'active' : 'expired' }).eq('id', id)
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Mi negocio
// ---------------------------------------------------------------------------
export interface LocationRow {
  id: string
  name: string
  address: string | null
  active: boolean
}

export async function fetchLocations(sponsorId: string): Promise<LocationRow[]> {
  const { data, error } = await panelDb()
    .from('sponsor_locations')
    .select('id, name, address, active')
    .eq('sponsor_id', sponsorId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map((d: Record<string, unknown>) => ({
    id: String(d.id),
    name: String(d.name ?? ''),
    address: s(d.address),
    active: d.active === true,
  }))
}

export async function saveLocation(
  sponsorId: string,
  l: { id: string | null; name: string; address: string; lat: number | null; lng: number | null },
): Promise<void> {
  const db = panelDb()
  const point = l.lat != null && l.lng != null ? `POINT(${l.lng} ${l.lat})` : null
  if (l.id) {
    const patch: Record<string, unknown> = { name: l.name, address: l.address || null }
    if (point) patch.location = point
    const { error } = await db.from('sponsor_locations').update(patch).eq('id', l.id)
    if (error) throw error
  } else {
    if (!point) throw new Error('NEED_POINT')
    const { error } = await db
      .from('sponsor_locations')
      .insert({ sponsor_id: sponsorId, name: l.name, address: l.address || null, location: point, active: true })
    if (error) throw error
  }
}

export async function setLocationActive(id: string, active: boolean): Promise<void> {
  const { error } = await panelDb().from('sponsor_locations').update({ active }).eq('id', id)
  if (error) throw error
}

/** Solo las columnas que el comercio puede escribir (0040 y 0094). */
export type ProfilePatch = Partial<{
  name: string
  category: string
  logo_url: string | null
  description: string | null
  opening_hours: string | null
  website: string | null
  instagram: string | null
  public_phone: string | null
  cover_url: string | null
  contact_person: string | null
  contact_phone: string | null
  contact_email: string | null
}>

export async function updateProfile(sponsorId: string, patch: ProfilePatch): Promise<void> {
  const { error } = await panelDb().from('sponsors').update(patch).eq('id', sponsorId)
  if (error) throw error
}

export interface GoldBanner {
  creativeUrl: string
  linkUrl: string | null
  active: boolean
}

export async function fetchGoldBanner(sponsorId: string): Promise<GoldBanner | null> {
  const { data, error } = await panelDb()
    .from('ad_campaigns')
    .select('creative_url, link_url, status')
    .eq('sponsor_id', sponsorId)
    .eq('ad_type', 'banner')
    .eq('budget_cents', 0)
    .maybeSingle()
  if (error || !data) return null
  return { creativeUrl: String(data.creative_url ?? ''), linkUrl: s(data.link_url), active: data.status === 'active' }
}

export async function saveGoldBanner(b: GoldBanner): Promise<void> {
  const { error } = await panelDb().rpc('sponsor_set_gold_banner', {
    p_creative_url: b.creativeUrl,
    p_link_url: b.linkUrl,
    p_active: b.active,
  })
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Imágenes (bucket creative-assets, las mismas carpetas que la app)
// ---------------------------------------------------------------------------
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export async function uploadImage(sponsorId: string, folder: 'logos' | 'covers' | 'prizes' | 'banners', file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) throw new Error('IMAGE_TOO_BIG')
  const bytes = new Uint8Array(await file.arrayBuffer())
  // El formato de los bytes, no del nombre: igual que la app.
  const contentType = sniffedImageType(bytes)
  if (!contentType) throw new Error('IMAGE_NOT_SUPPORTED')
  const ext = contentType === 'image/jpeg' ? 'jpg' : contentType.split('/')[1]
  const path = `${folder}/${sponsorId}_${Date.now()}.${ext}`
  const db = panelDb()
  const { error } = await db.storage.from('creative-assets').upload(path, bytes, { contentType })
  if (error) throw error
  return db.storage.from('creative-assets').getPublicUrl(path).data.publicUrl
}
