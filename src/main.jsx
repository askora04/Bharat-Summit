import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Two layouts; loading only one keeps their styles apart:
//   src/desktop/  computers, tablets and iPhones. On iPhones index.html sets a 1200px-wide viewport, so they show
//                 the desktop layout exactly, scaled to the screen, with the Safari fixes in src/iphone/iphone.css
//   src/mobile/   other phones (<= 700px)
// ?iphone in the address also loads the iPhone fixes, for src/iphone/preview.html
const iphone = /iPhone|iPod/.test(navigator.userAgent)
const forced = new URLSearchParams(window.location.search).get('iphone')
const iphoneView = iphone || forced !== null
if (iphoneView) {
  const root = document.documentElement
  root.classList.add('iphone') // set before the layout loads: its code reads it (AboutPage.jsx)
  // --k: page px per screen point (1200 / screen width, ~3), so full-screen popups can be sized as on a phone
  // (iphone.css). The preview passes the model's width (?iphone=393); a real iPhone reports its own.
  const width = +forced || (iphone ? Math.min(window.screen.width, window.screen.height) : 393)
  const k = 1200 / width
  root.style.setProperty('--k', k)
  // Join the Conversation (About) is shown at phone size: zoomed up by --k, laid out a phone wide. Written as plain
  // numbers, as Safari doesn't reliably zoom text by a zoom given through a CSS variable.
  const sheet = document.createElement('style')
  sheet.textContent = `html.iphone .social { zoom: ${k}; width: ${width}px }`
  document.head.append(sheet)
}

const phone = window.matchMedia('(max-width: 700px)')
let layout = !iphone && phone.matches ? import('./mobile/App.jsx') : import('./desktop/App.jsx')
// the iPhone stylesheet loads after the layout's own, so its rules win over the desktop ones they replace
if (iphoneView) layout = layout.then((mod) => import('./iphone/iphone.css').then(() => mod))
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
