import { a, Title, Marquee } from './shared.jsx'
import { VIDEOS, SYNDICATED, ARTICLES } from '../mediaCoverage.js'
import './media.css'

const DATE = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const formatDate = (iso) => DATE.format(new Date(iso))
const thumb = (id, size) => `https://i.ytimg.com/vi/${id}/${size}.jpg`

const ICONS = {
  external: <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
  video: <><rect x="2" y="5" width="15" height="14" rx="2" /><path d="m17 10 5-3v10l-5-3" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></>,
}
const Icon = ({ name, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>{ICONS[name]}</svg>
)

// The design's play button: white ring with a navy triangle and a soft pulse
const PlayMark = () => (
  <span className="mc-play" aria-hidden>
    <img src={a('play-circle.svg')} width="56" height="56" alt="" />
    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
  </span>
)

function Poster({ video }) {
  if (video.img) return <img src={a(video.img)} alt="" loading="lazy" decoding="async" />
  return (
    <img src={thumb(video.id, 'mqdefault')} srcSet={`${thumb(video.id, 'mqdefault')} 320w, ${thumb(video.id, 'sddefault')} 640w`}
      sizes="(max-width: 700px) 85vw, 410px" alt="" loading="lazy" decoding="async" />
  )
}

// Every card opens the video on YouTube (or the clip on X) in a new tab
function VideoCard({ video, copy }) {
  const site = video.x ? 'X' : 'YouTube'
  return (
    <a className="mc-video" href={video.x ?? `https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer"
      tabIndex={copy ? -1 : undefined}
      aria-label={`${video.title}, ${video.channel}. Watch on ${site} (opens in a new tab)`}>
      <span className="mc-frame">
        <Poster video={video} />
        <span className="mc-badge"><Icon name="video" size={13} />{video.channel} · {formatDate(video.date)}</span>
        <span className="mc-elsewhere">Watch on {site} <Icon name="external" size={12} /></span>
        <PlayMark />
      </span>
      <h3 className="mc-title">{video.title}</h3>
    </a>
  )
}

// Outlet monogram in one of the site's accent colours, as the social cards show platform marks
const MARK_COLORS = ['#082852', '#00549c', '#24afa0', '#ef7047', '#d99c29', '#cf2677']
function monogram(name) {
  const words = name.replace(/^The\s+/, '').split(/[\s-]+/)
  return words.length > 1 ? words.slice(0, 3).map((w) => w[0]).join('').toUpperCase() : name.slice(0, 1)
}
const markColor = (name) => MARK_COLORS[[...name].reduce((h, c) => h + c.charCodeAt(0), 0) % MARK_COLORS.length]

function Article({ article, copy }) {
  return (
    <a className="mc-article" href={article.url} target="_blank" rel="noreferrer" tabIndex={copy ? -1 : undefined}>
      <span className="mc-article-head">
        <span className="mc-mark" style={{ background: markColor(article.publication) }} aria-hidden>{monogram(article.publication)}</span>
        <span>
          <span className="mc-pub">{article.publication}</span>
          <time className="mc-date" dateTime={article.date}>{formatDate(article.date)}</time>
        </span>
      </span>
      <span className="mc-headline">{article.title}</span>
      <span className="mc-read">Read article <Icon name="external" size={14} /></span>
    </a>
  )
}

export default function MediaCoverage() {
  return (
    <section className="mc reveal" id="about-media">
      <Title light="MEDIA" bold="COVERAGE" />
      <p className="lede">In the Spotlight</p>

      <div className="container mc-block">
        <div className="mc-block-head">
          <p className="eyebrow eyebrow-sm">Video coverage</p>
        </div>
        {/* both rows drift on their own and can be dragged by hand; the second copy stays clickable after a drag */}
        <Marquee className="mc-videos" items={VIDEOS} drag clickableCopy render={(v, copy) => <VideoCard video={v} copy={copy} />} />
      </div>

      <div className="container mc-block">
        <div className="mc-block-head">
          <p className="eyebrow eyebrow-sm">Press coverage</p>
          <span className="mc-count">{ARTICLES.length + SYNDICATED.outlets.length} articles</span>
        </div>

        <div className="mc-syndicated">
          <span className="mc-article-head">
            <span className="mc-mark mc-mark-globe" aria-hidden><Icon name="globe" size={18} /></span>
            <span>
              <span className="mc-pub">Carried internationally</span>
              <time className="mc-date" dateTime={SYNDICATED.date}>{formatDate(SYNDICATED.date)}</time>
            </span>
          </span>
          <p className="mc-headline">{SYNDICATED.title}</p>
          <ul className="mc-outlets">
            {SYNDICATED.outlets.map(([name, url]) => (
              <li key={name}><a href={url} target="_blank" rel="noreferrer">{name} <Icon name="external" size={13} /></a></li>
            ))}
          </ul>
        </div>

        <Marquee className="mc-articles" items={ARTICLES} drag clickableCopy render={(ar, copy) => <Article article={ar} copy={copy} />} />
      </div>
    </section>
  )
}
