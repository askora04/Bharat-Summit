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

// Speaker cards: the details panel (.sp-hover) shows just the name until the card is hovered, then opens
// downward to the designation, session and time. Each card gets --plain-h (the panel's height with only the
// name) and --cover (how much more the open panel needs), so the panel opens to exactly fit (see index.css).
const CARDS = '.sp-card, .speaker, .h-speaker'
function measureCard(card) {
  const panel = card.querySelector('.sp-hover')
  // closed, the panel shows the name (and the Moderator badge, where there is one)
  const name = panel?.querySelector(':scope > .sp-mod') || panel?.firstElementChild
  if (!name) return
  const pad = parseFloat(getComputedStyle(panel).paddingBottom) || 0
  const plain = Math.ceil(name.getBoundingClientRect().bottom - panel.getBoundingClientRect().top + pad)
  card.style.setProperty('--plain-h', `${plain}px`)
  card.style.setProperty('--cover', `${Math.max(0, panel.scrollHeight - plain)}px`)
}
export function measureCover(e) { measureCard(e.currentTarget) }

// The open details float over the page instead of growing the card: the card and its row keep their size,
// so the other cards don't move or gain space. One panel serves every card: when the mouse moves onto a card
// it takes a copy of that card's details, sits over the card from the name down at the card's width, and
// opens downward over whatever is below. A click on it opens the profile.
//
// Steady while the page scrolls: the panel is placed in page coordinates (position: absolute), so it scrolls
// with the page in step with its card and never trails it. Scrolling closes it at once, and nothing opens or
// lifts until the page has stopped and the mouse actually moves (the browser reports pointer events as cards
// pass under a still pointer; those don't count). The lift and photo zoom are driven from here (.is-open)
// rather than by CSS :hover, so a card never lifts and drops as the page scrolls past the pointer.
export function startSpeakerFloat() {
  if (!window.matchMedia('(hover: hover)').matches) return () => {}
  const float = document.createElement('div')
  float.setAttribute('aria-hidden', 'true')
  document.body.append(float)
  let card = null
  let frame = 0
  let pointer = { x: -1, y: -1 }
  let closeTimer = 0
  let scrolling = false
  let settle = 0

  const inside = (r) => pointer.x >= r.left && pointer.x <= r.right && pointer.y >= r.top && pointer.y <= r.bottom
  // what the card shows under its photo when closed: on the Speakers page its own details (name, designation,
  // country), elsewhere the panel itself cut down to the name; the open panel starts exactly over it
  const base = (c) => {
    const plain = c.querySelector(':scope > :is(.sp-card-body, .speaker-body, .h-speaker-body):not(.sp-hover)')
    return plain && plain.getClientRects().length ? plain : c.querySelector('.sp-hover')
  }
  // follows the card while it moves on the page (its lift, the homepage carousel's drift)
  const place = () => {
    if (!card) return
    if (!card.isConnected) return close(true)
    const box = card.getBoundingClientRect()
    const panel = base(card).getBoundingClientRect()
    float.style.left = `${box.left + window.scrollX}px`
    float.style.top = `${panel.top + window.scrollY}px`
    float.style.width = `${box.width}px`
    const look = getComputedStyle(card)
    float.style.backgroundColor = look.backgroundColor
    float.style.borderLeftColor = float.style.borderRightColor = float.style.borderBottomColor = look.borderLeftColor
    // the card drifted from under the pointer (homepage carousel): close, and open the card now under it
    if (!inside(box) && !inside(float.getBoundingClientRect())) { close(); return pick() }
    frame = requestAnimationFrame(place)
  }
  const open = (next) => {
    close(true)
    card = next
    measureCard(card)
    card.classList.add('is-open')
    // the card's own classes give the copy the card's type, text styles and border
    float.className = `${[...card.classList].filter((c) => c !== 'is-open').join(' ')} sp-float is-shown`
    const shown = base(card)
    float.style.setProperty('--plain-h', shown.classList.contains('sp-hover')
      ? card.style.getPropertyValue('--plain-h') : `${shown.getBoundingClientRect().height}px`)
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
    // leaving a card: the panel folds back up, then hides; switching cards or scrolling: it hides at once
    if (now) float.classList.remove('is-shown')
    else closeTimer = setTimeout(() => float.classList.remove('is-shown'), 300)
  }
  // the card under the pointer, if any (the folding panel lets the pointer through, see index.css)
  function pick() {
    if (scrolling || pointer.x < 0) return
    const next = document.elementFromPoint(pointer.x, pointer.y)?.closest(CARDS)
    if (next && !next.classList.contains('sp-float') && next !== card) open(next)
  }

  // only the page, or the row holding the open card, counts: the Speakers page's other rows glide on their own
  const onScroll = (e) => {
    const page = e.target === document || e.target === document.documentElement
    if (!page && !(card && e.target.contains?.(card))) return
    if (card) close(true)
    scrolling = true
    clearTimeout(settle)
    settle = setTimeout(() => { scrolling = false }, 250)
  }
  const onMove = (e) => {
    const still = e.clientX === pointer.x && e.clientY === pointer.y // reported by the browser, not a real move
    pointer = { x: e.clientX, y: e.clientY }
    if (still || scrolling || e.target.closest?.('.sp-float')) return
    const next = e.target.closest?.(CARDS)
    if (next !== card) next ? open(next) : (card && !inside(float.getBoundingClientRect()) && close())
  }
  const onClick = () => { if (card) card.click() }
  const onLeave = () => { pointer = { x: -1, y: -1 }; if (card) close() }
  float.addEventListener('click', onClick)
  window.addEventListener('scroll', onScroll, { passive: true, capture: true })
  document.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
  return () => {
    close(true)
    clearTimeout(settle)
    float.removeEventListener('click', onClick)
    window.removeEventListener('scroll', onScroll, { capture: true })
    document.removeEventListener('pointermove', onMove)
    document.documentElement.removeEventListener('pointerleave', onLeave)
    float.remove()
  }
}

// Measures every speaker card on the page, again whenever cards are added (page changes, filters) or the
// window is resized, and once the fonts have loaded
export function watchSpeakerCards() {
  let frame = 0
  const run = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => document.querySelectorAll(CARDS).forEach(measureCard))
  }
  const added = new MutationObserver(run)
  added.observe(document.body, { childList: true, subtree: true })
  window.addEventListener('resize', run)
  document.fonts?.ready.then(run)
  run()
  return () => { added.disconnect(); window.removeEventListener('resize', run); cancelAnimationFrame(frame) }
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
  const dist = (track.offsetWidth + parseFloat(getComputedStyle(track).columnGap)) / 2
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
