// COPIA de Appark-main apps/mobile/src/services/imageType.test.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { sniffedImageType } from './imageType.ts';

const b = (...n: number[]) => new Uint8Array(n);

test('JPEG y PNG por sus primeros bytes, digan lo que digan', () => {
  assert.equal(sniffedImageType(b(0xff, 0xd8, 0xff, 0xe0)), 'image/jpeg');
  assert.equal(sniffedImageType(b(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a)), 'image/png');
  assert.equal(sniffedImageType(b(0x47, 0x49, 0x46, 0x38)), 'image/gif');
  assert.equal(sniffedImageType(b(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50)), 'image/webp');
});

test('lo que no se reconoce, null', () => {
  assert.equal(sniffedImageType(b()), null);
  assert.equal(sniffedImageType(b(0x3c, 0x68, 0x74)), null);
});
