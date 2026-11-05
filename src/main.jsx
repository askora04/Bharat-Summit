import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Phones get their own copy of the layout (src/mobile/); loading only one keeps the two sets of styles apart
const phone = window.matchMedia('(max-width: 700px)')
const layout = phone.matches ? import('./mobile/App.jsx') : import('./desktop/App.jsx')
// crossing the breakpoint (rotating a tablet, resizing a window) swaps to the other layout
phone.addEventListener('change', () => window.location.reload())

layout.then((mod) => {
  const App = mod.default
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
