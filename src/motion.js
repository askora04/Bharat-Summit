// Site-wide motion layer: scroll-linked parallax, magnetic buttons, and in-view triggers for headings and image reveals. Pure DOM, no
// dependencies; the CSS lives in motion.css. Pointer effects only run on mouse/trackpad devices,
// and everything is skipped when the visitor asks for reduced motion.

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

const MAGNETIC = '.btn, .h-btn, .h-btn-pill, .h-maps-btn, .ev-album, .ar-link, .vd-watch, .to-top, .footer-social a'

// Called once: the listeners live for the whole visit.
export function startMotion() {
  if (reduced()) return () => {}
  const root = document.documentElement
  const off = []
  const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); off.push(() => target.removeEventListener(type, fn, opts)) }

  // --sy: how far the page has scrolled (capped), read by CSS for parallax and the hero fade
  let ticking = false
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => { root.style.setProperty('--sy', Math.min(window.scrollY, 1400)); ticking = false })
  }
  onScroll()
  on(window, 'scroll', onScroll, { passive: true })

  if (finePointer()) {
    // Mouse users can't swipe: let them drag the card rows sideways (touch and trackpads scroll natively)
    const ROWS = '.sp-grid:not(.sp-grid-all)'
    let drag = null, swallow = false
    on(window, 'pointerdown', (e) => {
      const row = e.pointerType === 'mouse' && e.button === 0 && e.target.closest?.(ROWS)
      if (row && row.scrollWidth > row.clientWidth) drag = { row, x: e.clientX, left: row.scrollLeft, moved: false }
    })
    on(window, 'pointermove', (e) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (!drag.moved && Math.abs(dx) < 6) return
      drag.moved = true
      drag.row.classList.add('is-dragging')
      drag.row.scrollLeft = drag.left - dx
    })
    const endDrag = () => {
      if (!drag) return
      const { row, moved } = drag
      drag = null
      if (!moved) return
      swallow = true // the click that follows a drag must not open the card
      setTimeout(() => { swallow = false }, 0)
      // let the row settle on the nearest card once the drag class stops suppressing snapping
      const left = row.scrollLeft
      row.classList.remove('is-dragging')
      row.scrollLeft = left
    }
    on(window, 'pointerup', endDrag)
    on(window, 'pointercancel', endDrag)
    on(window, 'click', (e) => { if (swallow) { e.preventDefault(); e.stopPropagation() } }, true)

    // Magnetism uses the independent `translate` property, so it combines with each button's own
    // hover transform instead of replacing it
    let pulled = null
    const settle = (el) => {
      const from = el.style.translate
      if (!from) return
      el.style.translate = ''
      el.animate([{ translate: from }, { translate: '0 0' }], { duration: 500, easing: 'cubic-bezier(.2, .8, .2, 1)' })
    }
    on(window, 'pointermove', (e) => {
      const btn = e.target.closest?.(MAGNETIC)
      if (pulled && pulled !== btn) { settle(pulled); pulled = null }
      if (btn) {
        const r = btn.getBoundingClientRect()
        btn.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.25}px ${(e.clientY - r.top - r.height / 2) * 0.35}px`
        pulled = btn
      }
    }, { passive: true })
  }

  return () => off.forEach((f) => f())
}

const MEDIA = '.h-venue-photo, .venue-media, .h-curated-logo, .vd-feature, .h-map'

// Called on every page: marks headings and media to animate when they scroll into view.
export function watchInView() {
  if (!reduced()) document.querySelectorAll(MEDIA).forEach((el) => el.classList.add('img-reveal'))
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))),
    { rootMargin: '0px 0px -10% 0px' },
  )
  document.querySelectorAll('.section-title, .sp-part-title, .img-reveal').forEach((el) => io.observe(el))
  return () => io.disconnect()
}
