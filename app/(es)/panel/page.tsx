'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** /panel → /panel/inicio. Sin sesión, el marco ya enseña la pantalla de entrar. */
export default function PanelIndex() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/panel/inicio')
  }, [router])
  return null
}
