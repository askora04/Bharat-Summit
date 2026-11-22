import { TriBar } from './shared.jsx'
import { MonumentHero } from './SpeakersPage.jsx'
import { Link } from '../lib/router.jsx'
import { GALLERY_URL } from '../lib/gallery.js'
import { POSTS } from '../data/blogData.js'
import { useFitText } from '../lib/fitText.js'
import './schedule.css' // the banner's .sc-hero sizing, shared with the Schedule page
import './blogs.css'

const DATE = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const formatDate = (iso) => DATE.format(new Date(iso))
const minutes = (post) => Math.max(1, Math.round(post.body.reduce((n, b) => n + JSON.stringify(b).split(' ').length, 0) / 220))

function Cover({ post, sizes }) {
  // covers starting with / are local files in public/, the rest come from the gallery
  const src = (w) => `${post.cover.startsWith("/") ? "" : GALLERY_URL + "/"}${post.cover}-${w}.webp`
  return <img src={src(960)} srcSet={`${src(480)} 480w, ${src(960)} 960w, ${src(1600)} 1600w`} sizes={sizes} alt="" loading="lazy" decoding="async" />
}

function FitTitle({ text }) {
  const ref = useFitText(text)
  return <h1 ref={ref} className="bl-post-title">{text}</h1>
}

const Meta = ({ post }) => (
  <p className="bl-meta">
    <time dateTime={post.date}>{formatDate(post.date)}</time>
    <span aria-hidden>·</span>
    <span>{minutes(post)} min read</span>
  </p>
)

// other posts, newest first, beside the list and each post (the reference blog's "Recent Posts")
function Recent({ current }) {
  return (
    <aside className="bl-side" aria-label="Recent posts">
      <h2 className="bl-side-title">Recent Posts</h2>
      {POSTS.filter((p) => p.slug !== current).map((p) => (
        <Link key={p.slug} to={`/blogs/${p.slug}`} className="bl-recent">
          <Cover post={p} sizes="96px" />
          <span>
            <span className="bl-recent-title">{p.title}</span>
            <time dateTime={p.date}>{formatDate(p.date)}</time>
          </span>
        </Link>
      ))}
    </aside>
  )
}

function List() {
  return (
    <>
      <MonumentHero className="sc-hero" kicker="BHARAT SUMMIT" title={<>OUR <strong>BLOGS</strong></>}>
        <p className="sc-hero-lede">Stories, recaps and ideas from Bharat Summit:<br />the conversations shaping a new world.</p>
        <TriBar className="sc-hero-bar" />
      </MonumentHero>
      <main className="bl-page">
        <div className="bl-feed">
          {POSTS.map((p) => (
            <article key={p.slug} className="bl-card">
              <Link to={`/blogs/${p.slug}`} className="bl-card-img" tabIndex={-1} aria-hidden><Cover post={p} sizes="(max-width: 1100px) 100vw, 360px" /></Link>
              <div className="bl-card-body">
                <Meta post={p} />
                <h2 className="bl-card-title"><Link to={`/blogs/${p.slug}`}>{p.title}</Link></h2>
                <p className="bl-excerpt">{p.excerpt}</p>
                <Link to={`/blogs/${p.slug}`} className="bl-more" aria-label={`Read more: ${p.title}`}>Read More →</Link>
              </div>
            </article>
          ))}
        </div>
        <Recent />
      </main>
    </>
  )
}

function Post({ post }) {
  return (
    <main className="bl-page bl-post-page">
      <article className="bl-post">
        <nav className="bl-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link> <span aria-hidden>›</span> <Link to="/blogs" back>Blogs</Link>
        </nav>
        <FitTitle text={post.title} />
        <Meta post={post} />
        <figure className="bl-post-cover"><Cover post={post} sizes="(max-width: 1100px) 100vw, 760px" /></figure>
        <div className="bl-prose">
          {post.body.map((b, i) => b.h2 ? <h2 key={i}>{b.h2}</h2>
            : b.h3 ? <h3 key={i}>{b.h3}</h3>
            : b.list ? <ul key={i}>{b.list.map((li) => <li key={li}>{li}</li>)}</ul>
            : <p key={i}>{b.p}</p>)}
        </div>
        <Link to="/blogs" back className="bl-more">← Back to Blogs</Link>
      </article>
      <Recent current={post.slug} />
    </main>
  )
}

// /blogs lists the posts; /blogs/<slug> opens one (App.jsx sends an unknown slug back to /blogs)
export default function BlogsPage({ slug }) {
  const post = POSTS.find((p) => p.slug === slug)
  return post ? <Post post={post} /> : <List />
}
