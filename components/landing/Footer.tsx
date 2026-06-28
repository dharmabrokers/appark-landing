'use client'
import { useLang } from '@/components/LangContext'

const LogoSVG = () => (
  <svg width="24" height="29" viewBox="0 0 28 34" aria-hidden="true">
    <path d="M14 1.5C7.1 1.5 1.5 6.9 1.5 13.6C1.5 22.8 14 32.5 14 32.5C14 32.5 26.5 22.8 26.5 13.6C26.5 6.9 20.9 1.5 14 1.5Z" fill="#FF6A3D" />
    <text x="14" y="19.5" textAnchor="middle" fontFamily="'Bricolage Grotesque',sans-serif" fontWeight="800" fontSize="15" fill="#fff">P</text>
  </svg>
)

const InstagramIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" />
  </svg>
)

const TikTokIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="#fff">
    <path d="M16.5 3c.3 2.1 1.5 3.7 3.5 4v2.4c-1.3.1-2.5-.3-3.6-1v5.9c0 3.4-2.6 5.7-5.7 5.7-2.9 0-5.2-2.2-5.2-5.1 0-3 2.4-5.2 5.6-4.9v2.5c-.4-.1-.9-.2-1.3-.1-1.3.1-2.3 1.1-2.2 2.6 0 1.4 1.1 2.5 2.5 2.5 1.5 0 2.5-1.1 2.5-2.7V3h2.4Z" />
  </svg>
)

const socialBtnStyle: React.CSSProperties = {
  width: 40, height: 40, borderRadius: 11, background: 'rgba(255,255,255,.08)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
}

export default function Footer() {
  const { t } = useLang()

  return (
    <footer style={{ background: '#0A2A36', color: '#fff', padding: '64px 24px 36px' }}>
      <div style={{ width: '100%', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between', paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          {/* Col 1: Logo + tagline */}
          <div style={{ flex: '1 1 280px', minWidth: 240 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <LogoSVG />
              <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 21, color: '#fff' }}>Appark</span>
            </div>
            <p style={{ fontSize: 14.5, color: '#9FB6BD', lineHeight: 1.6, margin: 0, maxWidth: 280 }}>{t.footTagline}</p>
          </div>

          {/* Col 2: Legal links */}
          <div style={{ flex: '0 1 auto' }}>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '1px', textTransform: 'uppercase', color: '#6E8990', marginBottom: 16 }}>{t.footLegal}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                { label: t.footPrivacy, href: '/legal/privacidad' },
                { label: t.footTerms, href: '/legal/terminos' },
                { label: t.footCookies, href: '/legal/privacidad#cookies' },
              ].map(({ label, href }) => (
                <a key={label} href={href} style={{ textDecoration: 'none', color: '#C7D7DC', fontSize: 14.5 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#C7D7DC')}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Contact + socials */}
          <div style={{ flex: '0 1 auto' }}>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '1px', textTransform: 'uppercase', color: '#6E8990', marginBottom: 16 }}>{t.footContact}</div>
            <a href="mailto:hola@appark.es" style={{ textDecoration: 'none', color: '#C7D7DC', fontSize: 14.5, display: 'block', marginBottom: 16 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#C7D7DC')}>
              hola@appark.es
            </a>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="#" aria-label="Instagram" style={socialBtnStyle}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.16)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.08)')}>
                <InstagramIcon />
              </a>
              <a href="#" aria-label="TikTok" style={socialBtnStyle}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.16)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.08)')}>
                <TikTokIcon />
              </a>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: 26, textAlign: 'center', fontSize: 13.5, color: '#6E8990' }}>{t.footCopyright}</div>
      </div>
    </footer>
  )
}
