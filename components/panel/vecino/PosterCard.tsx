'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  captureProblems, captureTime, fitWithin, isPoorAccuracy, posterCard, posterMeta, posterPath, retryReasonText, vecinoErrorText,
  type PosterStatus,
} from '@/lib/panel/vecino'
import { fetchPosterStatus, submitPoster, uploadPosterPhoto, verifyPoster } from '@/lib/panel/vecinoApi'
import { C, Card, H2, Notice } from '../ui'

/** Cuánto se espera al GPS después de la foto. */
const FIX_TIMEOUT_MS = 20_000

/**
 * El cartel «Punto de canje» cada 60 días (§2.3, 0126), en la web. Paridad con
 * apps/mobile/src/components/vecino/PosterCard.tsx:
 *
 * - La foto sale de la cámara del móvil: <input capture="environment">. En el
 *   ordenador `capture` abre la carpeta de fotos, así que ahí no se ofrece y se
 *   pide hacerla desde el móvil. Una foto de la galería llega con su fecha
 *   antigua y se rechaza antes de subirla (captureProblems).
 * - La ubicación es la de ese momento (navigator.geolocation, sin caché), pedida
 *   justo después de la foto, con su precisión.
 * - La foto se vuelve a codificar en JPEG en el navegador (el CRM no abre HEIC y
 *   así tampoco viajan los EXIF), se sube a creative-assets/carteles/<uid>/, se
 *   llama a sponsor_submit_poster y se avisa a /api/carteles/verificar (URL de
 *   app_config). Sin URL, o si la ruta falla, tarda o el navegador la bloquea,
 *   el cartel queda pendiente de revisión manual y la tarjeta lo dice.
 *
 * Solo se pinta con flags.freemium_sponsors encendido para el comercio: sin él,
 * la política de Storage de la 0126 no le deja subir nada.
 */
export default function PosterCard({ sponsorId, verifyUrl }: { sponsorId: string; verifyUrl: string | null }) {
  const [status, setStatus] = useState<PosterStatus | null>(null)
  const [busy, setBusy] = useState<null | 'fix' | 'upload' | 'verify'>(null)
  const [note, setNote] = useState<{ kind: 'ok' | 'warn' | 'error'; text: string } | null>(null)
  const [mobile, setMobile] = useState<boolean | null>(null)
  const input = useRef<HTMLInputElement>(null)

  const reload = useCallback(async () => setStatus(await fetchPosterStatus()), [])

  useEffect(() => {
    void reload()
    try {
      setMobile(window.matchMedia('(pointer: coarse)').matches)
    } catch {
      setMobile(false)
    }
  }, [reload])

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || busy) return
    setNote(null)
    setBusy('fix')
    try {
      const fix = await currentFix()
      const now = Date.now()
      const problems = captureProblems({ fileLastModified: file.lastModified, fix: fix && { timestamp: fix.timestamp, accuracy: fix.coords.accuracy }, now })
      if (problems.includes('old_photo')) {
        setNote({ kind: 'error', text: 'Esa foto no es de ahora. Hazla con la cámara en este momento, delante del cartel.' })
        return
      }
      if (!fix || problems.length) {
        setNote({ kind: 'error', text: 'No hemos podido situarte. Deja que el navegador use tu ubicación, sal a la puerta y vuelve a probar.' })
        return
      }

      setBusy('upload')
      const takenAt = captureTime(file.lastModified, now)
      const jpeg = await toJpeg(file)
      const url = await uploadPosterPhoto(posterPath(sponsorId, takenAt), jpeg)
      await submitPoster(url, posterMeta(fix.coords, takenAt))

      if (verifyUrl) setBusy('verify')
      const outcome = await verifyPoster(verifyUrl)
      const fresh = await fetchPosterStatus()
      setStatus(fresh)
      const imprecise = isPoorAccuracy(fix.coords.accuracy)
        ? ` Tu ubicación era poco precisa (±${Math.round(fix.coords.accuracy)} m): la próxima vez, hazla con el GPS activado y desde la puerta.`
        : ''
      if (outcome.status === 'approved') {
        setNote({ kind: 'ok', text: 'Cartel validado: ya tienes +1 canje por semana. 💚' })
      } else if (outcome.status === 'retry' && fresh?.canRenew) {
        // La ruta la deja en `rejected` y se puede repetir al momento.
        setNote({ kind: 'warn', text: retryReasonText(outcome.reason) })
      } else {
        setNote({ kind: 'warn', text: `Foto recibida. Queda pendiente: la revisamos a mano y te avisamos.${imprecise}` })
      }
    } catch (err) {
      const raw = String((err as { message?: unknown } | null)?.message ?? err ?? '')
      setNote({
        kind: 'error',
        text: vecinoErrorText(raw) ?? (raw === 'IMAGE_UNREADABLE'
          ? 'No hemos podido leer la foto. Hazla otra vez con la cámara del móvil.'
          : 'No se ha podido subir la foto. Inténtalo de nuevo.'),
      })
      void reload()
    } finally {
      setBusy(null)
    }
  }

  if (!status) return null
  const card = posterCard(status)
  const body = (() => {
    switch (card.kind) {
      case 'start':
        return card.rejected
          ? 'No hemos podido validar la última foto. Hazla otra vez, de frente y con el cartel entero.'
          : 'Pon el cartel en tu escaparate y hazle una foto: ganas 1 canje más por semana y la insignia «Punto de canje» en el mapa.'
      case 'pending':
        return 'Foto recibida. La estamos revisando.'
      case 'verified':
        return `Verificado. Caduca en ${card.daysLeft ?? '—'} días.`
      case 'renew':
        return card.expired
          ? 'Tu cartel ha caducado: hazle una foto nueva para recuperar el canje extra.'
          : `Verificado. Caduca en ${card.daysLeft ?? '—'} días: hazle una foto nueva.`
      case 'legacy':
        return 'Verificado.'
    }
  })()
  const canAct = (card.kind === 'start' || card.kind === 'renew') && status.canRenew
  const active = card.kind === 'verified' || card.kind === 'legacy' || (card.kind === 'renew' && !card.expired)
  const label = busy === 'fix' ? 'Buscando tu ubicación…' : busy === 'upload' ? 'Subiendo la foto…' : busy === 'verify' ? 'Comprobando tu cartel…' : null

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <H2>🪧 Cartel «Punto de canje»</H2>
        {active && <span style={{ fontSize: 13, fontWeight: 800, color: '#1B8A5A' }}>+1 canje activo</span>}
      </div>
      <p style={{ margin: 0, fontSize: 14.5, color: C.sub, lineHeight: 1.5 }}>{body}</p>
      {note && <div style={{ marginTop: 12 }}><Notice kind={note.kind}>{note.text}</Notice></div>}
      {canAct && mobile === true && (
        <>
          <input ref={input} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: 'none' }} aria-hidden="true" tabIndex={-1} />
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={!!busy}
            style={{
              marginTop: 14, width: '100%', padding: '13px 16px', borderRadius: 12, border: `2px solid ${C.ink}`, background: busy ? '#F4F6F7' : '#fff',
              color: C.ink, fontWeight: 800, fontSize: 15, fontFamily: 'var(--font-body), sans-serif', cursor: busy ? 'default' : 'pointer',
            }}
          >
            {label ?? (card.kind === 'renew' ? '📷 Renovar foto del cartel' : '📷 Hacer foto del cartel')}
          </button>
        </>
      )}
      {canAct && mobile === false && (
        <div style={{ marginTop: 12 }}>
          <Notice kind="info">La foto se hace con el móvil, en tu local: abre appark.es/panel en tu teléfono o usa la app.</Notice>
        </div>
      )}
      {canAct && (
        <p style={{ margin: '10px 0 0', fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>
          Solo con la cámara y en tu local: usamos la ubicación de ese momento para comprobar que el cartel está en tu puerta. La foto
          puede salir con gente de la calle: encuádrala en el cartel. Cómo la tratamos, en la{' '}
          <Link href="/legal/privacidad#cartel" style={{ color: C.sea, fontWeight: 700 }}>política de privacidad</Link>.
        </p>
      )}
    </Card>
  )
}

/** La posición de ahora mismo, sin caché. null si no hay permiso, no llega o tarda. */
function currentFix(): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), { enableHighAccuracy: true, timeout: FIX_TIMEOUT_MS, maximumAge: 0 })
  })
}

/** La foto en JPEG, girada como la ve el móvil y con el lado mayor ≤ 2800 px. */
async function toJpeg(file: File): Promise<Blob> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error('IMAGE_UNREADABLE')
  }
  const { width, height } = fitWithin(bitmap.width, bitmap.height)
  if (!width || !height) throw new Error('IMAGE_UNREADABLE')
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('IMAGE_UNREADABLE')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
  if (!blob) throw new Error('IMAGE_UNREADABLE')
  return blob
}
