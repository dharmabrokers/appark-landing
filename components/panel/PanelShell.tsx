'use client'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { panelDb } from '@/lib/panel/supabase'
import { fetchSponsor, type Sponsor } from '@/lib/panel/data'
import { TIER_NAMES } from '@/lib/panel/text'
import PanelLogin from './PanelLogin'
import { C } from './ui'

/**
 * El marco del panel (appark.es/panel): comprueba la sesión, carga el comercio y
 * pinta la cabecera y las pestañas. Sin sesión, o si el usuario no es un comercio,
 * enseña la pantalla de entrar.
 */

interface PanelCtx {
  sponsor: Sponsor
  reload: () => Promise<void>
}

const Ctx = createContext<PanelCtx | null>(null)

export function usePanel(): PanelCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('usePanel fuera del panel')
  return v
}

const TABS = [
  { href: '/panel/inicio', label: 'Inicio' },
  { href: '/panel/premios', label: 'Premios' },
  { href: '/panel/resultados', label: 'Resultados' },
  { href: '/panel/negocio', label: 'Mi negocio' },
  { href: '/panel/plan', label: 'Plan' },
]

type State = { kind: 'loading' } | { kind: 'out'; reason?: 'not_sponsor' } | { kind: 'in'; sponsor: Sponsor }

export default function PanelShell({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ kind: 'loading' })
  const pathname = usePathname()

  const load = useCallback(async () => {
    try {
      const db = panelDb()
      const { data } = await db.auth.getSession()
      const user = data.session?.user
      if (!user) return setState({ kind: 'out' })
      const sponsor = await fetchSponsor(user.id)
      if (!sponsor) {
        // Un usuario que no es comercio (un conductor) no se queda dentro.
        await db.auth.signOut()
        return setState({ kind: 'out', reason: 'not_sponsor' })
      }
      setState({ kind: 'in', sponsor })
    } catch (err) {
      console.error('[panel]', err)
      setState({ kind: 'out' })
    }
  }, [])

  useEffect(() => {
    void load()
    let unsubscribe = () => {}
    try {
      const { data } = panelDb().auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') void load()
      })
      unsubscribe = () => data.subscription.unsubscribe()
    } catch {
      // Sin configuración de Supabase: se queda en la pantalla de entrar.
    }
    return unsubscribe
  }, [load])

  const signOut = async () => {
    await panelDb().auth.signOut()
    setState({ kind: 'out' })
  }

  if (state.kind === 'loading') {
    return <div style={{ minHeight: '100vh', background: C.sand }} aria-busy="true" />
  }
  if (state.kind === 'out') {
    return <PanelLogin notSponsor={state.reason === 'not_sponsor'} />
  }

  const { sponsor } = state
  return (
    <Ctx.Provider value={{ sponsor, reload: load }}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#FBF6EE 0%,#F8FAFB 50%)' }}>
        <header style={{ background: '#fff', borderBottom: `1px solid ${C.line}` }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/" aria-label="Appark" style={{ display: 'inline-flex' }}>
              <Image src="/logo-appark-logotipo.png" alt="Appark" width={0} height={0} sizes="110px" priority style={{ display: 'block', height: 26, width: 'auto' }} />
            </Link>
            <span style={{ fontSize: 13, fontWeight: 800, color: C.muted }}>Panel del comercio</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: C.ink, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {sponsor.name}
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: C.sea, background: '#EEF6F8', padding: '4px 9px', borderRadius: 99 }}>
              {TIER_NAMES[sponsor.tier]}
            </span>
            <button onClick={signOut} style={{ border: 'none', background: 'none', color: C.sub, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>
              Salir
            </button>
          </div>
          <nav aria-label="Secciones del panel" style={{ maxWidth: 1080, margin: '0 auto', padding: '0 8px', display: 'flex', gap: 2, overflowX: 'auto' }}>
            {TABS.map((t) => {
              const on = pathname === t.href
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  aria-current={on ? 'page' : undefined}
                  style={{
                    padding: '10px 12px', fontSize: 14.5, fontWeight: 800, whiteSpace: 'nowrap', textDecoration: 'none',
                    color: on ? C.ink : C.muted, borderBottom: `3px solid ${on ? C.coral : 'transparent'}`,
                  }}
                >
                  {t.label}
                </Link>
              )
            })}
          </nav>
        </header>
        <main style={{ maxWidth: 1080, margin: '0 auto', padding: '20px 16px 64px', display: 'grid', gap: 16 }}>{children}</main>
      </div>
    </Ctx.Provider>
  )
}
