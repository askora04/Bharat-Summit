import { useEffect, useRef, useState } from 'react'
import { a, Title, Lines, Portrait, Letters, Marquee } from './shared.jsx'
import { Link } from './router.jsx'
import { SPEAKERS } from './speakersData.js'
import MediaCoverage from './MediaCoverage.jsx'

const TOPICS = [
  { label: ['Political Justice'], img: 'topic-youth.webp', ring: 'ring-1.svg', ink: '#e0705c' },
  { label: ['Economic Justice'], img: 'topic-sustainable.webp', ring: 'ring-2.svg', ink: '#3c9aa0' },
  { label: ['Social Justice'], img: 'topic-gender.webp', ring: 'ring-3.svg', ink: '#d39220' },
  { label: ['Technology, Cloud', 'Capitalism and AI'], img: 'topic-technology.webp', ring: 'ring-4.svg', ink: '#e0566a' },
  { label: ['Security, Multilateralism', 'and Geopolitics'], img: 'topic-multilateralism.webp', ring: 'ring-5.svg', ink: '#2f9fb3' },
  { label: ['India and the World'], img: 'topic-climate.webp', ring: 'ring-6.svg', ink: '#d68f24' },
]

// Eight dots evenly round the ring's 14px margin
function TopicDots({ ink }) {
  return (
    <svg className="topic-dots" viewBox="0 0 252 252" aria-hidden fill={ink}>
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx="126" cy="7" r="1.4" transform={`rotate(${i * 45 + 22.5} 126 126)`} />
      ))}
    </svg>
  )
}

// Social post thumbnails are crops of one sprite image, positioned exactly as in the design.
const POSTS = [
  {
    platform: 'X', color: '#006bd6', handle: '@BharatSummit · Apr 25',
    text: ['A global dialogue for a more inclusive, just and sustainable world.'],
    stats: '♡ 120    ⟳ 420    ♡ 2.1K',
    crop: { height: '1097.14%', left: '-20.22%', top: '-659.29%', width: '369.68%' },
  },
  {
    platform: 'Instagram', color: '#cf2677', handle: '@bharatsummit',
    text: ['Bringing together leaders, thinkers and changemakers for a better tomorrow.', '#BharatSummit #Telangana #YouthForChange'],
    stats: '♥ 1.5K    ◯ 80',
    crop: { height: '1129.41%', left: '-151.94%', top: '-680.15%', width: '396.9%' },
  },
  {
    platform: 'Facebook', color: '#006bd6', handle: '@BharatSummit',
    text: ['Join the conversation on global justice, democracy and sustainable development.', '#BharatSummit'],
    stats: '♥ 2.3K    ◯ 200    ↗ 450',
    crop: { height: '1074.13%', left: '-266.17%', top: '-646.85%', width: '384.96%' },
  },
]

const HASHTAGS = ['#BharatSummit', '#GlobalJustice', '#InclusiveFuture', '#TelanganaGlobal', '#YouthForChange']

const FACTS = [
  ['Date', 'NOV 12 – 14, 2026'],
  ['Venue', 'HICC, Hyderabad'],
]

const DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=17.4730,78.3740'

// Platform marks in their brand colours
const BRAND_ICONS = {
  X: (
    <svg viewBox="0 0 24 24" aria-hidden><rect width="24" height="24" rx="6" fill="#000" />
      <path fill="#fff" d="M16.8 5h2.4l-5.3 6 6.2 8.1h-4.8l-3.8-4.9-4.3 4.9H4.8l5.6-6.4L4.4 5h4.9l3.4 4.5zm-.8 12.7h1.3L8.7 6.3H7.3z" /></svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <defs>
        <radialGradient id="ig-grad" cx="0.3" cy="1.05" r="1.25">
          <stop offset="0" stopColor="#fdf497" /><stop offset=".1" stopColor="#fdf497" /><stop offset=".45" stopColor="#fd5949" />
          <stop offset=".6" stopColor="#d6249f" /><stop offset=".9" stopColor="#285aeb" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <rect x="5.5" y="5.5" width="13" height="13" rx="4" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="15.9" cy="8.1" r="1" fill="#fff" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="12" fill="#1877f2" />
      <path fill="#fff" d="M13.3 24v-8.4h2.8l.4-3.3h-3.2v-2.1c0-.9.3-1.6 1.6-1.6h1.7V5.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.1v3.3h2.8V24z" /></svg>
  ),
}

// Counts up from zero the first time the element scrolls into view
function useCountUp(target, duration = 1800) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      setStarted(true)
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setValue(target)
      const t0 = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration)
        setValue(Math.round(target * (1 - (1 - p) ** 3)))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(ref.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [target, duration])
  return [ref, value, started]
}

function Crop({ crop, className }) {
  return (
    <div className={`crop ${className}`}>
      <img src={a('media-sprite.webp')} alt="" style={crop} />
    </div>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <img className="hero-img" src="/assets/about-hero.webp" alt="" />
      <div className="hero-content">
        <div className="announcement">
          <h1 className="announcement-title"><Letters text="BHARAT SUMMIT 2026" /></h1>
        </div>
      </div>
    </section>
  )
}

function Stat({ img, value, label }) {
  const target = parseInt(value, 10)
  const [ref, count, started] = useCountUp(target)
  return (
    <div className={`stat ${started ? 'is-on' : ''}`} ref={ref}>
      <div className="stat-graphic">
        <img className="stat-accent" src={a('circular-accents.svg')} width="260" height="260" alt="" />
        <img className="stat-img" src={a(img)} width="200" height="200" alt="" />
      </div>
      <div>
        <p className="stat-value" aria-label={value}>{count}{value.replace(/\d+/, '')}</p>
        <p className="stat-label"><Lines lines={label} /></p>
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      <Hero />

      <main>
        <section className="about reveal" id="about">
          <Title light="ABOUT" bold="US" />
          <p className="lede about-lede">
            The <strong>Bharat Summit</strong> is a global platform bringing together progressive political leaders, policymakers, thinkers, business leaders, and activists to address challenges facing democracy, global governance, and social and economic justice. Hosted by the Government of Telangana in Hyderabad, it aims to develop alternative solutions to rising populism and inequality, strengthen democratic institutions, empower citizens, and build a more just and inclusive world, while shaping India’s role in the global progressive movement.
          </p>
          <div className="stats">
            <Stat img="parties.webp" value="100+" label={['Progressive parties']} />
            <span className="stats-divider" />
            <Stat img="delegates.webp" value="500+" label={['Delegates from across', 'the world']} />
          </div>
        </section>

        <section className="panel reveal" id="about-topics">
          <Title light="PANEL" bold="DISCUSSION" />
          <div className="topics">
            {TOPICS.map((t, i) => (
              <div className="topic" key={t.img} style={{ '--i': i, '--ink': t.ink }}>
                <div className="topic-graphic">
                  <span className="topic-halo" aria-hidden />
                  <span className="topic-orbit" aria-hidden />
                  <img className="topic-ring" src={a(t.ring)} width="252" height="252" alt="" />
                  <img className="topic-img" src={a(t.img)} width="224" height="224" alt="" />
                  <TopicDots ink={t.ink} />
                </div>
                <h3><Lines lines={t.label} /></h3>
              </div>
            ))}
          </div>
        </section>

        <section className="leaders reveal" id="about-leaders">
          <Title light="WORLD" bold="LEADERS, VISIONARIES, CHANGEMAKERS" />
          <p className="lede">Global leaders, renowned scholars, and change makers from across the world.</p>
          <div className="container">
            <Marquee className="speakers" items={SPEAKERS.slice(0, 10)} render={(s) => (
              <Link className="speaker" to={`/speakers/${s.id}`}
                aria-label={`${s.name}, ${s.role}. View profile`}>
                <Portrait bg={s.bg} src={s.img} className="speaker-portrait">{!s.img && <span className="sp-initials">{s.initials}</span>}</Portrait>
                <span className="speaker-name">{s.name}</span>
                <span className="speaker-role">{s.role}</span>
                <span className="speaker-country">{s.session.split(':')[0]}</span>
              </Link>
            )} />
          </div>
          <Link className="btn btn-primary leaders-btn" to="/speakers">Click to Know More&nbsp;&nbsp;→</Link>
        </section>

        <MediaCoverage />

        <section className="social reveal" id="about-social">
          <Title light="JOIN" bold="THE CONVERSATION" />
          <p className="lede">Stay updated with the latest from Bharat Summit across social platforms.</p>
          <div className="container hashtags-box">
            {/* listed twice so one set always fills the box's width */}
            <Marquee className="hashtags" items={[...HASHTAGS, ...HASHTAGS]} secs={3} render={(h) => <span className="hashtag">{h}</span>} />
          </div>
          <div className="container card-row">
            {POSTS.map((p) => (
              <article className="post" key={p.platform}>
                <div className="post-head">
                  <span className="post-platform" style={{ color: p.color }}>
                    <span className="post-icon">{BRAND_ICONS[p.platform]}</span>{p.platform}
                  </span>
                  <div>
                    <h3>Bharat Summit</h3>
                    <p className="post-handle">{p.handle}</p>
                  </div>
                </div>
                <p className="post-text"><Lines lines={p.text} /></p>
                <Crop crop={p.crop} className="post-img" />
                <p className="post-stats">{p.stats}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="venue reveal" id="about-venue">
          <Title light="THE" bold="VENUE" />
          <p className="lede venue-lede">
            <span className="line">Join us at the Hyderabad International Convention Centre (HICC),</span>
            <span className="line">a world-class venue for global dialogue and collaboration.</span>
          </p>
          <div className="container venue-grid">
            <div className="venue-media">
              <img className="venue-photo" src={a('hicc.webp')} alt="Hyderabad International Convention Centre" />
              <div className="venue-map">
                <img src={a('map.webp')} alt="Map of HICC, Hyderabad" />
                <span className="map-badge">
                  <img src={a('pin-small.svg')} width="12" height="12" alt="" />
                  HICC, Hyderabad
                </span>
                <span className="map-attrib">© OpenStreetMap contributors</span>
              </div>
            </div>

            <div className="venue-panel">
              <div className="venue-header">
                <span className="venue-icon"><img src={a('building.svg')} width="26" height="26" alt="" /></span>
                <div>
                  <p className="eyebrow">Summit Venue</p>
                  <h3><Lines lines={['Hyderabad International', 'Convention Centre (HICC)']} /></h3>
                </div>
              </div>
              <hr className="divider strong" />
              <div className="address">
                <img src={a('pin.svg')} width="18" height="18" alt="" />
                <div>
                  <h4>Address</h4>
                  <address>
                    <Lines lines={['Novotel & HICC Complex, Near HITEC City', 'Kondapur, Hyderabad', 'Telangana 500081, India']} />
                  </address>
                </div>
              </div>
              <hr className="divider" />
              <p className="coords">
                <img src={a('crosshair.svg')} width="16" height="16" alt="" />
                17.4730° N, 78.3740° E · HITEC City, Hyderabad
              </p>
              <hr className="divider" />
              <div className="landmarks">
                <p className="eyebrow eyebrow-sm">Map landmarks</p>
                <ul>
                  {['Novotel & HICC Complex', 'HITEX Exhibition Centre', 'Kotla Cheruvu'].map((l) => (
                    <li key={l}><img src={a('navigation.svg')} width="14" height="14" alt="" />{l}</li>
                  ))}
                </ul>
              </div>
              <hr className="divider landmarks-end" />
              <div className="venue-actions">
                <a className="btn btn-primary" href={DIRECTIONS_URL} target="_blank" rel="noreferrer">Get Directions&nbsp;&nbsp;→</a>
              </div>
            </div>
          </div>

          <dl className="container facts">
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </>
  )
}

