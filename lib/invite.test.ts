import { test } from 'node:test'
import assert from 'node:assert/strict'
import { inviteDownloadPath, normalizeInviteCode } from './invite.ts'

test('el código del enlace', () => {
  assert.equal(normalizeInviteCode('APK3F2A9C'), 'APK3F2A9C')
  assert.equal(normalizeInviteCode('apk3f2a9c'), 'APK3F2A9C')
  assert.equal(normalizeInviteCode('APK3F2'), null)
  assert.equal(normalizeInviteCode('<script>'), null)
  assert.equal(normalizeInviteCode(undefined), null)
})

test('la descarga lleva la campaña y el código', () => {
  const p = inviteDownloadPath('APK3F2A9C')
  assert.ok(p.startsWith('/descargar?'))
  const q = new URLSearchParams(p.split('?')[1])
  assert.equal(q.get('c'), 'invita')
  assert.equal(q.get('utm_content'), 'APK3F2A9C')
})
