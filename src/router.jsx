/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react'

// shortcut: tiny pushState router for a handful of pages; switch to react-router if routes grow.
// Each page's scroll position is kept when leaving it, so a return to it (a link marked `back`, such as a
// profile's "Back to Speakers", or the browser's Back button) opens it where the visitor left it
const SCROLL = (path) => `scroll:${path}`
let returning = false
function keepScroll() {
  try { sessionStorage.setItem(SCROLL(window.location.pathname), String(window.scrollY)) } catch { /* storage off */ }
}
// where to open `path` on this visit: its kept position on a return, else null (the page decides)
export function returnScroll(path) {
  if (!returning) return null
  try {
    const y = sessionStorage.getItem(SCROLL(path))
    return y == null ? null : Number(y)
  } catch { return null }
}

export function navigate(to, { back = false } = {}) {
  // a link to the page already open: no route change, so go back to its top here
  if (to === window.location.pathname) return window.scrollTo({ top: 0, behavior: 'instant' })
  keepScroll()
  // a `back` link returns to the kept position only when the visitor came from that page (a profile opened
  // from the homepage goes back to the top of the Speakers page)
  returning = back && window.history.state?.from === to
  window.history.pushState({ from: window.location.pathname }, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// the browser's Back and Forward buttons: the page shown is a return (every link out of a page went through
// navigate, which kept its position); the app places the page itself, not the browser
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
window.addEventListener('popstate', (e) => { if (e.isTrusted) returning = true })

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return path
}

export function Link({ to, onClick, back, ...props }) {
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e)
        // let the browser handle new-tab / modified clicks
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        navigate(to, { back })
      }}
      {...props}
    />
  )
}
