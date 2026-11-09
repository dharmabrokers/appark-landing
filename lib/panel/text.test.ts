import { test } from 'node:test'
import assert from 'node:assert/strict'
import { errorMessage, n } from './text.ts'

test('los errores de la base salen en palabras del comercio', () => {
  assert.match(errorMessage({ message: 'PRIZE_LIMIT_REACHED' }), /Con Plata/)
  assert.match(errorMessage(new Error('new row violates: LOCATION_LIMIT_REACHED')), /locales/)
  assert.match(errorMessage({ message: 'CODE_NOT_FOUND' }), /No existe/)
  assert.equal(errorMessage({ message: 'algo raro' }, 'X'), 'X')
  assert.equal(errorMessage(null, 'X'), 'X')
})

test('números con separador de miles', () => {
  assert.equal(n(0), '0')
  assert.equal(n(undefined), '0')
})
