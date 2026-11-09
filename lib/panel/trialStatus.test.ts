// COPIA de Appark-main apps/mobile/src/services/trialStatus.test.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trialState } from './trialStatus.ts';

const NOW = Date.parse('2026-09-05T12:00:00Z');
const inDays = (d: number) => new Date(NOW + d * 86_400_000).toISOString();

test('a paying sponsor has no trial to show', () => {
  assert.deepEqual(trialState('active', null, NOW), { kind: 'none' });
  assert.deepEqual(trialState('active', inDays(10), NOW), { kind: 'none' });
});

// The beta: nobody pays and the free month starts afterwards, so a trial
// with no end date is not broken, it is waiting.
test('a trial with no end date is open, not expired', () => {
  assert.deepEqual(trialState('trial', null, NOW), { kind: 'open' });
});

test('a live trial counts the days left, rounded up', () => {
  assert.deepEqual(trialState('trial', inDays(30), NOW), { kind: 'counting', daysLeft: 30 });
  assert.deepEqual(trialState('trial', new Date(NOW + 4 * 3600_000).toISOString(), NOW), {
    kind: 'counting', daysLeft: 1,
  });
});

test('a passed end date reads as ended', () => {
  assert.deepEqual(trialState('trial', inDays(-1), NOW), { kind: 'ended' });
});

// Telling a shop its trial is over because a string was malformed would
// be the worst possible way to be wrong here.
test('an unparseable date does not claim the trial ended', () => {
  assert.deepEqual(trialState('trial', 'mañana', NOW), { kind: 'open' });
});
