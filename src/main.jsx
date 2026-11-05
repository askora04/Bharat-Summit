import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Two layouts; loading only one keeps their styles apart:
//   src/desktop/  computers, tablets and iPhones. On iPhones index.html sets a 1200px-wide viewport, so they show
//                 the desktop layout exactly, scaled to the screen, with the Safari fixes in src/iphone/iphone.css
//   src/mobile/   other phones (<= 700px)
// ?iphone in the address also loads the iPhone fixes, for src/iphone/preview.html
const iphone = /iPhone|iPod/.test(navigator.userAgent)
const phone = window.matchMedia('(max-width: 700px)')
let layout = !iphone && phone.matches ? import('./mobile/App.jsx') : import('./desktop/App.jsx')
// the iPhone stylesheet loads after the layout's own, so its rules win over the desktop ones they replace
const forced = new URLSearchParams(window.location.search).get('iphone')
if (iphone || forced !== null) {
  // --k: page px per screen point (1200 / screen width, ~3), so full-screen popups can be sized as on a phone
  // (iphone.css). The preview passes the model's width (?iphone=393); a real iPhone reports its own.
  const width = +forced || (iphone ? Math.min(window.screen.width, window.screen.height) : 393)
  document.documentElement.style.setProperty('--k', 1200 / width)
  layout = layout.then((mod) => import('./iphone/iphone.css').then(() => mod))
}
// crossing the breakpoint (rotating a tablet, resizing a window) swaps to the other layout; an iPhone's
// viewport stays 1200px wide, so it never crosses it
if (!iphone) phone.addEventListener('change', () => window.location.reload())

layout.then((mod) => {
  const App = mod.default
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
