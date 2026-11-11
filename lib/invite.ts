/**
 * «Quien avisa no es traidor»: invitaciones entre conductores (Appark-main, 0116).
 *
 * appark.es/i/<código> es el enlace que comparte cada conductor. La web no consulta
 * la base: solo comprueba el formato del código (APK + 6 caracteres, 0055) y lo
 * enseña para que el amigo lo escriba en la app. Quien decide si vale es la base.
 *
 * Sin imports: lo cargan las pruebas de `node --test`.
 */
export function normalizeInviteCode(raw: string | null | undefined): string | null {
  let decoded = raw ?? ''
  try {
    decoded = decodeURIComponent(decoded)
  } catch {
    return null
  }
  const code = decoded.replace(/\s+/g, '').toUpperCase()
  return /^APK[0-9A-Z]{6}$/.test(code) ? code : null
}

/**
 * La descarga: /descargar manda a cada móvil a su tienda y cuenta el clic con
 * c=invita. El código va en utm_content, que no se guarda en los clics pero sí
 * llega a Google Play como referrer (para la atribución automática futura).
 */
export function inviteDownloadPath(code: string): string {
  const p = new URLSearchParams({ c: 'invita', utm_source: 'invita', utm_medium: 'amigo', utm_content: code })
  return `/descargar?${p.toString()}`
}
