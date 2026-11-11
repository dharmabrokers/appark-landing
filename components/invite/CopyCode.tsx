'use client'
import { useState } from 'react'

/** El código grande, con «Copiar», para pegarlo en la app después de instalarla. */
export default function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Sin permiso de portapapeles: el código se ve y se puede seleccionar.
    }
  }
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      <span
        style={{
          fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: 4, color: '#0A2A36',
          background: '#FBF6EE', border: '2px dashed rgba(10,42,54,.2)', borderRadius: 16, padding: '10px 18px', userSelect: 'all',
        }}
      >
        {code}
      </span>
      <button
        type="button"
        onClick={copy}
        style={{ border: '1.5px solid rgba(17,96,122,.3)', background: '#fff', color: '#11607A', fontWeight: 800, fontSize: 15, padding: '12px 16px', borderRadius: 12, cursor: 'pointer', fontFamily: 'var(--font-body), sans-serif' }}
      >
        {copied ? '✓ Copiado' : 'Copiar'}
      </button>
    </div>
  )
}
