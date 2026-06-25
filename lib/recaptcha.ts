export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey || !token) return true // skip if not configured

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    })
    const data = await res.json() as { success: boolean; score?: number }
    return data.success && (data.score === undefined || data.score >= 0.5)
  } catch {
    return true // fail open if reCAPTCHA service is unavailable
  }
}
