'use client'
import { useRef, useState } from 'react'
import { uploadImage } from '@/lib/panel/data'
import { errorMessage } from '@/lib/panel/text'
import { Button, C, hintStyle, labelStyle, Notice } from './ui'

/** Subir una imagen al bucket creative-assets (las mismas carpetas que la app). */
export default function ImageField({
  sponsorId, folder, label, hint, value, onChange, aspect = '1 / 1',
}: {
  sponsorId: string
  folder: 'logos' | 'covers' | 'prizes' | 'banners'
  label: string
  hint?: string
  value: string | null
  onChange: (url: string | null) => void
  aspect?: string
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const pick = async (file: File | undefined) => {
    if (!file) return
    setError('')
    setBusy(true)
    try {
      onChange(await uploadImage(sponsorId, folder, file))
    } catch (err) {
      setError(errorMessage(err, 'No se ha podido subir la imagen.'))
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <div>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ width: aspect === '1 / 1' ? 72 : 180, aspectRatio: aspect, borderRadius: 12, background: C.sand, border: `1px solid ${C.line}`, overflow: 'hidden', flexShrink: 0 }}>
          {value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          )}
        </div>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: 'none' }} onChange={(e) => pick(e.target.files?.[0])} />
        <Button kind="ghost" onClick={() => input.current?.click()} disabled={busy}>{busy ? 'Subiendo…' : value ? 'Cambiar' : 'Subir imagen'}</Button>
        {value && <Button kind="ghost" onClick={() => onChange(null)} disabled={busy}>Quitar</Button>}
      </div>
      {hint && <div style={hintStyle}>{hint}</div>}
      {error && <div style={{ marginTop: 8 }}><Notice kind="error">{error}</Notice></div>}
    </div>
  )
}
