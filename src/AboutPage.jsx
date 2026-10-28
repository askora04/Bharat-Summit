import { useEffect, useRef, useState } from 'react'
import { a, Title, Lines, Portrait, Letters, Marquee } from './shared.jsx'
import { Link } from './router.jsx'
import { SPEAKERS } from './speakersData.js'
import MediaCoverage from './MediaCoverage.jsx'

// Line doodles (24×24 grid, stroked) that orbit in each topic ring's margin
const dot = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`
const DOODLES = {
  hand: 'M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v6M8 11.5a1.5 1.5 0 0 0-3 0V14a7 7 0 0 0 7 7h.5a5.5 5.5 0 0 0 5.5-5.5V10',
  scales: 'M12 3v17M7 20h10M5 7h14M5 7l-3 7M5 7l3 7M19 7l-3 7M19 7l3 7M2 14a3 3 0 0 0 6 0M16 14a3 3 0 0 0 6 0',
  ballot: 'M4 12h16v8H4zM8 12V4h8v8M10 7h4M10 16h4',
  star: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4l-5.3 3 1.2-6-4.5-4.1 6-.7z',
  sun: `${dot(12, 12, 4)}M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4`,
  leaf: 'M5 19C5 10 10 5 20 4c0 10-5 15-15 15zM5 19l8-8',
  tower: 'M5 21V5l7-2v18M12 9h7v12M3 21h18M8 8v0M8 12v0M8 16v0M15.5 13v0M15.5 17v0',
  solar: 'M4 5h16l-2 9H6zM5 9.5h14M10 5l-1 9M14 5l1 9M12 14v5M8 19h8',
  fist: 'M7 11V8a1.5 1.5 0 0 1 3 0v2M10 10V7a1.5 1.5 0 0 1 3 0v3M13 10V7.5a1.5 1.5 0 0 1 3 0V10M16 10a1.5 1.5 0 0 1 3 0v2.5A6.5 6.5 0 0 1 12.5 19h0A5.5 5.5 0 0 1 7 13.5V11M9.5 19v3M15.5 19v3',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  venus: `${dot(12, 9, 5)}M12 14v7M9 18h6`,
  speech: 'M4 5h16v10H9l-5 4zM8 9h8M8 12h5',
  chip: 'M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4',
  cloud: 'M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18z',
  circuit: `M6 12h4l3-5h5M13 17h5M10 12l3 5${dot(4.5, 12, 1.5)}${dot(19.5, 7, 1.5)}${dot(19.5, 17, 1.5)}`,
  pointer: 'M5 3l14 7-6 2-2 6z',
  flag: 'M5 21V3M5 4h12l-2 4 2 4H5',
  globe: `${dot(12, 12, 9)}M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18`,
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  olive: 'M4 20C9 15 14 10 20 4M8 16c-2 0-3-1-3-3 2 0 3 1 3 3zM10 14c0-2 1-3 3-3 0 2-1 3-3 3zM14 10c-2 0-3-1-3-3 2 0 3 1 3 3zM16 8c0-2 1-3 3-3 0 2-1 3-3 3z',
  chakra: `${dot(12, 12, 9)}${dot(12, 12, 1.5)}M12 3v7.5M12 13.5V21M3 12h7.5M13.5 12H21M5.6 5.6l5.3 5.3M13.1 13.1l5.3 5.3M18.4 5.6l-5.3 5.3M10.9 13.1l-5.3 5.3`,
  pin: `M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z${dot(12, 10, 2)}`,
}

const TOPICS = [
  { label: ['Political Justice'], img: 'topic-youth.webp', ring: 'ring-1.svg', ink: '#e0705c', doodles: ['hand', 'ballot', 'scales', 'star'] },
  { label: ['Economic Justice'], img: 'topic-sustainable.webp', ring: 'ring-2.svg', ink: '#3c9aa0', doodles: ['sun', 'tower', 'leaf', 'solar'] },
  { label: ['Social Justice'], img: 'topic-gender.webp', ring: 'ring-3.svg', ink: '#d39220', doodles: ['fist', 'heart', 'venus', 'speech'] },
  { label: ['Technology, Cloud', 'Capitalism and AI'], img: 'topic-technology.webp', ring: 'ring-4.svg', ink: '#e0566a', doodles: ['chip', 'cloud', 'circuit', 'pointer'] },
  { label: ['Security, Multilateralism', 'and Geopolitics'], img: 'topic-multilateralism.webp', ring: 'ring-5.svg', ink: '#2f9fb3', doodles: ['flag', 'globe', 'shield', 'olive'] },
  { label: ['India and the World'], img: 'topic-climate.webp', ring: 'ring-6.svg', ink: '#d68f24', doodles: ['globe', 'chakra', 'leaf', 'pin'] },
]

// Eight doodles (the topic's four, twice) evenly round the ring's 14px margin, a dot between each
function TopicDoodles({ names, ink }) {
  const icons = [...names, ...names]
  return (
    <svg className="topic-doodles" viewBox="0 0 252 252" aria-hidden
      fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons.map((n, i) => (
        <g key={i} transform={`rotate(${i * 45} 126 126)`}>
          <path d={DOODLES[n]} transform="translate(118.5 -0.5) scale(.625)" />
          <circle cx="126" cy="7" r="1.4" fill={ink} stroke="none" transform="rotate(22.5 126 126)" />
        </g>
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
      <div className="hero-bg" aria-hidden />
      <div className="hero-stripes" aria-hidden><span /><span /><span /><span /><span /></div>
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
              <div className="topic" key={t.img} style={{ '--i': i }}>
                <div className="topic-graphic">
                  <img className="topic-ring" src={a(t.ring)} width="252" height="252" alt="" />
                  <img className="topic-img" src={a(t.img)} width="224" height="224" alt="" />
                  <TopicDoodles names={t.doodles} ink={t.ink} />
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

