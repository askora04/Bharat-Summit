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
            {render(item, copy)}
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
