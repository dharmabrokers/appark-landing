'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TRANS, LANG_ORDER, Lang, Translations } from '@/lib/i18n'

/**
 * El idioma de la página.
 *
 * Dos modos:
 *
 * - Con `routed` (la portada): cada idioma tiene su URL (/, /ca, /en,
 *   /de). La URL manda: el servidor ya pintó la página en ese idioma, que
 *   es lo que ven Google y los asistentes de IA. Cambiar de idioma navega
 *   a la otra URL. La única excepción es la raíz: si quien entra a
 *   appark.es ya eligió otro idioma en una visita anterior, se le lleva a
 *   su versión. Sólo por esa preferencia guardada, nunca por el idioma del
 *   navegador: el robot de Google navega en inglés, y redirigirlo le
 *   escondería la versión española.
 *
 * - Sin `routed` (el alta de comercios): el de siempre, se cambia en el
 *   sitio y se recuerda en localStorage.
 */

const STORAGE_KEY = 'appark_lang'
const pathFor = (l: Lang) => (l === 'es' ? '/' : `/${l}`)

interface LangContextType {
  lang: Lang
  t: Translations
  setLang: (lang: Lang) => void
  cycleLang: () => void
}

const LangContext = createContext<LangContextType>({
  lang: 'es',
  t: TRANS.es,
  setLang: () => {},
  cycleLang: () => {},
})

export function LangProvider({
  children,
  initialLang = 'es',
  routed = false,
}: {
  children: ReactNode
  initialLang?: Lang
  routed?: boolean
}) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    let saved: Lang | null = null
    try { saved = localStorage.getItem(STORAGE_KEY) as Lang | null } catch (_) {}
    if (!saved || !TRANS[saved]) return

    if (routed) {
      if (initialLang === 'es' && saved !== 'es') {
        window.location.replace(pathFor(saved) + window.location.search + window.location.hash)
      }
      return
    }

    setLangState(saved)
    try { document.documentElement.lang = saved } catch (_) {}
  }, [routed, initialLang])

  function setLang(l: Lang) {
    try { localStorage.setItem(STORAGE_KEY, l) } catch (_) {}
    if (routed) {
      if (l !== lang) window.location.assign(pathFor(l) + window.location.search + window.location.hash)
      return
    }
    setLangState(l)
    try { document.documentElement.lang = l } catch (_) {}
  }

  function cycleLang() {
    const i = LANG_ORDER.indexOf(lang)
    setLang(LANG_ORDER[(i + 1) % LANG_ORDER.length])
  }

  return (
    <LangContext.Provider value={{ lang, t: TRANS[lang], setLang, cycleLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
