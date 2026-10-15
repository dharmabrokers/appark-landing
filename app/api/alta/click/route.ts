import { NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { rpc } from '@/lib/supabaseRpc'
import { cleanCode, cleanToken } from '@/lib/alta'

/**
 * Un clic en el enlace de alta de un comercial (su embudo en el CRM). No espera a la
 * base: la página no tiene por qué notar nada si falla.
 */
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { code?: unknown; token?: unknown }
  const code = cleanCode(body.code)
  const token = cleanToken(body.token)
  if (code || token) {
    waitUntil(
      rpc('alta_track_click', { p_code: code, p_token: token }).catch((err) => console.error('[alta] click:', err)),
    )
  }
  return new NextResponse(null, { status: 204 })
}
