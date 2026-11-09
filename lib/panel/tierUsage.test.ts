// COPIA de Appark-main apps/mobile/src/services/tierUsage.test.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { usageLabel, isAtLimit, isNearLimit, nextTier } from './tierUsage.ts';

// 0 = ilimitado, la misma convención que app_config y que
// `sponsor.trial_days = 0`. Enseñarle "3 de 0" a un comercio de Oro
// sería peor que no enseñarle nada.
test('sin tope no se inventa un tope', () => {
  assert.equal(usageLabel({ tier: 'gold', used: 7, limit: 0 }), '7');
  assert.equal(isAtLimit({ tier: 'gold', used: 99, limit: 0 }), false);
  assert.equal(isNearLimit({ tier: 'gold', used: 99, limit: 0 }), false);
});

test('con tope se enseña el consumo completo', () => {
  assert.equal(usageLabel({ tier: 'silver', used: 2, limit: 3 }), '2 de 3');
});

test('el límite se detecta al llegar, no al pasarse', () => {
  assert.equal(isAtLimit({ tier: 'bronze', used: 1, limit: 1 }), true);
  assert.equal(isAtLimit({ tier: 'bronze', used: 0, limit: 1 }), false);
});

// Un sponsor de la beta puede tener más de lo que su paquete permite: la
// 0042 no toca a los que ya existen a propósito.
test('estar por encima del límite no rompe la cuenta', () => {
  assert.equal(isAtLimit({ tier: 'bronze', used: 4, limit: 1 }), true);
  assert.equal(usageLabel({ tier: 'bronze', used: 4, limit: 1 }), '4 de 1');
});

// Avisar con sitio de sobra es ruido, y el ruido enseña a ignorar el
// aviso que sí importa.
test('sólo se avisa en el último hueco', () => {
  assert.equal(isNearLimit({ tier: 'silver', used: 2, limit: 3 }), true);
  assert.equal(isNearLimit({ tier: 'silver', used: 1, limit: 3 }), false);
  assert.equal(isNearLimit({ tier: 'silver', used: 3, limit: 3 }), false);
});

// Decirle "con Plata puedes tener 3" a alguien que ya tiene Oro es el
// tipo de detalle que hace que deje de leer los avisos.
test('desde Oro no se ofrece un paquete que no existe', () => {
  assert.equal(nextTier('gold'), null);
  assert.equal(nextTier('bronze'), 'silver');
  assert.equal(nextTier('silver'), 'gold');
});

test('un tier desconocido propone el siguiente razonable', () => {
  assert.equal(nextTier(''), 'silver');
  assert.equal(nextTier('platino'), 'silver');
});
