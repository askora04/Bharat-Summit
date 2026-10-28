import { useEffect, useState } from 'react'

// Where the processed gallery lives (see scripts/build-gallery.mjs). By default the photos ship with the
// site from public/gallery/ at /gallery; set VITE_GALLERY_URL (e.g. https://photos.example.com/gallery)
// to load them from S3 or a CDN instead.
export const GALLERY_URL = (import.meta.env.VITE_GALLERY_URL || '/gallery').replace(/\/$/, '')

let request
// The manifest is fetched once and shared by every component that asks for it
export function loadGallery() {
  request ??= fetch(`${GALLERY_URL}/gallery.json`)
    .then((r) => {
      if (!r.ok) throw new Error(`gallery.json: HTTP ${r.status}`)
      return r.json()
    })
    .then((g) => {
      const albums = Object.fromEntries(g.albums.map((al) => [al.id, al]))
      const photos = g.photos.map((p) => ({ ...p, caption: p.caption ?? albums[p.album].caption }))
      const byId = Object.fromEntries(photos.map((p) => [p.id, p]))
      return { ...g, albums: g.albums, albumById: albums, photos, featured: g.featured.map((id) => byId[id]).filter(Boolean) }
    })
    .catch((err) => {
      request = null // let a later visit retry
      throw err
    })
  return request
}

// { gallery, error }: gallery is null until loaded
export function useGallery() {
  const [state, setState] = useState({ gallery: null, error: null })
  useEffect(() => {
    let live = true
    loadGallery().then(
      (gallery) => live && setState({ gallery, error: null }),
      (error) => live && setState({ gallery: null, error }),
    )
    return () => { live = false }
  }, [])
  return state
}

export const photoUrl = (photo, width) => `${GALLERY_URL}/${photo.id}-${width}.webp`
export const photoSrcSet = (photo, sizes) => sizes.map((w) => `${photoUrl(photo, w)} ${w}w`).join(', ')

// "Day 2 · 25 April 2025": the summit's day from the album's date (Day 1 = 24 April 2025)
const DATE = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const dayOf = (iso) => Math.round((Date.parse(iso) - Date.parse('2025-04-24')) / 864e5) + 1
export const albumDay = (album) => album.dateEnd
  ? `Day ${dayOf(album.date)}–${dayOf(album.dateEnd)} · ${DATE.formatRange(new Date(album.date), new Date(album.dateEnd))}`
  : `Day ${dayOf(album.date)} · ${DATE.format(new Date(album.date))}`

