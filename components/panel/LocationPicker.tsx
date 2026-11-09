'use client'
import { useEffect, useRef, useState } from 'react'
import type { Map as LeafletMap, CircleMarker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button, C, hintStyle, inputStyle, labelStyle, Notice } from './ui'

/**
 * Buscar la dirección y ajustar el punto en el mapa. En la app el punto sale del GPS
 * del móvil; en el ordenador no hay GPS fiable, así que se busca y se afina a mano.
 *
 * Mapa: Leaflet con OpenStreetMap. Buscador: Nominatim de OpenStreetMap, solo al
 * pulsar «Buscar» (su norma de uso pide no lanzar búsquedas mientras se escribe).
 */

const PALMA: [number, number] = [39.5696, 2.6502]

export default function LocationPicker({
  address, onAddress, point, onPoint,
}: {
  address: string
  onAddress: (v: string) => void
  point: { lat: number; lng: number } | null
  onPoint: (p: { lat: number; lng: number }) => void
}) {
  const box = useRef<HTMLDivElement>(null)
  const map = useRef<LeafletMap | null>(null)
  const marker = useRef<CircleMarker | null>(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const onPointRef = useRef(onPoint)
  onPointRef.current = onPoint

  useEffect(() => {
    let cancelled = false
    void import('leaflet').then((L) => {
      if (cancelled || !box.current || map.current) return
      const m = L.map(box.current, { scrollWheelZoom: false }).setView(point ? [point.lat, point.lng] : PALMA, point ? 17 : 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(m)
      const place = (lat: number, lng: number) => {
        if (marker.current) marker.current.setLatLng([lat, lng])
        else marker.current = L.circleMarker([lat, lng], { radius: 10, color: '#fff', weight: 3, fillColor: C.coral, fillOpacity: 1 }).addTo(m)
      }
      if (point) place(point.lat, point.lng)
      m.on('click', (e) => {
        place(e.latlng.lat, e.latlng.lng)
        onPointRef.current({ lat: e.latlng.lat, lng: e.latlng.lng })
      })
      map.current = m
      ;(m as unknown as { _place: typeof place })._place = place
    })
    return () => {
      cancelled = true
      map.current?.remove()
      map.current = null
      marker.current = null
    }
    // Solo al montar: el punto inicial lo pinta el propio mapa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const search = async () => {
    const q = address.trim()
    if (!q) return
    setSearching(true)
    setError('')
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=es&accept-language=es&q=${encodeURIComponent(/palma|mallorca/i.test(q) ? q : `${q}, Palma`)}`
      const res = await fetch(url, { headers: { Accept: 'application/json' } })
      const hits = (await res.json()) as { lat: string; lon: string }[]
      if (!hits.length) {
        setError('No encontramos esa dirección. Marca el punto directamente en el mapa.')
        return
      }
      const lat = Number(hits[0].lat)
      const lng = Number(hits[0].lon)
      const m = map.current as unknown as (LeafletMap & { _place?: (a: number, b: number) => void }) | null
      m?.setView([lat, lng], 18)
      m?._place?.(lat, lng)
      onPoint({ lat, lng })
    } catch {
      setError('No se ha podido buscar. Marca el punto directamente en el mapa.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div>
        <label htmlFor="loc-addr" style={labelStyle}>Dirección</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            id="loc-addr" value={address} onChange={(e) => onAddress(e.target.value)} placeholder="Carrer de Blanquerna 10, Palma" style={inputStyle}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void search() } }}
          />
          <Button kind="ghost" onClick={search} disabled={searching || !address.trim()}>{searching ? 'Buscando…' : 'Buscar'}</Button>
        </div>
      </div>
      <div ref={box} style={{ height: 300, borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.line}`, zIndex: 0 }} />
      <div style={hintStyle}>Pulsa en el mapa justo en la puerta de tu local: es donde saldrá el pin para los conductores.</div>
      {error && <Notice kind="warn">{error}</Notice>}
    </div>
  )
}
