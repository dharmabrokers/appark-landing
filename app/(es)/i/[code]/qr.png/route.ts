import QRCode from 'qrcode'
import { normalizeInviteCode } from '@/lib/invite'

/**
 * appark.es/i/<código>/qr.png: el QR de la invitación, que la app enseña como
 * imagen (así no necesita una librería nativa y sale por OTA). Apunta a
 * appark.es/i/<código>. Mismo código, misma imagen: se puede cachear mucho.
 */
export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: { code: string } }) {
  const code = normalizeInviteCode(params.code)
  if (!code) return new Response('Not found', { status: 404 })
  const png = await QRCode.toBuffer(`https://appark.es/i/${code}`, {
    type: 'png',
    width: 600,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#0A2A36', light: '#FFFFFF' },
  })
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Robots-Tag': 'noindex',
    },
  })
}
