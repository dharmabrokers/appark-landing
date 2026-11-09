// COPIA de Appark-main apps/mobile/src/services/sponsorResults.ts (panel web, appark.es/panel).
// Si cambias uno, cambia el otro: la app y la web tienen que contar lo mismo.
/**
 * Los resultados del comercio (sponsor_results, migración 0095), listos para
 * pintar. Puro, sin red ni React Native, para poder probarlo.
 *
 * Lo que ve cada paquete lo decide el servidor: aquí solo se pinta lo que
 * llega. Un campo que no viene es un campo que su paquete no incluye.
 */

export type Tier = 'bronze' | 'silver' | 'gold';

export interface PeriodStats {
  impressions: number;
  vouchers_issued: number;
  vouchers_redeemed: number;
  unique_customers: number;
  taps?: number;
  directions?: number;
  prize_views?: number;
  banner_impressions?: number;
  banner_taps?: number;
}

export interface SponsorResults {
  tier: Tier;
  days: number;
  from: string;
  to: string;
  tracking_since: string | null;
  current: PeriodStats;
  previous: PeriodStats;
  daily: { day: string; impressions: number; redeemed: number }[];
  by_location?: { location_id: string; name: string; impressions: number; taps: number; directions: number; redeemed: number }[];
  by_weekday?: { dow: number; redeemed: number }[];
  by_hour?: { hour: number; redeemed: number }[];
  benchmark?: { peers: number; impressions: number; vouchers_redeemed: number };
}

/**
 * La variación frente al periodo anterior. null cuando no se puede decir
 * nada honesto: sin datos antes, «+∞ %» no significa nada.
 */
export function delta(current: number, previous: number): { pct: number; dir: 'up' | 'down' | 'flat' } | null {
  if (!previous) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  return { pct, dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat' };
}

/** El porcentaje de un paso del embudo sobre el anterior, sin dividir por cero. */
export function rate(part: number, whole: number): number | null {
  if (!whole) return null;
  return Math.round((part / whole) * 100);
}

/** Los pasos del embudo (Plata y Oro): de verte a canjear. */
export function funnel(c: PeriodStats): { key: 'impressions' | 'taps' | 'directions' | 'redeemed'; value: number; rate: number | null }[] | null {
  if (c.taps === undefined || c.directions === undefined) return null;
  const steps = [
    { key: 'impressions' as const, value: c.impressions },
    { key: 'taps' as const, value: c.taps },
    { key: 'directions' as const, value: c.directions },
    { key: 'redeemed' as const, value: c.vouchers_redeemed },
  ];
  return steps.map((s, i) => ({ ...s, rate: i === 0 ? null : rate(s.value, steps[i - 1].value) }));
}

/**
 * Si el periodo empieza antes de que se midieran las visitas (0094). Sin
 * avisarlo, un «0 personas» de antes de medir se leería como «nadie».
 */
export function trackingStartedMidPeriod(r: Pick<SponsorResults, 'from' | 'tracking_since'>): boolean {
  return !r.tracking_since || r.tracking_since > r.from;
}

/** El CSV que se puede exportar (Oro): un día por fila. */
export function resultsCsv(r: SponsorResults): string {
  const rows = [['dia', 'personas_que_te_vieron', 'vales_canjeados']];
  for (const d of r.daily) rows.push([d.day, String(d.impressions), String(d.redeemed)]);
  return rows.map((row) => row.join(';')).join('\n');
}

/** La barra más alta de una serie, sin dividir por cero al pintar. */
export function maxOf(values: number[]): number {
  return Math.max(1, ...values);
}
