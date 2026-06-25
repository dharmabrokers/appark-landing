'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TRANS, LANG_ORDER, Lang, Translations } from '@/lib/i18n'

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

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('appark_lang') as Lang
      if (saved && TRANS[saved]) {
        setLangState(saved)
        document.documentElement.lang = saved
      }
    } catch (_) {}
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    try { localStorage.setItem('appark_lang', l) } catch (_) {}
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
