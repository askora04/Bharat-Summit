import { useEffect, useRef, useState } from 'react'
import { a, Title, Portrait, TriBar, dragMarquee } from './shared.jsx'
import { Link } from '../lib/router.jsx'
import './home.css'
import SummitNumbers from './SummitNumbers.jsx'
import { SPEAKERS } from '../data/speakersData.js'
import { SpeakerCard } from './SpeakersPage.jsx'
import OrganizedBy from './OrganizedBy.jsx'
import { useGallery, photoUrl } from '../lib/gallery.js'

const h = (name) => a(`home/${name}`)
const ADDRESS = 'Novotel & HICC Complex, Near HITEC City, Kondapur, Hyderabad, Telangana 500081, India'
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=17.4730,78.3740'

const SPEAKER_ROWS = [SPEAKERS.slice(0, 8), SPEAKERS.slice(8, 16)]

const SBF_URL = 'https://www.samruddhabharat.in/'
// From the foundation's own site (samruddhabharat.in)
const SBF_ABOUT = 'The Samruddha Bharat Foundation (SBF) strives to forge a resurgent & strong India that is a global superpower which is accommodative of all, and is a cosmopolitan beacon of democracy. We do so by reshaping India’s software (transforming individual consciousness, public discourse, popular & social culture & education, as well as forging coalitions) and hardware (reforming policies, institutions & governance, as well as reordering India’s polity, economy & society).'

// Gallery columns: tile heights; photos are numbered on from the previous column
const MOMENT_COLUMNS = [
  [134, 171, 114, 176],
  [128, 128, 120, 139],
  [174, 116, 111, 189],
  [138, 141, 113, 137],
]

const ICONS = {
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  arrowLeft: <path d="M19 12H5M12 19l-7-7 7-7" />,
  arrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
  arrowUpRight: <path d="M7 17 17 7M7 7h10v10" />,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  navigation: <path d="m3 11 19-9-9 19-2-8-8-2z" />,
  copy: <><rect x="8" y="8" width="14" height="14" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" /></>,
  train: <><path d="M8 3.1V7a4 4 0 0 0 8 0V3.1" /><path d="m9 15-1-1M15 15l1-1M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5ZM8 19l-2 3M16 19l2 3" /></>,
}

function Icon({ name, size = 20, strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[name]}
    </svg>
  )
}

function HomeHero() {
  const video = useRef(null)
  // plays once per visit, starting as the page curtain lifts so the opening isn't hidden under it.
  // Bump ?v= in the src when the video is replaced: /videos/ files are cached for a week (vercel.json).
  useEffect(() => {
    const t = setTimeout(() => video.current?.play().catch(() => {}), 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="h-hero" id="top">
      <video className="hero-media" ref={video} src="/videos/hero-banner.mp4?v=8" poster="/assets/home/hero-banner-poster.webp" muted playsInline preload="auto" aria-hidden />
      <h1 className="sr-only">Bharat Summit 2026</h1>
    </section>
  )
}


function Speakers() {
  return (
    <section className="h-speakers reveal" id="speakers">
      <div className="h-speakers-head">
        <div>
          <span className="h-accent" aria-hidden />
          <Title light="OUR" bold="SPEAKERS" />
          <p className="h-sub">Meet the world leaders, distinguished thinkers and influential voices shaping the future of our world.</p>
        </div>
      </div>

      {/* Two rows drifting in opposite directions; each row is rendered twice for a seamless loop */}
      <div className="h-marquee">
        {SPEAKER_ROWS.map((row, r) => (
          <div className={r ? 'h-marquee-row is-reverse' : 'h-marquee-row'} key={r}>
            <div className="h-marquee-track" onPointerDown={dragMarquee}>
              {[0, 1].map((copy) =>
                row.map((sp, i) => (
                  <SpeakerCard key={`${copy}-${i}`} speaker={sp} index={i} copy={copy === 1} className="sp-card-row" />
                )),
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="h-speakers-foot">
        <div className="h-view-all">
          <Link to="/speakers" className="h-btn-pill">View All Speakers <Icon name="arrowUpRight" size={14} /></Link>
        </div>
      </div>

    </section>
  )
}

function CuratedBy() {
  return (
    <section className="h-curated reveal" aria-labelledby="curated-title">
      <TriBar />
      <h2 className="section-title h-two-line" id="curated-title">CURATED BY <strong>SAMRUDDHA BHARAT FOUNDATION</strong></h2>
      <div className="h-curated-card">
        <a className="h-curated-logo" href={SBF_URL} target="_blank" rel="noreferrer">
          <img src={h('sbf-logo.webp')} width="480" height="613" alt="Samruddha Bharat Foundation" />
        </a>
        <div className="h-curated-copy">
          <p>{SBF_ABOUT}</p>
          <a className="h-btn-pill" href={SBF_URL} target="_blank" rel="noreferrer">Visit the Foundation <Icon name="arrowUpRight" size={14} /></a>
        </div>
      </div>
    </section>
  )
}

// The gallery's featured photos; the columns stay empty until it loads
function Moments() {
  const { gallery } = useGallery()
  const moments = (gallery?.featured ?? []).map((p) => ({ src: photoUrl(p, gallery.sizes[0]), alt: p.caption, color: p.color }))

  return (
    <section className="h-moments reveal" id="moments">
      <div className="h-moments-inner">
      <div className="h-moments-copy">
        <TriBar />
        <Title light="MOMENTS FROM" bold="BHARAT SUMMIT" className="h-two-line" />
        <p className="h-sub">A glimpse into the ideas, conversations, and people shaping a stronger, smarter India.</p>
        <Link to="/events" className="h-btn">View Full Gallery <Icon name="arrowRight" size={14} /></Link>
      </div>
      {/* Columns drift up and down alternately; three copies keep each column filled while it loops */}
      <div className="h-gallery" aria-label="Photos from previous editions">
        {MOMENT_COLUMNS.map((heights, c) => {
          const first = c * heights.length
          return (
            <div className={c % 2 ? 'h-gallery-col is-down' : 'h-gallery-col'} key={c} style={{ '--dur': `${48 + c * 7}s` }}>
              <div className="h-gallery-track">
                {moments.length > 0 && [0, 1, 2].map((copy) =>
                  heights.map((ht, i) => {
                    const m = moments[(first + i) % moments.length]
                    return (
                      <img key={`${copy}-${i}`} src={m.src} alt={copy ? '' : m.alt} loading="lazy" decoding="async"
                        style={{ height: ht, background: m.color }} aria-hidden={copy > 0 || undefined} />
                    )
                  }),
                )}
              </div>
            </div>
          )
        })}
      </div>
      </div>
    </section>
  )
}

function Venue() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked: nothing to do */ }
  }

  return (
    <section className="h-venue reveal" id="venue">
      <TriBar className="tribar-lg" />
      <Title light="THE" bold="VENUE" />
      <p className="h-venue-sub">Join us at the heart of innovation.</p>

      <div className="h-venue-grid">
        <figure className="h-venue-photo">
          <img src={h('venue-photo.webp')} alt="Novotel and Hyderabad International Convention Centre" />
          <figcaption>Novotel &amp; HICC Complex · Hyderabad</figcaption>
        </figure>

        <div className="h-venue-card">
          <div className="h-map">
            <img src={h('venue-map.webp')} alt="Map showing HICC near HITEC City, Hyderabad" />
            <p className="h-map-title">Hyderabad International <span>Convention Centre (HICC)</span></p>
            <span className="h-map-attrib">© OpenStreetMap contributors</span>
          </div>
          <div className="h-venue-body">
            <div className="h-addr">
              <Icon name="pin" size={18} strokeWidth={1.75} />
              <div>
                <h3>Novotel &amp; HICC Complex</h3>
                <address>Near HITEC City, Kondapur,<br />Hyderabad, Telangana 500081, India</address>
              </div>
            </div>
            <div className="h-venue-actions">
              <a className="h-maps-btn" href={MAPS_URL} target="_blank" rel="noreferrer">
                <Icon name="navigation" size={18} strokeWidth={1.75} /> Open in Google Maps
                <img src={h('external.webp')} width="14" height="14" alt="" />
              </a>
              <button className="h-copy" onClick={copy} aria-label={copied ? 'Address copied' : 'Copy address'}>
                <Icon name={copied ? 'check' : 'copy'} size={20} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ul className="h-facts">
        <li><span className="h-fact-icon"><Icon name="calendar" size={22} strokeWidth={1.75} /></span>12 – 14 NOV 2026</li>
        <li>
          <a href={MAPS_URL} target="_blank" rel="noreferrer">
            <span className="h-fact-icon"><Icon name="train" size={22} strokeWidth={1.75} /></span>Kondapur, Hyderabad
          </a>
        </li>
      </ul>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <main>
        <SummitNumbers />
        {/* desktop layout, zoomed out to the screen width (mobile.css) */}
        <div className="dz">
          <OrganizedBy />
          <CuratedBy />
          <Speakers />
          <Moments />
          <Venue />
        </div>
      </main>
    </>
  )
}
