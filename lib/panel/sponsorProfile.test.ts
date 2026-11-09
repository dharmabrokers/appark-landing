// COPIA de Appark-main apps/mobile/src/services/sponsorProfile.test.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeWebsite, normalizeInstagram, normalizePhone, displayWebsite, setupChecklist,
  type SponsorDetails,
} from './sponsorProfile.ts';

test('la web se completa con https y se rechaza lo que no lo es', () => {
  assert.equal(normalizeWebsite('barnou.es'), 'https://barnou.es');
  assert.equal(normalizeWebsite(' http://barnou.es/carta '), 'http://barnou.es/carta');
  assert.equal(normalizeWebsite(''), null);
  assert.equal(normalizeWebsite(null), null);
  assert.equal(normalizeWebsite('bar nou'), 'invalid');
  assert.equal(normalizeWebsite('javascript:alert(1)'), 'invalid');
  assert.equal(normalizeWebsite('localhost'), 'invalid');
});

test('el Instagram se queda en el nombre de usuario, venga como venga', () => {
  assert.equal(normalizeInstagram('@bar.nou'), 'bar.nou');
  assert.equal(normalizeInstagram('https://www.instagram.com/bar.nou/?hl=es'), 'bar.nou');
  assert.equal(normalizeInstagram('bar_nou'), 'bar_nou');
  assert.equal(normalizeInstagram(''), null);
  assert.equal(normalizeInstagram('bar nou'), 'invalid');
});

test('el teléfono necesita números de verdad', () => {
  assert.equal(normalizePhone('+34 971 00 00 00'), '+34 971 00 00 00');
  assert.equal(normalizePhone('971-000-000'), '971-000-000');
  assert.equal(normalizePhone('llámanos'), 'invalid');
  assert.equal(normalizePhone('12'), 'invalid');
  assert.equal(normalizePhone(' '), null);
});

test('la web se enseña sin protocolo', () => {
  assert.equal(displayWebsite('https://barnou.es/'), 'barnou.es');
});

const empty: SponsorDetails = {
  description: null, openingHours: null, website: null, instagram: null, publicPhone: null,
  coverUrl: null, address: null, contactPerson: null, contactPhone: null, contactEmail: null,
  taxId: null, hasPoster: false,
};

test('la lista empieza por lo que impide que le vean: local y premio', () => {
  const items = setupChecklist({ logoUrl: null, details: empty, activeLocations: 0, activePrizes: 0 });
  assert.deepEqual(items.slice(0, 2).map((i) => i.key), ['location', 'prize']);
  assert.equal(items.every((i) => !i.done), true);
  assert.equal(items.find((i) => i.key === 'prize')!.section, 'prizes');
});

test('lo que ya tiene sale hecho', () => {
  const items = setupChecklist({
    logoUrl: 'https://x/logo.png',
    details: { ...empty, description: 'Tapas', openingHours: 'L-V 9-20', hasPoster: true },
    activeLocations: 1, activePrizes: 2,
  });
  const done = Object.fromEntries(items.map((i) => [i.key, i.done]));
  assert.deepEqual(done, { location: true, prize: true, logo: true, description: true, hours: true, cover: false, poster: true });
});

test('sin detalles cargados no se rompe', () => {
  assert.equal(setupChecklist({ logoUrl: null, details: null, activeLocations: 1, activePrizes: 0 })[0].done, true);
});
