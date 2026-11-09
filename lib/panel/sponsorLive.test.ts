// COPIA de Appark-main apps/mobile/src/services/sponsorLive.test.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { isSponsorLive } from './sponsorLive.ts';

const NOW = Date.parse('2026-10-14T12:00:00Z');

// Tiene que coincidir con sponsor_is_live (0089) y con map_sponsors.
test('de pago y en prueba con fecha por delante, sí', () => {
  assert.equal(isSponsorLive({ status: 'active' }, NOW), true);
  assert.equal(isSponsorLive({ status: 'trial', trial_ends_at: '2026-10-20T00:00:00Z' }, NOW), true);
  assert.equal(isSponsorLive({ status: 'trial', trial_ends_at: null }, NOW), true);
});

test('caducado, suspendido o con la prueba pasada aunque el cron no haya corrido, no', () => {
  assert.equal(isSponsorLive({ status: 'expired' }, NOW), false);
  assert.equal(isSponsorLive({ status: 'suspended' }, NOW), false);
  assert.equal(isSponsorLive({ status: 'trial', trial_ends_at: '2026-10-14T11:00:00Z' }, NOW), false);
});

test('sin datos del comercio no se esconde el premio', () => {
  assert.equal(isSponsorLive(null, NOW), true);
  assert.equal(isSponsorLive({}, NOW), true);
  assert.equal(isSponsorLive({ status: 'trial', trial_ends_at: 'basura' }, NOW), true);
});
