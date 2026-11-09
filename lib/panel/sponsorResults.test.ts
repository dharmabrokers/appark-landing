// COPIA de Appark-main apps/mobile/src/services/sponsorResults.test.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { delta, rate, funnel, trackingStartedMidPeriod, resultsCsv, maxOf, type SponsorResults } from './sponsorResults.ts';

test('la variación se calcula sobre el periodo anterior', () => {
  assert.deepEqual(delta(150, 100), { pct: 50, dir: 'up' });
  assert.deepEqual(delta(50, 100), { pct: -50, dir: 'down' });
  assert.deepEqual(delta(100, 100), { pct: 0, dir: 'flat' });
});

test('sin periodo anterior no se inventa una variación', () => {
  assert.equal(delta(30, 0), null);
});

test('el embudo solo existe si el paquete lo incluye', () => {
  const bronze = { impressions: 100, vouchers_issued: 5, vouchers_redeemed: 3, unique_customers: 2 };
  assert.equal(funnel(bronze), null);
  const silver = { ...bronze, taps: 20, directions: 5, prize_views: 8 };
  assert.deepEqual(funnel(silver), [
    { key: 'impressions', value: 100, rate: null },
    { key: 'taps', value: 20, rate: 20 },
    { key: 'directions', value: 5, rate: 25 },
    { key: 'redeemed', value: 3, rate: 60 },
  ]);
});

test('un paso tras un cero no divide por cero', () => {
  assert.equal(rate(3, 0), null);
});

test('se avisa si el periodo empieza antes de medir visitas', () => {
  assert.equal(trackingStartedMidPeriod({ from: '2026-09-20', tracking_since: '2026-10-17' }), true);
  assert.equal(trackingStartedMidPeriod({ from: '2026-10-18', tracking_since: '2026-10-17' }), false);
  assert.equal(trackingStartedMidPeriod({ from: '2026-10-18', tracking_since: null }), true);
});

test('el CSV tiene una fila por día', () => {
  const r = {
    daily: [
      { day: '2026-10-18', impressions: 12, redeemed: 1 },
      { day: '2026-10-19', impressions: 7, redeemed: 0 },
    ],
  } as SponsorResults;
  assert.equal(resultsCsv(r), 'dia;personas_que_te_vieron;vales_canjeados\n2026-10-18;12;1\n2026-10-19;7;0');
});

test('la escala de las barras nunca es cero', () => {
  assert.equal(maxOf([0, 0]), 1);
  assert.equal(maxOf([3, 9]), 9);
});
