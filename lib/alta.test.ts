import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PLANS, annualFee } from './alta.ts';

// Doce meses al precio de diez: lo que se cobra y lo que espera Stripe (scripts/stripe-setup.mjs).
test('el pago anual cuesta diez cuotas', () => {
  assert.equal(annualFee(PLANS.bronze, true), 690);
  assert.equal(annualFee(PLANS.silver, true), 1390);
  assert.equal(annualFee(PLANS.gold, true), 2790);
  assert.equal(annualFee(PLANS.gold, false), 3990);
});
