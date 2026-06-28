'use client'
import { useState, useEffect, useRef } from 'react'
import { useLang } from '@/components/LangContext'
import { LANG_ORDER, LANG_NAMES, Lang } from '@/lib/i18n'

const LogoSVG = () => (
  <svg width="26" height="32" viewBox="0 0 28 34" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M14 1.5C7.1 1.5 1.5 6.9 1.5 13.6C1.5 22.8 14 32.5 14 32.5C14 32.5 26.5 22.8 26.5 13.6C26.5 6.9 20.9 1.5 14 1.5Z" fill="#FF6A3D" />
    <text x="14" y="19.5" textAnchor="middle" fontFamily="'Bricolage Grotesque',sans-serif" fontWeight="800" fontSize="15" fill="#fff">P</text>
  </svg>
)

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#11607A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
  </svg>
)

export default function Navbar() {
  const { lang, t, setLang, cycleLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    const onResize = () => setIsNarrow(window.innerWidth < 880)
    onScroll(); onResize()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navBg = scrolled ? 'rgba(251,246,238,0.92)' : 'rgba(251,246,238,0)'
  const navShadow = scrolled ? '0 6px 24px rgba(10,42,54,0.08)' : 'none'
  const navBorder = scrolled ? '1px solid rgba(10,42,54,0.07)' : '1px solid transparent'

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 90, background: navBg, boxShadow: navShadow, borderBottom: navBorder, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', transition: 'background .3s,box-shadow .3s,border-color .3s', overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <a href="#hero" onClick={() => setMobileOpen(false)} aria-label="Appark inicio" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LogoSVG />
          <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: '-.5px', color: '#0A2A36' }}>Appark</span>
        </a>

        {!isNarrow && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            {[
              { href: '#como-funciona', label: t.navHow },
              { href: '#sponsors', label: t.navBiz },
              { href: '#sobre-nosotros', label: t.navAbout },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{ textDecoration: 'none', color: '#34525C', fontWeight: 600, fontSize: 15 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0A2A36')}
                onMouseLeave={e => (e.currentTarget.style.color = '#34525C')}>
                {label}
              </a>
            ))}

            <div ref={langRef} style={{ position: 'relative' }}>
              <button onClick={() => setLangOpen(o => !o)} aria-label="Cambiar idioma"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid rgba(10,42,54,.12)', color: '#0A2A36', fontWeight: 700, fontSize: 14, padding: '9px 13px', borderRadius: 11, cursor: 'pointer', fontFamily: "'Manrope',sans-serif" }}>
                <GlobeIcon />
                {lang.toUpperCase()}
                <span style={{ fontSize: 10, color: '#8A9BA2' }}>▾</span>
              </button>
              {langOpen && (
                <div style={{ position: 'absolute', top: 48, right: 0, background: '#fff', border: '1px solid rgba(10,42,54,.1)', borderRadius: 14, boxShadow: '0 16px 40px rgba(10,42,54,.16)', padding: 7, minWidth: 168, zIndex: 100 }}>
                  {LANG_ORDER.map(code => (
                    <button key={code} onClick={() => { setLang(code as Lang); setLangOpen(false) }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: code === lang ? '#FBF6EE' : 'transparent', border: 'none', borderRadius: 9, padding: '10px 12px', cursor: 'pointer', fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 14, color: '#0A2A36', textAlign: 'left' }}
                      onMouseEnter={e => { if (code !== lang) e.currentTarget.style.background = '#F4ECDF' }}
                      onMouseLeave={e => { e.currentTarget.style.background = code === lang ? '#FBF6EE' : 'transparent' }}>
                      <span>{LANG_NAMES[code as Lang]}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#8A9BA2' }}>{code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="#early-access" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FF6A3D', color: '#fff', fontWeight: 700, fontSize: 15, padding: '11px 22px', borderRadius: 13, boxShadow: '0 8px 22px rgba(255,106,61,.32)' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.06)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = '' }}>
              {t.navJoin} <span style={{ fontSize: 16 }}>→</span>
            </a>
          </div>
        )}

        {isNarrow && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={cycleLang} aria-label="Cambiar idioma"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid rgba(10,42,54,.12)', color: '#0A2A36', fontWeight: 700, fontSize: 13, padding: '9px 12px', borderRadius: 10, cursor: 'pointer', fontFamily: "'Manrope',sans-serif" }}>
              <GlobeIcon />
              {lang.toUpperCase()}
            </button>
            <button onClick={() => setMobileOpen(o => !o)} aria-label="Abrir menú"
              style={{ display: 'flex', flexDirection: 'column', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0 8px 8px', marginRight: -8 }}>
              {[0, 1, 2].map(i => <span key={i} style={{ width: 24, height: 2.5, background: '#0A2A36', borderRadius: 2, display: 'block' }} />)}
            </button>
          </div>
        )}
      </div>

      {isNarrow && mobileOpen && (
        <div style={{ background: 'rgba(251,246,238,.98)', borderTop: '1px solid rgba(10,42,54,.08)', padding: '16px 24px 22px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { href: '#como-funciona', label: t.navHow },
            { href: '#sponsors', label: t.navBiz },
            { href: '#sobre-nosotros', label: t.navAbout },
          ].map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMobileOpen(false)}
              style={{ textDecoration: 'none', color: '#0A2A36', fontWeight: 600, fontSize: 17, padding: '12px 4px' }}>
              {label}
            </a>
          ))}
          <a href="#early-access" onClick={() => setMobileOpen(false)}
            style={{ textDecoration: 'none', textAlign: 'center', background: '#FF6A3D', color: '#fff', fontWeight: 700, fontSize: 16, padding: 14, borderRadius: 13, marginTop: 8 }}>
            {t.navJoinList} →
          </a>
        </div>
      )}
    </nav>
  )
}
