// COPIA de Appark-main apps/mobile/src/constants/categories.ts (panel web).
// Fixed taxonomy for sponsor/prize categories. sponsors.category is still
// free text in the DB (no CHECK constraint — see plan notes), this is a
// UI-layer taxonomy: anything that doesn't match falls back to 'other'.
export const SPONSOR_CATEGORIES = [
  'restaurant', 'shop', 'fitness', 'beauty', 'leisure',
  'services', 'health', 'automotive', 'other',
] as const;

export type SponsorCategory = typeof SPONSOR_CATEGORIES[number];

export const CATEGORY_META: Record<SponsorCategory, { emoji: string; labelKey: string }> = {
  restaurant: { emoji: '🍽️', labelKey: 'category_restaurant' },
  shop: { emoji: '🛍️', labelKey: 'category_shop' },
  fitness: { emoji: '💪', labelKey: 'category_fitness' },
  beauty: { emoji: '💆', labelKey: 'category_beauty' },
  leisure: { emoji: '🎉', labelKey: 'category_leisure' },
  services: { emoji: '🔧', labelKey: 'category_services' },
  health: { emoji: '⚕️', labelKey: 'category_health' },
  automotive: { emoji: '🚗', labelKey: 'category_automotive' },
  other: { emoji: '📍', labelKey: 'category_other' },
};

export function normalizeCategory(raw: string | null | undefined): SponsorCategory {
  return raw && (SPONSOR_CATEGORIES as readonly string[]).includes(raw) ? (raw as SponsorCategory) : 'other';
}

/**
 * Strips characters that occupy no space, returning null when nothing
 * drawable is left.
 *
 * Several live sponsor rows hold their emoji wrapped in zero-width spaces
 * (e.g. U+200B around the glyph), almost certainly from a paste rather
 * than typed. Harmless on their own — but a value made up *only* of
 * zero-width characters is truthy while rendering as nothing, which
 * paints an empty pin and reads as a bug in the map. Deciding "has an
 * icon" on what is actually drawable makes such a row fall back instead.
 */
export function cleanGlyph(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  // U+200B..U+200D (zero-width space/non-joiner/joiner) and U+FEFF (BOM),
  // written as escapes because the literal characters are invisible in an
  // editor and a maintainer could not otherwise tell what this matches.
  const stripped = raw.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  return stripped.length > 0 ? stripped : null;
}

/**
 * The glyph that represents a sponsor wherever one is drawn.
 *
 * The sponsor's own icon wins. It is their identity — the thing that
 * tells two neighbouring map pins apart — and it is a deliberate choice
 * made in their panel, so nothing derived may overwrite it.
 *
 * The category only fills the gap for a sponsor who never picked one.
 * That keeps the useful half of driving the glyph from the taxonomy (a
 * new business gets something meaningful instead of a generic 🏪) without
 * the harmful half: preferring the category collapses every sponsor that
 * shares one into the same emoji, which on a map destroys exactly the
 * distinctiveness a pin exists to provide.
 */
export function resolveSponsorGlyph(
  icon: string | null | undefined,
  category: string | null | undefined,
): string {
  const own = cleanGlyph(icon);
  if (own) return own;
  if (category) return CATEGORY_META[normalizeCategory(category)].emoji;
  return '🏪';
}
