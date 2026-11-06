// Site-wide motion layer: scroll-linked parallax, magnetic buttons, and in-view triggers for headings and image reveals. Pure DOM, no
// dependencies; the CSS lives in motion.css. Pointer effects only run on mouse/trackpad devices,
// and everything is skipped when the visitor asks for reduced motion.

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

const MAGNETIC = '.btn, .h-btn, .h-btn-pill, .h-maps-btn, .ev-album, .ar-link, .vd-watch, .to-top, .footer-social a'

// Called once: the listeners live for the whole visit.
export function startMotion() {
  if (reduced()) return () => {}
  const off = []
  const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); off.push(() => target.removeEventListener(type, fn, opts)) }

  // --sy: how far the page has scrolled (capped), read by CSS for the banners' parallax (motion.css). Set only on
  // the elements that use it, and only when it changes: set on the page's root, every element inherits it and
  // the browser restyles the whole page on every scrolled frame, which slower computers can't keep up with.
  let ticking = false
  const PARALLAX = '.h-hero, .hero-bg'
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
      const sy = String(Math.min(Math.round(window.scrollY), 1400))
      document.querySelectorAll(PARALLAX).forEach((el) => { if (el.style.getPropertyValue('--sy') !== sy) el.style.setProperty('--sy', sy) })
    })
  }
  onScroll()
  on(window, 'scroll', onScroll, { passive: true })

  if (finePointer()) {
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
