'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/components/LangContext'
import { LANG_ORDER, LANG_NAMES } from '@/lib/i18n'

/**
 * La cabecera y el fondo de las páginas de alta: el logo (vuelve a la home) y el
 * idioma. Sin el menú de la home, cuyos enlaces son anclas de esa página.
 */
export default function AltaShell({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useLang()
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#FBF6EE 0%,#F8FAFB 60%)' }}>
      <header style={{ maxWidth: 1080, margin: '0 auto', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Link href="/" aria-label="Appark" style={{ display: 'inline-flex' }}>
          <Image src="/logo-appark-logotipo.png" alt="Appark" width={0} height={0} sizes="120px" priority style={{ display: 'block', height: 30, width: 'auto' }} />
        </Link>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#11607A' }}>
          <span className="sr-only">Idioma</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as typeof lang)}
            aria-label="Idioma / Language"
            style={{ border: '1.5px solid rgba(10,42,54,.14)', borderRadius: 10, padding: '7px 10px', background: '#fff', color: '#0A2A36', fontWeight: 700, fontSize: 13 }}
          >
            {LANG_ORDER.map((l) => (
              <option key={l} value={l}>{LANG_NAMES[l]}</option>
            ))}
          </select>
        </label>
      </header>
      <main style={{ padding: '8px 16px 72px' }}>{children}</main>
    </div>
  )
}
