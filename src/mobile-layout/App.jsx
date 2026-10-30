import './index.css'
import { useEffect, useState } from 'react'
import { a, TriBar } from './shared.jsx'
import { Link, usePath } from '../router.jsx'
import HomePage from './HomePage.jsx'
import AboutPage from './AboutPage.jsx'
import SchedulePage from './SchedulePage.jsx'
import SpeakersPage from './SpeakersPage.jsx'
import EventsPage from './EventsPage.jsx'
import Footer from './Footer.jsx'
import { startMotion, watchInView } from '../motion.js'
import './motion.css'
import './mobile.css' // last: phone-only adjustments win

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

function Header() {
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
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="lockup">
          <Link to="/" className="logo" aria-label="Bharat Summit home">
            <img className="brand-logo" src={a('logo.svg')} width="52" height="52" alt="" />
            <span className="wordmark">
              <span className="wordmark-name"><strong>BHARAT</strong> SUMMIT</span>
              <span className="wordmark-tag">FORGING A NEW WORLD ORDER</span>
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
        // a panel sliding in from the right over the dimmed page; tapping the dimmed part closes it
        <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Menu"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="menu-panel">
            <div className="menu-head">
              <span className="menu-brand">
                <img className="brand-logo" src={a('logo.svg')} width="32" height="32" alt="" />
                <span className="menu-brand-name"><strong>BHARAT</strong> SUMMIT</span>
              </span>
              <button className="menu-close" aria-label="Close menu" onClick={() => setOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <nav className="menu-links">
              {MENU.map((n) => (
                <NavLink key={n} label={n} onClick={() => setOpen(false)} />
              ))}
            </nav>
            <div className="menu-foot">
              <TriBar className="menu-bar" />
              <p className="menu-date">12–14 November 2026</p>
              <p className="menu-venue">HICC, Hyderabad, Telangana</p>
            </div>
          </div>
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

  useEffect(() => {
    // New page: jump to the requested section, else to where the page asks to start, else the top.
    const target = (window.location.hash && document.querySelector(window.location.hash))
      || document.querySelector('[data-scroll-start]')
    if (target) target.scrollIntoView()
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

  // zoom for the sections shown in their desktop layout (.dz, mobile.css): the 1100px layout fits the screen
  useEffect(() => {
    const fit = () => document.documentElement.style.setProperty('--dz', document.documentElement.clientWidth / 1100)
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <div className="page">
      {/* page transition: the brand stripes sweep away on every page change (keyed to replay) */}
      <div className="curtain" key={route} aria-hidden><i /><i /><i /><i /><i /></div>
      <Header />
      {/* every page but home is shown in its desktop layout, zoomed out to the screen width (mobile.css) */}
      {page === 'home' ? <HomePage /> : (
        <div className="dz">
          {page === 'about' ? <AboutPage />
            : page === 'speakers' ? <SpeakersPage />
            : page === 'schedule' ? <SchedulePage />
            : <EventsPage />}
        </div>
      )}
      <Footer />
    </div>
  )
}
