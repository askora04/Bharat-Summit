import { useEffect, useRef, useState } from 'react'
import { a, Title, Lines, Portrait, Marquee } from './shared.jsx'
import { Link } from '../lib/router.jsx'
import { ALL_SPEAKERS } from '../data/speakersData.js'
import { SpeakerCard } from './SpeakersPage.jsx'
import MediaCoverage from './MediaCoverage.jsx'
import Scroller from '../lib/Scroller.jsx'

const TOPICS = [
  { label: ['Political Justice'], img: 'topic-political-justice.webp', ring: 'ring-1.svg', ink: '#e0705c' },
  { label: ['Economic Justice'], img: 'topic-economic-justice.webp', ring: 'ring-2.svg', ink: '#3c9aa0' },
  { label: ['Social Justice'], img: 'topic-social-justice.webp', ring: 'ring-3.svg', ink: '#d39220' },
  { label: ['Technology, Cloud', 'Capitalism and AI'], img: 'topic-technology-ai.webp', ring: 'ring-4.svg', ink: '#e0566a' },
  { label: ['Security, Multilateralism', 'and Geopolitics'], img: 'topic-security.webp', ring: 'ring-5.svg', ink: '#2f9fb3' },
  { label: ['India and the World'], img: 'topic-india-world.webp', ring: 'ring-6.svg', ink: '#d68f24' },
]

// Real posts, shown with each platform's own embed (see SocialEmbed)
const POSTS = [
  { platform: 'X', url: 'https://x.com/BharatSummit_25/status/1917447562639876256' },
  { platform: 'Instagram', url: 'https://www.instagram.com/p/DI6Ua6TOjhS/' },
  { platform: 'Facebook', url: 'https://www.facebook.com/photo?fbid=122109985046838327&set=a.122099998124838327' },
]

const HASHTAGS = ['#BharatSummit', '#GlobalJustice', '#InclusiveFuture', '#TelanganaGlobal', '#YouthForChange']

const FACTS = [
  ['Date', 'NOV 13 – 14, 2026'],
  ['Venue', 'HICC, Hyderabad'],
]

const DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=17.4730,78.3740'

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

// Each platform's embed script, loaded once, the first time a post needs it
const scripts = {}
const loadScript = (src) => (scripts[src] ??= new Promise((resolve, reject) => {
  const el = document.createElement('script')
  el.src = src
  el.async = true
  el.onload = resolve
  el.onerror = reject
  document.body.append(el)
}))

// One post in its platform's official embed. X and Instagram turn a blockquote into a self-sizing frame;
// Facebook's post plugin is a plain frame. Until a frame loads, or if it's blocked, the link to the post shows.
// The embeds (and the platforms' scripts) load only once the section is near the screen (`load`, from Posts).
// A clear layer over the post (.post-cover) is the page's own: the wheel, a trackpad, a drag or a swipe over a
// post scroll the page and the row as anywhere else (the platforms' frames would keep them), and a click opens
// the post on its platform in a new tab.
function SocialEmbed({ platform, url, load }) {
  const box = useRef(null)
  useEffect(() => {
    if (!load) return
    if (platform === 'X') {
      loadScript('https://platform.twitter.com/widgets.js').then(() => window.twttr?.widgets.load(box.current), () => {})
    } else if (platform === 'Instagram') {
      loadScript('https://www.instagram.com/embed.js').then(() => window.instgrm?.Embeds.process(), () => {})
    }
  }, [platform, load])

  const fallback = <a href={url} target="_blank" rel="noopener noreferrer" tabIndex={-1}>View this post on {platform}</a>
  return (
    <div className="post-embed" ref={box}>
      {platform === 'X' && <blockquote className="twitter-tweet" data-dnt="true">{fallback}</blockquote>}
      {platform === 'Instagram' && (
        <blockquote className="instagram-media" data-instgrm-permalink={url} data-instgrm-version="14" data-instgrm-captioned>
          {fallback}
        </blockquote>
      )}
      {platform === 'Facebook' && load && (
        <iframe title="Bharat Summit on Facebook" loading="lazy" allow="encrypted-media; clipboard-write" tabIndex={-1}
          src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=350&height=560`} />
      )}
      <a className="post-cover" href={url} target="_blank" rel="noopener noreferrer"
        aria-label={`View this post on ${platform} (opens in a new tab)`} />
    </div>
  )
}

// The posts in a row scrolled sideways by hand (Scroller, src/lib): a swipe, the wheel or a trackpad, a mouse drag,
// or the dots below, over the posts too (SocialEmbed's cover). The dots show while
// the posts don't all fit (always, with the desktop's 460px cards and on phones).
function Posts() {
  const wrap = useRef(null)
  const [load, setLoad] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLoad(true); io.disconnect() } }, { rootMargin: '800px 0px' })
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={wrap}>
    <Scroller className="posts" rowClassName="card-row" label="Bharat Summit on social media"
      dots={POSTS.map((p) => `Show the ${p.platform} post`)}>
      {POSTS.map((p) => <SocialEmbed key={p.platform} {...p} load={load} />)}
    </Scroller>
    </div>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      {/* the banner video, sized to its own frame; the photo shows until it starts. Bump ?v= in the src when the
          video is replaced: /videos/ files are cached for a week (vercel.json) */}
      <video className="hero-img" src="/videos/about-banner.mp4?v=3" poster="/assets/about-banner-poster.webp"
        autoPlay muted loop playsInline preload="auto" aria-hidden />
      <h1 className="sr-only">Bharat Summit 2026</h1>
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
            At a pivotal moment in global affairs, the Government of Telangana is convening the second <strong>Bharat Summit</strong> in Hyderabad, Telangana on November 13-14, 2026. Under the theme “Forging a New World,” the Summit builds on the inaugural 2025 edition, and commemorates both the 80th anniversary of India's Independence and the 137th birth anniversary of India's first Prime Minister, Jawaharlal Nehru.
          </p>
          <p className="lede about-lede">
            The Bharat Summit seeks to strengthen partnerships between the Global South and Global North, and provide a platform for progressive forces to collectively forge a just and representative international order. Guided by the enduring Nehruvian conviction that the world must be united through Maitri (friendship), Karuna (compassion), Satya (truth) and Vasudhaiva Kutumbakam (the world is one family), the Summit strives to champion a global vision rooted in peace, shared prosperity and the fullness of life for all peoples. To advance this vision, the Bharat Summit brings together progressive political leaders, policymakers, thinkers, academics, business leaders and civil society representatives from across the world to deliberate on the defining challenges of our time. It also seeks to articulate an alternative vision of India's role in shaping a new global compact, founded on solidarity, sovereign equality and equitable development.
          </p>
          <div className="stats">
            <Stat img="about-parties.webp" value="100+" label={['Progressive parties']} />
            <span className="stats-divider" />
            <Stat img="about-delegates.webp" value="500+" label={['Delegates from across', 'the world']} />
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
            <Marquee className="speakers" drag clickableCopy items={ALL_SPEAKERS.slice(0, 10)} render={(s, copy, i) => <SpeakerCard speaker={s} index={i} copy={copy === 1} className="sp-card-row" />} />
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
          <Posts />
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

