import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Title, TriBar } from './shared.jsx'
import { useVideos, videoUrl, posterUrl, formatDuration } from '../lib/videos.js'
import Scroller from '../lib/Scroller.jsx'
import './videos.css'

const ICONS = {
  close: <path d="M18 6 6 18M6 6l12 12" />,
  prev: <path d="m15 18-6-6 6-6" />,
  next: <path d="m9 18 6-6-6-6" />,
  play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />,
}
const Icon = ({ name, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>{ICONS[name]}</svg>
)

// The poster, with a play button, until the visitor plays it; then the video in the same frame.
// Nothing but the poster downloads until then.
function Player({ video, playing, onPlay, className, children, tabIndex }) {
  return (
    <div className={`vd-frame ${className}`} style={{ aspectRatio: `${video.w} / ${video.h}`, background: video.color }}>
      {playing ? (
        <video key={video.id} src={videoUrl(video)} poster={posterUrl(video)} controls autoPlay playsInline />
      ) : (
        <button type="button" className="vd-poster" onClick={onPlay} tabIndex={tabIndex}
          aria-label={`Play video: ${video.title} (${formatDuration(video.duration)})`}>
          <img src={posterUrl(video)} alt="" loading="lazy" decoding="async" />
          <span className="vd-play" aria-hidden><Icon name="play" size={26} /></span>
          {children}
        </button>
      )}
    </div>
  )
}

// Films: one large player beside a panel that names what's showing and lists the other films;
// picking one plays it in the large player, so the two columns always line up.
function Films({ films, playing, setPlaying }) {
  const [currentId, setCurrentId] = useState(films[0].id) // the TV spot, first in videos.json
  const current = films.find((f) => f.id === currentId) ?? films[0]
  const others = films.filter((f) => f.id !== current.id)

  return (
    <div className="vd-feature">
      <Player video={current} playing={playing === current.id} onPlay={() => setPlaying(current.id)} className="vd-main">
        <span className="vd-duration">{formatDuration(current.duration)}</span>
      </Player>

      <aside className="vd-panel">
        <p className="vd-kicker">Featured film</p>
        <h3 className="vd-panel-title">{current.title}</h3>
        {current.caption && <p className="vd-panel-text">{current.caption}</p>}
        <div className="vd-panel-actions">
          <button type="button" className="btn btn-primary vd-watch" onClick={() => setPlaying(current.id)}
            disabled={playing === current.id}>
            <Icon name="play" size={16} /> {playing === current.id ? 'Now playing' : 'Play film'}
          </button>
          <span className="vd-length">{formatDuration(current.duration)}</span>
        </div>

        {others.length > 0 && (
          <div className="vd-more">
            <p className="vd-kicker">Also watch</p>
            <ul>
              {others.map((f) => (
                <li key={f.id}>
                  <button type="button" className="vd-item" onClick={() => { setCurrentId(f.id); setPlaying(f.id) }}>
                    <span className="vd-item-thumb" style={{ background: f.color }}>
                      <img src={posterUrl(f)} alt="" loading="lazy" decoding="async" />
                      <span className="vd-item-play" aria-hidden><Icon name="play" size={14} /></span>
                    </span>
                    <span className="vd-item-text">
                      <span className="vd-item-title">{f.title}</span>
                      <span className="vd-item-meta">{formatDuration(f.duration)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  )
}

// Full-screen player for the vertical clips: the video large and centred over a dark backdrop,
// with the speaker's name and role beneath. Arrows step between clips; Escape, ✕ or a click
// outside the video closes it, and focus returns to the card that opened it.
function ClipViewer({ clips, index, onStep, onClose }) {
  const clip = clips[index]
  const closeRef = useRef(null)

  useEffect(() => {
    const opener = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      // arrow keys on the video itself seek within it, so only step when it isn't focused
      if (e.target.tagName === 'VIDEO') return
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

  return createPortal(
    <div className="vd-viewer" role="dialog" aria-modal="true" aria-label={clip.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button type="button" className="vd-viewer-close" ref={closeRef} onClick={onClose} aria-label="Close video">
        <Icon name="close" size={22} />
      </button>
      {clips.length > 1 && (
        <>
          <button type="button" className="vd-viewer-step vd-viewer-prev" onClick={() => onStep(-1)} aria-label="Previous video">
            <Icon name="prev" size={22} />
          </button>
          <button type="button" className="vd-viewer-step vd-viewer-next" onClick={() => onStep(1)} aria-label="Next video">
            <Icon name="next" size={22} />
          </button>
        </>
      )}

      {/* keyed so each clip starts fresh */}
      <figure className="vd-viewer-figure" key={clip.id}>
        {/* when a clip ends the next one plays; after the last, the first */}
        <video src={videoUrl(clip)} poster={posterUrl(clip)} controls autoPlay playsInline onEnded={() => onStep(1)}
          style={{ aspectRatio: `${clip.w} / ${clip.h}`, background: clip.color }} />
        <figcaption>
          <p className="vd-viewer-title">{clip.title}</p>
          {clip.subtitle && <p className="vd-viewer-sub">{clip.subtitle}</p>}
          <p className="vd-viewer-count">{index + 1} / {clips.length} · {formatDuration(clip.duration)}</p>
        </figcaption>
      </figure>
    </div>,
    document.body,
  )
}

// Its own band on the Events page, above the photo gallery: the films, then the vertical
// interviews and clips (a row scrolled sideways by hand)
export default function EventVideos() {
  const videos = useVideos()
  const [playing, setPlaying] = useState(null) // the film playing in place, by id
  const [openClip, setOpenClip] = useState(null) // index of the clip open full screen
  const clipCount = videos?.filter((v) => v.kind === 'clip').length ?? 0
  const closeClip = useCallback(() => setOpenClip(null), [])
  const stepClip = useCallback((d) => setOpenClip((i) => (i + d + clipCount) % clipCount), [clipCount])
  if (!videos?.length) return null

  const films = videos.filter((v) => v.kind === 'film')
  const clips = videos.filter((v) => v.kind === 'clip')
  // a clip opens full screen; any film playing in place stops
  const openClipAt = (i) => { setPlaying(null); setOpenClip(i) }

  return (
    <section className="vd" id="videos">
      <div className="vd-wrap">
        <header className="vd-intro">
          <TriBar />
          <Title light="EVENT" bold="VIDEOS" />
        </header>

        {films.length > 0 && <Films films={films} playing={playing} setPlaying={setPlaying} />}

        {clips.length > 0 && (
          <div className="vd-clips-block">
            <h3 className="vd-kicker vd-head">Interviews &amp; moments</h3>
            {/* a carousel: slides on its own (one card every 3s, looping) and by hand (swipe, trackpad, mouse drag) */}
            <Scroller className="vd-clips" rowClassName="vd-clips-row" label="Interviews and moments" auto={3}>
              {clips.map((v, i) => (
                <div className="vd-clip" key={v.id}>
                  <Player video={v} playing={false} onPlay={() => openClipAt(i)} className="vd-clip-frame">
                    <span className="vd-duration">{formatDuration(v.duration)}</span>
                    <span className="vd-clip-title">
                      {v.title}
                      {v.subtitle && <span className="vd-clip-sub">{v.subtitle}</span>}
                    </span>
                  </Player>
                </div>
              ))}
            </Scroller>
          </div>
        )}

        {openClip !== null && clips[openClip] && (
          <ClipViewer clips={clips} index={openClip} onStep={stepClip} onClose={closeClip} />
        )}
      </div>
    </section>
  )
}
