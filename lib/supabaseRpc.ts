/**
 * Llamar a una función de Supabase con la clave pública (anon), desde el servidor.
 *
 * Las funciones del alta (migración 0093 de Appark-main) están abiertas a anon a
 * propósito y hacen ellas las comprobaciones: alta_prefill, alta_register y
 * alta_track_click. Ninguna devuelve más que los datos del propio negocio.
 */
export class RpcError extends Error {}

export async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new RpcError('SUPABASE_NOT_CONFIGURED')
  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify(args),
    cache: 'no-store',
  })
  const json = (await res.json().catch(() => null)) as unknown
  if (!res.ok) {
    const message = (json as { message?: string } | null)?.message ?? `RPC ${fn} ${res.status}`
    throw new RpcError(message)
  }
  return json as T
}
