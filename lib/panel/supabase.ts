'use client'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * El cliente de Supabase del panel del comercio (appark.es/panel).
 *
 * Con la clave pública, la misma que la app: el comercio solo puede hacer lo que
 * la RLS y las funciones de la base le dejan con su sesión (sponsors.id = su
 * usuario). Esta web no tiene ni necesita la clave privada.
 *
 * storageKey propio para no mezclarse con nada más del navegador.
 */
let client: SupabaseClient | null = null

export function panelDb(): SupabaseClient {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('SUPABASE_NOT_CONFIGURED')
  client = createClient(url, key, {
    auth: {
      storageKey: 'appark-panel-auth',
      persistSession: true,
      autoRefreshToken: true,
      // El enlace del correo vuelve a /panel con la sesión en la URL.
      detectSessionInUrl: true,
    },
  })
  return client
}
