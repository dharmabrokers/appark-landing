'use client'
import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('appark_cookie_consent')
    if (!consent) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => setShow(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('appark_cookie_consent', 'all')
    setShow(false)
  }

  const handleEssentialOnly = () => {
    localStorage.setItem('appark_cookie_consent', 'essential')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#0A2A36',
        borderTop: '1px solid rgba(255,255,255,.1)',
        padding: '20px 24px',
        zIndex: 9999,
        boxShadow: '0 -4px 12px rgba(0,0,0,.15)',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <p
          style={{
            flex: '1 1 300px',
            margin: 0,
            fontSize: 14.5,
            lineHeight: 1.5,
            color: '#C7D7DC',
            fontFamily: 'var(--font-body), system-ui, sans-serif',
          }}
        >
          Usamos cookies esenciales para el funcionamiento del sitio. Al aceptar, también
          permites cookies de análisis para mejorar la experiencia.{' '}
          <a
            href="/legal/privacidad#cookies"
            style={{
              color: '#1FB877',
              textDecoration: 'underline',
            }}
          >
            Más información
          </a>
        </p>
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={handleEssentialOnly}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,.2)',
              background: 'transparent',
              color: '#C7D7DC',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-body), system-ui, sans-serif',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,.08)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)'
            }}
          >
            Solo esenciales
          </button>
          <button
            onClick={handleAccept}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: 'none',
              background: '#1FB877',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-body), system-ui, sans-serif',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1AA563'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1FB877'
            }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
