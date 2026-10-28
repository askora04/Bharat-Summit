import { useState } from 'react'
import { a, TriBar } from './shared.jsx'
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
      aria-label={`${speaker.name}${speaker.moderator ? ' (Moderator)' : ''}${speaker.role ? `, ${speaker.role}` : ''}. View profile`}>
      <Initials speaker={speaker} className="sp-card-photo" />
      <span className="sp-card-body">
        <span className="sp-card-name">{speaker.name}</span>
        {speaker.moderator && <span className="sp-mod">Moderator</span>}
        {speaker.role && <span className="sp-card-role">{speaker.role}</span>}
      </span>
    </Link>
  )
}

// One speaker: initials panel on the left, name, title, session and bio on the right
function SpeakerDetail({ speaker }) {
  return (
    // data-scroll-start: the page opens here, the profile right under the header (see App)
    <main className="sp-detail" data-scroll-start>
      <Link className="sp-back" to="/speakers">
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
      <section className="sp-hero">
        <div className="sp-hero-monuments" aria-hidden>
          {HERO_MONUMENTS.map(([folder, id, height]) => (
            <img key={id} src={a(`footer/${folder}/${id}-hero.webp`)} alt="" style={{ height }} />
          ))}
        </div>
        <div className="sp-hero-copy">
          <p className="sp-hero-kicker">BHARAT SUMMIT 2026</p>
          <h1>SPEAKERS</h1>
        </div>
      </section>

      {speaker ? <SpeakerDetail speaker={speaker} /> : (
        <main className="sp-page" id="speakers">
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
                  <div className="sp-grid">
                    {se.speakers.map((sp, i) => <SpeakerCard key={sp.id} speaker={sp} index={i} />)}
                  </div>
                </section>
              ))}
            </section>
          ))}
        </main>
      )}
    </>
  )
}
