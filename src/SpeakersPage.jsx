import { useEffect, useRef, useState } from 'react'
import { a, TriBar, measureCover } from './shared.jsx'
import { Link, usePath } from './router.jsx'
import { PARTS, SPEAKERS } from './speakersData.js'
import './speakers.css'

// Footer line art standing along the banner's lower right, out to the edge.
// [folder, id, height in px]: building-only crops (no trees) at half the artwork's size, so they
// keep their true proportions.
const HERO_MONUMENTS = [
  ['landmarks', 'tathagata', 117],
  ['skyline', 'india-gate', 87],
  ['skyline', 'qutub-minar', 184],
  ['landmarks', 'charminar', 120],
]

// Page banner with the monuments along its lower right; the Summit Archives and Schedule pages use it too
export function MonumentHero({ kicker, title, className, children }) {
  const row = useRef(null)
  // the monuments drift after the pointer (-1..1 across the banner); taller ones are "nearer" and move more
  const follow = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    row.current?.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3))
    row.current?.style.setProperty('--my', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3))
  }
  const settle = () => { row.current?.style.setProperty('--mx', 0); row.current?.style.setProperty('--my', 0) }

  return (
    <section className={`sp-hero${className ? ` ${className}` : ''}`} onPointerMove={follow} onPointerLeave={settle}>
      <div className="sp-hero-stars" aria-hidden>
        {[[8, 30], [22, 70], [38, 15], [55, 55], [70, 25], [86, 62], [95, 10]].map(([x, y], s) => (
          <span key={s} style={{ left: `${x}%`, top: `${y}%`, '--s': s }} />
        ))}
      </div>
      <div className="sp-hero-monuments" ref={row} aria-hidden>
        {HERO_MONUMENTS.map(([folder, id, height], i) => (
          <img key={id} src={a(`footer/${folder}/${id}-hero.webp`)} alt=""
            style={{ '--h': `${height}px`, '--i': i, '--depth': Math.round(height / 12) }} />
        ))}
      </div>
      <div className="sp-hero-copy">
        <p className="sp-hero-kicker">{kicker}</p>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  )
}

// The speaker's cut-out photo on a brand colour, or their initials where there's no photo
function Initials({ speaker, className }) {
  return (
    <span className={className} style={{ background: speaker.bg }} aria-hidden>
      <span className="sp-band sp-band-1" />
      <span className="sp-band sp-band-2" />
      <span className="sp-band sp-band-3" />
      {speaker.img ? <img src={speaker.img} alt="" loading="lazy" /> : <span className="sp-initials">{speaker.initials}</span>}
    </span>
  )
}

function SpeakerCard({ speaker, index }) {
  return (
    <Link className="sp-card" style={{ '--i': index % 10 }} to={`/speakers/${speaker.id}`}
      onPointerEnter={measureCover} onFocus={measureCover}
      aria-label={`${speaker.name}${speaker.moderator ? ' (Moderator)' : ''}${speaker.role ? `, ${speaker.role}` : ''}. View profile`}>
      <Initials speaker={speaker} className="sp-card-photo" />
      <span className="sp-card-body">
        <span className="sp-card-name">{speaker.name}</span>
        {speaker.moderator && <span className="sp-mod">Moderator</span>}
      </span>
      {/* on hover: the name with the designation, session and time from the profile, over the card's lower part */}
      <span className="sp-card-body sp-hover" aria-hidden>
        <span className="sp-card-name">{speaker.name}</span>
        {speaker.moderator && <span className="sp-mod">Moderator</span>}
        {speaker.role && <span className="sp-card-role">{speaker.role}</span>}
        {speaker.session && <span className="sp-card-session">{speaker.session}</span>}
        {speaker.when && <span className="sp-card-when">{speaker.when}</span>}
        <span className="sp-more">Click to view more →</span>
      </span>
    </Link>
  )
}

// A session's card row that glides along on its own at a steady pace, like the homepage marquee:
// the cards repeat once, and the row jumps back by one set as it reaches the copy, so the loop is
// seamless. It's a real scrolling row, so visitors can still move it themselves (trackpad, wheel,
// swipe) and it carries on from wherever they leave it. It holds still while the pointer is over it,
// while it has keyboard focus, while a finger is on it, while it's off screen, and for visitors who
// ask for reduced motion. Rows that already fit don't move or repeat.
const GLIDE = 40 // px per second

function AutoScrollRow({ children }) {
  const row = useRef(null)
  const [loop, setLoop] = useState(false)

  // repeat the cards only when one set is wider than the row
  useEffect(() => {
    const el = row.current
    const count = Array.isArray(children) ? children.length : 1
    const measure = () => {
      const card = el.firstElementChild
      if (!card) return
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0
      setLoop(count * card.getBoundingClientRect().width + (count - 1) * gap > el.clientWidth + 1)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [children])

  useEffect(() => {
    const el = row.current
    if (!loop || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let visible = false, touching = false, last = 0, pos = el.scrollLeft, written = pos, prev = 0, frame
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(el)
    const down = () => { touching = true }
    const up = () => { touching = false; last = performance.now() }
    const wheel = () => { last = performance.now() }
    const events = [['touchstart', down], ['touchend', up], ['touchcancel', up], ['wheel', wheel]]
    events.forEach(([t, f]) => el.addEventListener(t, f, { passive: true }))

    const tick = (now) => {
      frame = requestAnimationFrame(tick)
      const dt = prev ? Math.min(now - prev, 100) / 1000 : 0
      prev = now
      // the visitor scrolled it themselves: carry on from there
      if (Math.abs(el.scrollLeft - written) > 1) pos = el.scrollLeft
      written = el.scrollLeft
      // hold off while they're on it, and for a moment after, so a swipe's momentum plays out
      if (!visible || document.hidden || touching || now - last < 800 || el.matches(':hover') || el.querySelector(':focus-visible')) return
      // one set's width: how far the copy's first card sits from the first card
      const set = el.lastElementChild.firstElementChild.offsetLeft - el.firstElementChild.offsetLeft
      pos += GLIDE * dt
      if (pos >= set) pos -= set
      el.scrollLeft = pos
      written = el.scrollLeft
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      events.forEach(([t, f]) => el.removeEventListener(t, f))
    }
  }, [loop])

  return (
    <div className="sp-grid sp-grid-auto" ref={row}>
      {children}
      {/* the repeat: out of the tab order and hidden from screen readers */}
      {loop && <div className="sp-grid-copy" inert aria-hidden>{children}</div>}
    </div>
  )
}

// Sparkles for the page margins, [x %, y %] in each side's strip: left side, then right side
const SIDE_STARS = [
  [[30, 8], [70, 20], [20, 34], [60, 46], [35, 60], [75, 70], [25, 84], [55, 94]],
  [[65, 12], [25, 24], [70, 38], [40, 50], [80, 62], [30, 74], [65, 86], [35, 96]],
]

// One speaker: initials panel on the left, name, title, session and bio on the right
function SpeakerDetail({ speaker }) {
  return (
    // data-scroll-start: the page opens here, the profile right under the header (see App)
    <main className="sp-detail" data-scroll-start>
      <Link className="sp-back" to="/speakers" back>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to Speakers
      </Link>

      <article className="sp-detail-grid">
        <Initials speaker={speaker} className="sp-detail-photo" />
        <div className="sp-detail-info">
          <h1>{speaker.name}</h1>
          {speaker.moderator && <span className="sp-mod">Moderator</span>}
          {speaker.role && <p className="sp-detail-role">{speaker.role}</p>}
          <p className="sp-detail-country">{speaker.session}</p>
          <p className="sp-detail-when">{speaker.when}</p>
          <span className="sp-detail-rule" aria-hidden />
          {speaker.bio && <p className="sp-detail-bio">{speaker.bio}</p>}
        </div>
      </article>
    </main>
  )
}

export default function SpeakersPage() {
  const id = Number(usePath().split('/')[2])
  const speaker = SPEAKERS.find((s) => s.id === id)
  const [filter, setFilter] = useState('all') // a session title, or every session
  const parts = PARTS.map((p) => ({ ...p, sessions: p.sessions.filter((se) => se.title === filter) }))
    .filter((p) => p.sessions.length)

  return (
    <>
      <MonumentHero kicker="BHARAT SUMMIT 2026" title="SPEAKERS" />

      {speaker ? <SpeakerDetail speaker={speaker} /> : (
        <main className="sp-page" id="speakers">
          {/* sparkles in the white margins either side of the cards, as in the banner; they stay in view while scrolling */}
          {SIDE_STARS.map((stars, side) => (
            <div key={side} className={`sp-side-stars ${side ? 'is-right' : 'is-left'}`} aria-hidden>
              <div className="sp-side-stars-inner">
                {stars.map(([x, y], s) => <span key={s} style={{ left: `${x}%`, top: `${y}%`, '--s': s + side * 3 }} />)}
              </div>
            </div>
          ))}
          {/* Filter bar: pick a session */}
          <div className="sp-filters">
            <label className="sp-select">
              <span className="sr-only">Session</span>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by session">
                <option value="all">All sessions</option>
                {PARTS.map(({ part, sessions }) => (
                  <optgroup key={part} label={part}>
                    {sessions.map((se) => <option key={se.title} value={se.title}>{se.title}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            {filter !== 'all' && <p className="sp-count"><button type="button" onClick={() => setFilter('all')}>Clear</button></p>}
          </div>

          {filter === 'all' ? (
            <div className="sp-grid sp-grid-all">
              {SPEAKERS.map((sp, i) => <SpeakerCard key={sp.id} speaker={sp} index={i} />)}
            </div>
          ) : parts.map(({ part, sessions }) => (
            <section className="sp-part" key={part}>
              <h2 className="sp-part-title"><TriBar />{part}</h2>
              {sessions.map((se) => (
                <section className="sp-session" key={se.title}>
                  <div className="sp-session-info">
                    <p className="sp-session-when">{se.when}</p>
                    <h3>{se.title}</h3>
                    {se.about && <p className="sp-session-about">{se.about}</p>}
                  </div>
                  {/* Part I's rows also scroll on their own; the rest scroll by hand only */}
                  {part === PARTS[0].part ? (
                    <AutoScrollRow>
                      {se.speakers.map((sp, i) => <SpeakerCard key={sp.id} speaker={sp} index={i} />)}
                    </AutoScrollRow>
                  ) : (
                    <div className="sp-grid">
                      {se.speakers.map((sp, i) => <SpeakerCard key={sp.id} speaker={sp} index={i} />)}
                    </div>
                  )}
                </section>
              ))}
            </section>
          ))}
        </main>
      )}
    </>
  )
}
