import { NextResponse } from 'next/server'
import { rpc } from '@/lib/supabaseRpc'
import { cleanToken } from '@/lib/alta'

/**
 * Los datos para rellenar el formulario cuando el enlace trae el token de una ficha
 * (?t=...). Solo los del negocio; sin token válido, nada.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const token = cleanToken(new URL(req.url).searchParams.get('t'))
  if (!token) return NextResponse.json(null)
  try {
    const data = await rpc<Record<string, unknown> | null>('alta_prefill', { p_token: token })
    return NextResponse.json(data ?? null, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('[alta] prefill:', err)
    return NextResponse.json(null)
  }
}
