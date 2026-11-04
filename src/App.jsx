import './index.css'
import { useEffect, useState } from 'react'
import { a, watchSpeakerCards, startSpeakerFloat } from './shared.jsx'
import { Link, usePath, returnScroll } from './router.jsx'
import HomePage from './HomePage.jsx'
import AboutPage from './AboutPage.jsx'
import SchedulePage from './SchedulePage.jsx'
import SpeakersPage from './SpeakersPage.jsx'
import EventsPage from './EventsPage.jsx'
import Footer from './Footer.jsx'
import { startMotion, watchInView } from './motion.js'
import './motion.css'

const NAV = ['HOME', 'ABOUT US', 'SCHEDULE', 'SPEAKERS', 'SUMMIT ARCHIVES', 'CONNECT']
const MENU = ['HOME', 'ABOUT', 'SCHEDULES', 'SPEAKERS', 'SUMMIT ARCHIVES', 'CONNECT']

function NavLink({ label, onClick }) {
  const path = usePath().replace(/\/$/, '') || '/'
  const page = label === 'HOME' ? '/'
    : label.startsWith('ABOUT') ? '/about-us'
    : label === 'SPEAKERS' ? '/speakers'
    : label.startsWith('SCHEDULE') ? '/schedule'
    : label === 'SUMMIT ARCHIVES' ? '/events'
    : null

  if (page) {
    return (
      <Link to={page} onClick={onClick} aria-current={path === page ? 'page' : undefined}>
        {label}
      </Link>
    )
  }
  // Contact jumps instantly to the footer: a smooth scroll would pass the Events gallery's loader on the way
  // and load more photos, moving the footer
  const id = 'contact' // the only in-page item: CONNECT jumps to the footer's contact block
  const jump = (e) => {
    onClick?.()
    e.preventDefault()
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' }))
  }
  return <a href={`#${id}`} onClick={jump}>{label}</a>
}

function Header({ page }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {/* on-dark: pages whose banner is dark right under the header, so the tagline reads in white */}
      <header className={`header ${scrolled ? 'is-scrolled' : ''} ${['speakers', 'schedule', 'events'].includes(page) ? 'on-dark' : ''}`}>
        <div className="lockup">
          <Link to="/" className="logo" aria-label="Bharat Summit home">
            <img className="brand-logo" src={a('logo.svg')} width="52" height="52" alt="" />
            <span className="wordmark">
              <span className="wordmark-name"><strong>BHARAT</strong> SUMMIT</span>
              <span className="wordmark-tag">FORGING A NEW WORLD</span>
            </span>
          </Link>
        </div>
        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => <NavLink key={n} label={n} />)}
        </nav>
        {/* Menu button only on narrow screens, where the links don't fit */}
        <button className="icon-btn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
          <img src={a('menu.svg')} width="24" height="24" alt="" />
        </button>
        <span className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden />
      </header>

      <button className={`to-top ${progress > 0.15 ? 'is-shown' : ''}`} aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      </button>

      {open && (
        <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="menu-close" aria-label="Close menu" onClick={() => setOpen(false)}>×</button>
          <nav>
            {MENU.map((n) => (
              <NavLink key={n} label={n} onClick={() => setOpen(false)} />
            ))}
          </nav>
        </div>
      )}
    </>
  )
}

export default function App() {
  const path = usePath()
  const route = path.replace(/\/$/, '')
  const page = route === '/about-us' ? 'about'
    : route.startsWith('/speakers') ? 'speakers'
    : route === '/schedule' ? 'schedule'
    : route === '/events' ? 'events'
    : 'home'

  useEffect(watchSpeakerCards, []) // speaker cards: measure their details (shared.jsx)
  useEffect(startSpeakerFloat, []) // and open them on hover, floating over the page

  useEffect(() => {
    // New page: back where the visitor left it on a return (Back to Speakers, the browser's Back button), else
    // the requested section, else where the page asks to start, else the top.
    const kept = returnScroll(window.location.pathname)
    const target = (window.location.hash && document.querySelector(window.location.hash))
      || document.querySelector('[data-scroll-start]')
    if (kept != null) window.scrollTo({ top: kept, behavior: 'instant' })
    else if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
    document.title = ({
      about: 'About Us · ',
      speakers: 'Speakers · ',
      schedule: 'Agenda & Schedule · ',
      events: 'Summit Archives · ',
      home: '',
    }[page] || '') + 'Bharat Summit 2026'

    // Sections fade up when entering the viewport (children staggered 150ms in CSS).
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-visible'), io.unobserve(e.target))),
      // trigger on the top edge, not a share of the area: tall sections (the speakers grid) never reach 15% visible
      { rootMargin: '0px 0px -15% 0px' },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    const unwatch = watchInView()
    return () => { io.disconnect(); unwatch() }
  }, [page, route])

  useEffect(() => startMotion(), [])

  return (
    <div className="page">
      {/* page transition: the brand stripes sweep away on every page change (keyed to replay) */}
      <div className="curtain" key={route} aria-hidden><i /><i /><i /><i /><i /></div>
      <Header page={page} />
      {page === 'about' ? <AboutPage />
        : page === 'speakers' ? <SpeakersPage />
        : page === 'schedule' ? <SchedulePage />
        : page === 'events' ? <EventsPage />
        : <HomePage />}
      <Footer />
    </div>
  )
}
