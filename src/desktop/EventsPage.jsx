import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGallery, photoUrl, photoSrcSet } from '../lib/gallery.js'
import { Title, TriBar } from './shared.jsx'
import { MonumentHero } from './SpeakersPage.jsx'
import EventVideos from './EventVideos.jsx'
import './events.css'

// The only albums offered as filters, besides "All photos"
const FILTER_ALBUMS = ['day-1', 'day-2', 'final-day', 'bharat-summit-2026']
const PAGE = 24 // photos added per step as the visitor scrolls (divides evenly into 4, 3 and 2 columns)
// Image width per viewport, matching the grid columns in events.css. Every tile is the same 3:2 frame
// (nearly all the photos are 3:2; the few square or upright ones are cropped here and shown whole in
// the full-screen view), so the rows line up.
const GRID_SIZES = '(max-width: 560px) 100vw, (max-width: 900px) 50vw, (max-width: 1180px) 33vw, 300px'

const ICONS = {
  close: <path d="M18 6 6 18M6 6l12 12" />,
  prev: <path d="m15 18-6-6 6-6" />,
  next: <path d="m9 18 6-6-6-6" />,
}
const Icon = ({ name }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>{ICONS[name]}</svg>
)

function Tile({ photo, sizes, order, onOpen }) {
  return (
    <figure className="ev-tile" style={{ '--i': order % PAGE }}>
      <button className="ev-photo" type="button" onClick={onOpen} aria-label={`View photo: ${photo.caption}`}
        style={{ background: photo.color }}>
        <img src={photoUrl(photo, sizes[0])} srcSet={photoSrcSet(photo, sizes.slice(0, 2))} sizes={GRID_SIZES}
          width={photo.w} height={photo.h} alt={photo.caption} loading="lazy" decoding="async" />
      </button>
    </figure>
  )
}

// Full-screen view: arrows / swipe step through the current album, Escape closes
function Lightbox({ photos, index, gallery, onStep, onClose }) {
  const photo = photos[index]
  const closeRef = useRef(null)
  const touch = useRef(null)

  useEffect(() => {
    const opener = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onStep(-1)
      if (e.key === 'ArrowRight') onStep(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      opener?.focus?.()
    }
  }, [onClose, onStep])

  // Fetch the neighbours ahead of time so stepping is instant
  useEffect(() => {
    for (const d of [-1, 1]) new Image().src = photoUrl(photos[(index + d + photos.length) % photos.length], gallery.sizes.at(-1))
  }, [index, photos, gallery.sizes])

  return (
    <div className="ev-lightbox" role="dialog" aria-modal="true" aria-label={photo.caption}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - (touch.current ?? 0)
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1)
      }}>
      <button className="ev-lb-close" ref={closeRef} onClick={onClose} aria-label="Close"><Icon name="close" /></button>
      <button className="ev-lb-step ev-lb-prev" onClick={() => onStep(-1)} aria-label="Previous photo"><Icon name="prev" /></button>
      <button className="ev-lb-step ev-lb-next" onClick={() => onStep(1)} aria-label="Next photo"><Icon name="next" /></button>

      <figure className="ev-lb-figure" key={photo.id}>
        <img src={photoUrl(photo, gallery.sizes.at(-1))} srcSet={photoSrcSet(photo, gallery.sizes.slice(1))} sizes="100vw"
          width={photo.w} height={photo.h} alt={photo.caption} style={{ background: photo.color }} />
      </figure>
    </div>
  )
}

export default function EventsPage() {
  const { gallery, error } = useGallery()
  const [albumId, setAlbumId] = useState('all')
  const [shown, setShown] = useState(PAGE)
  const [open, setOpen] = useState(null) // index into `photos`
  const sentinel = useRef(null)

  const photos = useMemo(() => {
    if (!gallery) return []
    if (albumId !== 'all') return gallery.photos.filter((p) => p.album === albumId)
    // "All" opens with the featured photos (one from across every album), then the rest in album order
    const featured = new Set(gallery.featured)
    return [...gallery.featured, ...gallery.photos.filter((p) => !featured.has(p))]
  }, [gallery, albumId])
  const visible = photos.slice(0, shown)
  const more = photos.length - visible.length

  // Load the next batch when the end of the grid comes near
  useEffect(() => {
    const el = sentinel.current
    if (!el || !more) return
    // not while the footer's contact block is on screen: loading then would push it away after a Contact jump
    const atContact = () => document.getElementById('contact')?.getBoundingClientRect().top < innerHeight
    const io = new IntersectionObserver(([e]) => e.isIntersecting && !atContact() && setShown((s) => s + PAGE), { rootMargin: '800px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [more, shown])

  const pick = (id) => { setAlbumId(id); setShown(PAGE) }
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), [photos.length])

  return (
    <>
      <MonumentHero kicker="BHARAT SUMMIT" title="SUMMIT GALLERY">
        <p>A glimpse into the ideas, conversations, and people shaping a stronger, smarter India.</p>
      </MonumentHero>

      {/* Videos get their own band, ahead of the photo gallery */}
      <EventVideos />

      <main className="ev-page" id="gallery">
        <div className="ev-photos-head">
          <TriBar />
          <Title light="PHOTO" bold="GALLERY" />
        </div>
        {gallery && (
          <div className="ev-albums" role="group" aria-label="Albums">
            {[{ id: 'all', title: 'All photos' }, ...FILTER_ALBUMS.map((id) => gallery.albumById[id]).filter(Boolean)].map((al) => (
              <button key={al.id} type="button" className="ev-album" aria-pressed={albumId === al.id} onClick={() => pick(al.id)}>
                {al.title}
              </button>
            ))}
          </div>
        )}

        {error && <p className="ev-status">The gallery couldn’t be loaded right now. Please try again in a moment.</p>}

        <div className="ev-gallery" aria-busy={!gallery && !error}>
          {gallery
            ? visible.map((p, index) => (
                <Tile key={p.id} photo={p} sizes={gallery.sizes} order={index}
                  onOpen={() => setOpen(index)} />
              ))
            : !error && Array.from({ length: 8 }, (_, i) => <div className="ev-skeleton" key={i} aria-hidden />)}
        </div>

        {more > 0 && (
          <div className="ev-more" ref={sentinel}>
            <button type="button" className="ev-more-btn" onClick={() => setShown((s) => s + PAGE)}>
              Show more photos <span>{more} more</span>
            </button>
          </div>
        )}
      </main>

      {open !== null && photos[open] && (
        <Lightbox photos={photos} index={open} gallery={gallery} onStep={step} onClose={close} />
      )}
    </>
  )
}
