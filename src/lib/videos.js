import { useEffect, useState } from 'react'

// Where the processed event videos live (see scripts/build-videos.mjs), kept apart from the photos. By
// default they ship with the site from public/videos/ at /videos; set VITE_VIDEOS_URL
// (e.g. https://media.example.com/videos) to load them from S3 or a CDN instead.
export const VIDEOS_URL = (import.meta.env.VITE_VIDEOS_URL || '/videos').replace(/\/$/, '')

let request
function loadVideos() {
  request ??= fetch(`${VIDEOS_URL}/videos.json`)
    .then((r) => {
      if (!r.ok) throw new Error(`videos.json: HTTP ${r.status}`)
      return r.json()
    })
    .then((m) => m.videos)
    .catch((err) => {
      request = null // let a later visit retry
      throw err
    })
  return request
}

// The video list, or null until loaded (and if it can't be, so the section simply stays hidden)
export function useVideos() {
  const [videos, setVideos] = useState(null)
  useEffect(() => {
    let live = true
    loadVideos().then((v) => live && setVideos(v), () => {})
    return () => { live = false }
  }, [])
  return videos
}

export const videoUrl = (v) => `${VIDEOS_URL}/${v.id}.mp4`
export const posterUrl = (v) => `${VIDEOS_URL}/${v.id}.webp`
export const formatDuration = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
