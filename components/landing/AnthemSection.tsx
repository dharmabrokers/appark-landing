'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { useLang } from '@/components/LangContext'

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
)
const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
)

/**
 * The Appark anthem — a fun brand bonus, not a conversion element.
 * Placed after the primary CTA so it never competes with signups.
 *
 * No autoplay anywhere: the <audio> element has no src until the user
 * presses play for the first time, so the 3MB file is never fetched
 * unless someone actually wants to listen.
 */
export default function AnthemSection() {
  const { t } = useLang()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (!loaded) {
      audio.src = '/audio/appark-anthem.mp3'
      setLoaded(true)
    }

    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
  }

  const onTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    setProgress((audio.currentTime / audio.duration) * 100)
  }

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = ratio * audio.duration
  }

  return (
    <section id="escuchanos" style={{ scrollMarginTop: 72, padding: '72px 24px', background: '#FBF6EE' }}>
      <div style={{ width: '100%', maxWidth: 640, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 22,
            background: '#fff', border: '1px solid rgba(10,42,54,.08)', borderRadius: 24,
            padding: '24px 26px', boxShadow: '0 10px 30px rgba(10,42,54,.06)',
          }}
        >
          {/* Cover art */}
          <div style={{ position: 'relative', width: 76, height: 76, borderRadius: 16, overflow: 'hidden', flex: 'none', boxShadow: '0 6px 16px rgba(10,42,54,.15)' }}>
            <Image src="/audio/appark-anthem-cover.jpg" alt="No Donis Mes Voltes — Appark" fill style={{ objectFit: 'cover' }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#FF6A3D', marginBottom: 4 }}>
              {t.anthemEyebrow}
            </div>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 18, color: '#0A2A36', marginBottom: 2 }}>
              {t.anthemTitle}
            </div>
            <div style={{ fontSize: 13, color: '#8A9BA2', fontWeight: 600, marginBottom: 10 }}>
              &ldquo;No Donis Mes Voltes&rdquo; · {t.anthemBy}
            </div>

            {/* Progress bar (click to seek) */}
            <div
              onClick={onSeek}
              style={{ height: 6, borderRadius: 999, background: 'rgba(10,42,54,.08)', cursor: 'pointer', overflow: 'hidden' }}
            >
              <div style={{ height: '100%', width: `${progress}%`, background: '#FF6A3D', borderRadius: 999, transition: playing ? 'width .15s linear' : 'none' }} />
            </div>
          </div>

          {/* Play/pause button */}
          <button
            onClick={togglePlay}
            aria-label={playing ? t.anthemPause : t.anthemPlay}
            style={{
              flex: 'none', width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: '#FF6A3D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 22px rgba(255,106,61,.34)',
            }}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>

        <p style={{ fontSize: 13.5, color: '#8A9BA2', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
          {t.anthemSub}
        </p>

        <audio
          ref={audioRef}
          preload="none"
          onTimeUpdate={onTimeUpdate}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setProgress(0) }}
        />
      </div>
    </section>
  )
}
