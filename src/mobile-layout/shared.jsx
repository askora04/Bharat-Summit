/* eslint-disable react-refresh/only-export-components */
export const a = (name) => `/assets/${name}`

// Each word rises out of its own mask when the heading scrolls into view (see motion.css)
function Words({ text, from = 0 }) {
  return text.split(' ').map((w, i) => (
    <span key={i}>
      {i > 0 && ' '}
      <span className="w"><span className="wi" style={{ '--wi': from + i }}>{w}</span></span>
    </span>
  ))
}

export function Title({ light, bold, className = '' }) {
  const n = light ? light.split(' ').length : 0
  return (
    <h2 className={`section-title ${className}`}>
      {light && <><Words text={light} />{' '}</>}
      <strong><Words text={bold} from={n} /></strong>
    </h2>
  )
}

export function Lines({ lines }) {
  return lines.map((l, i) => <span key={i} className="line">{l}</span>)
}

// Speaker cards (SpeakerCard): kept for the cards' onPointerEnter/onFocus; on phones the details open on a tap
export function measureCover() {}

// Speaker cards on phones: the same details panel as the desktop's hover, opened by a tap. The first tap on a
// card opens its details (the session, time and "Click to view more") over the card's lower part, unfolding
// downward over what's below, exactly as the desktop shows them on hover; the card lifts. A tap on the open
// card or on its details opens the profile; a tap anywhere else, or scrolling the page, closes it.
// The panel is placed in the zoomed desktop layout the card is in (.dz, mobile.css), so it is zoomed with it,
// and it follows the card while it moves (the lift, the homepage carousel's drift, a row gliding).
const CARDS = '.sp-card'
export function startSpeakerTaps() {
  const float = document.createElement('div')
  float.setAttribute('aria-hidden', 'true')
  let card = null
  let host = null
  let frame = 0
  let closeTimer = 0
  let down = null

  // the card's details shown by default (name, designation, country): the panel opens exactly over them
  const base = (c) => c.querySelector(':scope > .sp-card-body:not(.sp-hover)')
  // the box the panel sits in, and its zoom (1 outside the zoomed layout)
  const frameOf = () => {
    if (host === document.body) return { left: -window.scrollX, top: -window.scrollY, zoom: 1 }
    // the box is 1100px wide (mobile.css): its measured width says whether positions come zoomed or not
    const r = host.getBoundingClientRect()
    return { left: r.left, top: r.top, zoom: r.width / 1100 || 1 }
  }
  const place = () => {
    if (!card) return
    if (!card.isConnected) return close(true)
    const box = card.getBoundingClientRect()
    // drifted off the screen (homepage carousel, a gliding row): close. The screen's edges are the zoomed
    // layout's edges (it spans the screen), measured the same way as the card: browsers differ on whether
    // positions inside a zoomed box come in screen pixels or in the box's own (unzoomed) pixels
    const edges = host === document.body ? { left: 0, right: window.innerWidth } : host.getBoundingClientRect()
    if (box.right < edges.left || box.left > edges.right) return close(true)
    const f = frameOf()
    const top = base(card).getBoundingClientRect().top
    float.style.left = `${(box.left - f.left) / f.zoom}px`
    float.style.top = `${(top - f.top) / f.zoom}px`
    float.style.width = `${box.width / f.zoom}px`
    const look = getComputedStyle(card)
    float.style.backgroundColor = look.backgroundColor
    float.style.borderLeftColor = float.style.borderRightColor = float.style.borderBottomColor = look.borderLeftColor
    frame = requestAnimationFrame(place)
  }
  const open = (next) => {
    close(true)
    card = next
    host = card.closest('.dz') || document.body
    host.append(float)
    card.classList.add('is-open')
    // the card's own classes give the copy the card's type, text styles and border
    float.className = `${[...card.classList].filter((c) => c !== 'is-open').join(' ')} sp-float is-shown`
    const f = frameOf()
    float.style.setProperty('--plain-h', `${base(card).getBoundingClientRect().height / f.zoom}px`)
    float.replaceChildren(card.querySelector('.sp-hover').cloneNode(true))
    place()
    float.getBoundingClientRect() // start closed, then open
    float.classList.add('is-open')
  }
  function close(now) {
    cancelAnimationFrame(frame)
    card?.classList.remove('is-open')
    card = null
    float.classList.remove('is-open')
    clearTimeout(closeTimer)
    if (now) float.classList.remove('is-shown')
    else closeTimer = setTimeout(() => float.classList.remove('is-shown'), 300)
  }

  // where a touch started, so a swipe (a carousel dragged by hand) isn't taken for a tap
  const onDown = (e) => { down = { x: e.clientX, y: e.clientY } }
  // runs before the card's own link (capture, on the document): the first tap opens instead of navigating
  const onClick = (e) => {
    if (float.contains(e.target)) {
      e.preventDefault(); e.stopPropagation()
      if (card) card.click() // the open card's link: opens the profile
      return
    }
    const tapped = e.target.closest?.(CARDS)
    const swiped = down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10
    if (tapped && !swiped && tapped !== card) {
      e.preventDefault(); e.stopPropagation()
      open(tapped)
    } else if (!tapped && card) close()
  }
  // scrolling the page closes it (a gliding row doesn't: the panel follows its card)
  const onScroll = (e) => {
    if (card && (e.target === document || e.target === document.documentElement)) close(true)
  }
  document.addEventListener('pointerdown', onDown, { capture: true, passive: true })
  document.addEventListener('click', onClick, { capture: true })
  window.addEventListener('scroll', onScroll, { passive: true, capture: true })
  return () => {
    close(true)
    float.remove()
    document.removeEventListener('pointerdown', onDown, { capture: true })
    document.removeEventListener('click', onClick, { capture: true })
    window.removeEventListener('scroll', onScroll, { capture: true })
  }
}

export function Portrait({ bg, src, className, children }) {
  return (
    <div className={`portrait ${className}`} style={{ background: bg }}>
      <span className="band band-1" />
      <span className="band band-2" />
      <span className="band band-3" />
      {src && <img src={src} alt="" />}
      {children}
    </div>
  )
}

// onPointerDown for an auto-scrolling track: dragging scrubs its CSS animation, so auto scroll carries on from there.
export function dragMarquee(e) {
  const track = e.currentTarget, anim = track.getAnimations()[0]
  if (!anim || e.button !== 0) return
  if (e.pointerType === 'mouse') e.preventDefault() // no text selection or native image drag
  const dur = anim.effect.getTiming().duration
  // one loop moves the track by half its width plus half a gap (see @keyframes marquee)
  // in a zoomed-out section (.dz) the track is drawn smaller than its layout width: measure it on screen
  const dist = (track.offsetWidth + parseFloat(getComputedStyle(track).columnGap)) / 2 * (track.currentCSSZoom ?? 1)
  const sign = getComputedStyle(track).animationDirection === 'reverse' ? -1 : 1
  const x0 = e.clientX, t0 = anim.currentTime
  let moved = false
  const move = (ev) => {
    const dx = ev.clientX - x0
    if (Math.abs(dx) > 5) moved = true
    anim.currentTime = (((t0 - sign * dx / dist * dur) % dur) + dur) % dur
  }
  const up = () => {
    removeEventListener('pointermove', move)
    removeEventListener('pointerup', up)
    removeEventListener('pointercancel', up)
    if (!moved) return
    // a drag that ends on a card must not open it
    const eat = (ev) => { ev.stopPropagation(); ev.preventDefault() }
    track.addEventListener('click', eat, { capture: true, once: true })
    setTimeout(() => track.removeEventListener('click', eat, { capture: true }))
  }
  addEventListener('pointermove', move)
  addEventListener('pointerup', up)
  addEventListener('pointercancel', up)
}

// A row that drifts sideways forever; pauses on hover/focus. Rendered twice for a seamless loop,
// the second copy hidden from screen readers and keyboard. `secs` is the time per item.
// `clickableCopy` keeps the second copy clickable (inert would block the mouse too); render(item, copy)
// must then take its controls out of the tab order when copy is 1.
// `drag` lets the row be dragged by hand (see dragMarquee).
export function Marquee({ items, render, className = '', secs = 6, clickableCopy = false, drag = false }) {
  return (
    <div className={`marquee ${drag ? 'is-drag' : ''} ${className}`} style={{ '--dur': `${items.length * secs}s` }}>
      <div className="marquee-track" onPointerDown={drag ? dragMarquee : undefined}>
        {[0, 1].map((copy) => items.map((item, i) => (
          <div className="marquee-item" key={`${copy}-${i}`} aria-hidden={copy === 1 || undefined}
            inert={(copy === 1 && !clickableCopy) || undefined}>
            {render(item, copy, i)}
          </div>
        )))}
      </div>
    </div>
  )
}

// The blue / saffron / red rule used above section titles.
export function TriBar({ className = '' }) {
  return <span className={`tribar ${className}`} aria-hidden><i /><i /><i /></span>
}
