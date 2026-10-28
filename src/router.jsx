/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react'

// shortcut: tiny pushState router for a handful of pages; switch to react-router if routes grow.
export function navigate(to) {
  // a link to the page already open: no route change, so go back to its top here
  if (to === window.location.pathname) return window.scrollTo({ top: 0, behavior: 'instant' })
  window.history.pushState(null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return path
}

export function Link({ to, onClick, ...props }) {
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e)
        // let the browser handle new-tab / modified clicks
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        navigate(to)
      }}
      {...props}
    />
  )
}
