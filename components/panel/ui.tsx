'use client'
import type { CSSProperties, ReactNode } from 'react'

/** Piezas de estilo del panel: las mismas medidas y colores que /alta. */

export const C = {
  ink: '#0A2A36',
  sub: '#45626C',
  muted: '#7C919A',
  coral: '#FF4E00',
  sea: '#11607A',
  green: '#1FB877',
  line: 'rgba(10,42,54,.10)',
  sand: '#FBF6EE',
}

export const inputStyle: CSSProperties = {
  width: '100%', padding: '11px 13px', border: '1.5px solid rgba(10,42,54,.14)', borderRadius: 12,
  fontSize: 15, fontFamily: 'var(--font-body), sans-serif', color: C.ink, outline: 'none',
  background: '#FCFAF6', boxSizing: 'border-box',
}

export const labelStyle: CSSProperties = { display: 'block', fontWeight: 700, fontSize: 13, color: C.ink, marginBottom: 6 }
export const hintStyle: CSSProperties = { fontSize: 12.5, color: C.muted, marginTop: 5, lineHeight: 1.45 }

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <section
      style={{
        background: '#fff', border: `1px solid ${C.line}`, borderRadius: 20,
        boxShadow: '0 16px 40px rgba(10,42,54,.06)', padding: 'clamp(16px,3vw,24px)', minWidth: 0, ...style,
      }}
    >
      {children}
    </section>
  )
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 19, color: C.ink, margin: '0 0 12px' }}>{children}</h2>
}

export function Button({
  children, onClick, kind = 'primary', disabled, type = 'button', style,
}: {
  children: ReactNode
  onClick?: () => void
  kind?: 'primary' | 'ghost' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
  style?: CSSProperties
}) {
  const base: CSSProperties = {
    padding: '10px 16px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: disabled ? 'default' : 'pointer',
    fontFamily: 'var(--font-body), sans-serif', opacity: disabled ? 0.55 : 1, border: 'none',
  }
  const look: Record<string, CSSProperties> = {
    primary: { background: C.coral, color: '#fff' },
    ghost: { background: '#fff', color: C.sea, border: '1.5px solid rgba(17,96,122,.25)' },
    danger: { background: '#fff', color: '#B3341A', border: '1.5px solid rgba(179,52,26,.3)' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...look[kind], ...style }}>
      {children}
    </button>
  )
}

export function Notice({ kind = 'info', children }: { kind?: 'info' | 'error' | 'ok' | 'warn'; children: ReactNode }) {
  const look = {
    info: { background: '#EEF6F8', color: C.sea },
    error: { background: '#FDECE8', color: '#B3341A' },
    ok: { background: '#E6F7EF', color: '#1B8A5A' },
    warn: { background: '#FFF4E5', color: '#9A5B00' },
  }[kind]
  return (
    <p role={kind === 'error' ? 'alert' : undefined} style={{ margin: 0, padding: '10px 13px', borderRadius: 12, fontSize: 14, fontWeight: 700, lineHeight: 1.45, ...look }}>
      {children}
    </p>
  )
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: C.sand, borderRadius: 14, padding: '12px 14px', minWidth: 0 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.muted }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 800, fontSize: 26, color: C.ink, lineHeight: 1.15 }}>{value}</div>
      {sub && <div style={{ fontSize: 12.5, fontWeight: 700, color: C.sub }}>{sub}</div>}
    </div>
  )
}

export const grid = (min: number): CSSProperties => ({ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: 12 })

/** Barras horizontales simples (sin librería de gráficos). */
export function Bars({ rows, max }: { rows: { label: string; value: number }[]; max: number }) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 44px', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
          <span style={{ color: C.sub, fontWeight: 700 }}>{r.label}</span>
          <span style={{ height: 10, background: 'rgba(10,42,54,.06)', borderRadius: 99, overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${Math.round((r.value / Math.max(1, max)) * 100)}%`, background: C.sea, borderRadius: 99 }} />
          </span>
          <span style={{ textAlign: 'right', fontWeight: 800, color: C.ink }}>{r.value}</span>
        </div>
      ))}
    </div>
  )
}
