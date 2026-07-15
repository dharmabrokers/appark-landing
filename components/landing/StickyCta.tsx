'use client'
import { useEffect, useState } from 'react'
import { useLang } from '@/components/LangContext'

/**
 * Mobile-only sticky CTA. The signup form sits far below the fold after
 * five sections; on phones (where most parking-app traffic is) this keeps
 * the founder offer one tap away at all times. Hides once the user
 * reaches the early-access section so it never covers the form itself.
 */
export default function StickyCta() {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    const ea = document.getElementById('early-access')
    const onScroll = () => {
      const scrolledPastHero = hero ? hero.getBoundingClientRect().bottom < 40 : window.scrollY > 400
      const eaInView = ea ? ea.getBoundingClientRect().top < window.innerHeight * 0.9 : false
      setVisible(scrolledPastHero && !eaInView)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 60,
        padding: '10px 14px calc(10px + env(safe-area-inset-bottom))',
        background: 'rgba(251,246,238,.86)', backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(10,42,54,.10)',
        transform: visible ? 'translateY(0)' : 'translateY(120%)',
        transition: 'transform .28s cubic-bezier(.4,0,.2,1)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}
      className="sticky-cta-mobile"
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0A2A36', lineHeight: 1.15 }}>🎁 {t.stickyTitle}</div>
        <div style={{ fontSize: 11.5, color: '#5C7681', fontWeight: 600 }}>{t.stickySub}</div>
      </div>
      <a
        href="#early-access"
        style={{
          flex: 'none', textDecoration: 'none', background: '#FF6A3D', color: '#fff',
          fontWeight: 800, fontSize: 14, padding: '12px 18px', borderRadius: 12,
          boxShadow: '0 8px 20px rgba(255,106,61,.34)', whiteSpace: 'nowrap',
        }}
      >
        {t.stickyBtn}
      </a>
    </div>
  )
}
