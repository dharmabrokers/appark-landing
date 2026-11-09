// COPIA de Appark-main apps/mobile/src/services/sponsorProfile.ts (panel web, appark.es/panel).
// Si cambias uno, cambia el otro: la app y la web tienen que contar lo mismo.
/**
 * El perfil público del comercio (migración 0094): lo que escribe en «Mi
 * negocio» y lo que ve el conductor en su ficha del mapa.
 *
 * Puro, sin red ni React Native, para poder probarlo. La base de datos
 * vuelve a comprobar el formato (CHECK de la 0094): esto existe para que el
 * comercio vea su error al escribir y no un fallo genérico al guardar.
 */

export interface SponsorDetails {
  description: string | null;
  openingHours: string | null;
  website: string | null;
  instagram: string | null;
  publicPhone: string | null;
  coverUrl: string | null;
  address: string | null;
  contactPerson: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  taxId: string | null;
  hasPoster: boolean;
}

export const DESCRIPTION_MAX = 500;
export const HOURS_MAX = 200;

function clean(v: string | null | undefined): string {
  return (v ?? '').trim();
}

/** «barnou.es» → «https://barnou.es». Vacío → null. Lo que no es una web → 'invalid'. */
export function normalizeWebsite(v: string | null | undefined): string | null | 'invalid' {
  let s = clean(v);
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  if (/\s/.test(s) || !/^https?:\/\/[^/.]+\.[^/]+/i.test(s) || s.length > 255) return 'invalid';
  return s;
}

/** «@bar.nou», «instagram.com/bar.nou/» o «bar.nou» → «bar.nou». */
export function normalizeInstagram(v: string | null | undefined): string | null | 'invalid' {
  let s = clean(v);
  if (!s) return null;
  s = s.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').replace(/[/?#].*$/, '');
  return /^[A-Za-z0-9._]{1,30}$/.test(s) ? s : 'invalid';
}

export function normalizePhone(v: string | null | undefined): string | null | 'invalid' {
  const s = clean(v);
  if (!s) return null;
  return /^[0-9 +().-]{6,30}$/.test(s) && /\d{6,}/.test(s.replace(/\D/g, '')) ? s : 'invalid';
}

/** El enlace para abrir su Instagram desde la ficha. */
export function instagramUrl(handle: string): string {
  return `https://instagram.com/${handle}`;
}

/** Lo que se le enseña de la web: sin https:// ni la barra final. */
export function displayWebsite(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

export type ChecklistKey =
  | 'logo'
  | 'cover'
  | 'description'
  | 'hours'
  | 'location'
  | 'prize'
  | 'poster';

export interface ChecklistItem {
  key: ChecklistKey;
  done: boolean;
  /** A qué pestaña lleva tocarlo. */
  section: 'business' | 'prizes';
}

/**
 * Lo que le falta para atraer más, en el orden en que más rinde: sin local
 * no sale en el mapa y sin premio nadie tiene por qué entrar; después, lo
 * que hace que alguien elija ir.
 */
export function setupChecklist(input: {
  logoUrl: string | null;
  details: SponsorDetails | null;
  activeLocations: number;
  activePrizes: number;
}): ChecklistItem[] {
  const d = input.details;
  return [
    { key: 'location', done: input.activeLocations > 0, section: 'business' },
    { key: 'prize', done: input.activePrizes > 0, section: 'prizes' },
    { key: 'logo', done: !!clean(input.logoUrl), section: 'business' },
    { key: 'description', done: !!clean(d?.description), section: 'business' },
    { key: 'hours', done: !!clean(d?.openingHours), section: 'business' },
    { key: 'cover', done: !!clean(d?.coverUrl), section: 'business' },
    { key: 'poster', done: !!d?.hasPoster, section: 'business' },
  ];
}
