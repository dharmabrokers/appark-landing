// COPIA de Appark-main apps/mobile/src/services/sponsorLive.ts (panel web, appark.es/panel).
// Si cambias uno, cambia el otro: la app y la web tienen que contar lo mismo.
/**
 * Si un comercio sale en el mapa: de pago, o en prueba con la fecha de fin
 * por delante (o sin fecha, la beta). Es la regla de `map_sponsors` y de
 * `sponsor_is_live` (migración 0089), repetida aquí para el catálogo.
 *
 * Sin imports: lo cargan los tests de `node --test`.
 */
export function isSponsorLive(
  sponsor: { status?: string | null; trial_ends_at?: string | null } | null | undefined,
  now: number,
): boolean {
  // Sin datos del comercio no se esconde nada: mejor ofrecer un premio que
  // ocultarlo por un fallo. La base es la que decide si se vende.
  if (!sponsor || !sponsor.status) return true;
  if (sponsor.status === 'active') return true;
  if (sponsor.status !== 'trial') return false;
  if (!sponsor.trial_ends_at) return true;
  const ends = Date.parse(sponsor.trial_ends_at);
  return !Number.isFinite(ends) || ends > now;
}
