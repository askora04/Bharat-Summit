import { useEffect, useRef, useState } from 'react'
import './scroller.css'

// A row that scrolls sideways by hand, with every kind of input: a swipe on touch screens, a sideways trackpad
// swipe or Shift + wheel, dragging with the mouse, the arrow buttons at either end, the arrow keys once it has
// focus, and (with `dots`) a dot per item. Each item snaps into place. The arrows and dots show only while the
// row is wider than its box. Used by the Summit Archives clips and About's social posts, in both layouts.
//
// className: the wrapper (where the arrows sit); rowClassName: the scrolling row; label: names it for screen
// readers; dots: an aria label per item, for the dots under the row.
export default function Scroller({ className = '', rowClassName = '', label, dots, children }) {
  const row = useRef(null)
  const [state, setState] = useState({ scrollable: false, atStart: true, atEnd: false, current: 0 })

  useEffect(() => {
    const el = row.current
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      const n = el.children.length
      setState({
        scrollable: max > 1,
        atStart: el.scrollLeft <= 1,
        atEnd: el.scrollLeft >= max - 1,
        current: max > 1 ? Math.round((el.scrollLeft / max) * (n - 1)) : 0,
      })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    el.addEventListener('scroll', update, { passive: true })
    return () => { ro.disconnect(); el.removeEventListener('scroll', update) }
  }, [])

  // Where item i starts, as a scroll position, in the row's own pixels. Measured from the boxes on screen, not
  // offsetLeft: items can be zoomed (the phone views enlarge the clips), and offsetLeft then comes in the item's
  // own zoomed units. The row itself can sit in a zoomed-out layout (the phone layout's .dz): `scale` undoes that.
  const itemLeft = (i) => {
    const el = row.current
    const box = el.getBoundingClientRect()
    const scale = box.width / el.offsetWidth || 1
    const first = el.children[0].getBoundingClientRect().left
    return (el.children[i].getBoundingClientRect().left - first) / scale
  }
  // one item's width plus the gap
  const stepSize = () => (row.current.children.length > 1 ? itemLeft(1) : row.current.clientWidth * 0.8)
  const step = (dir) => row.current.scrollBy({ left: dir * stepSize(), behavior: 'smooth' })
  const go = (i) => row.current.scrollTo({ left: itemLeft(i), behavior: 'smooth' })

  // Dragging with the mouse (touch screens scroll natively). Positions inside a zoomed-out layout (the phone
  // layout's .dz) come in screen pixels, so the drag is scaled to the row's own pixels.
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = row.current
    const zoom = el.getBoundingClientRect().width / el.offsetWidth || 1
    const x0 = e.clientX, left0 = el.scrollLeft
    let moved = false
    const move = (ev) => {
      const dx = (ev.clientX - x0) / zoom
      if (!moved && Math.abs(dx) > 4) { moved = true; el.classList.add('is-dragging') }
      if (moved) el.scrollLeft = left0 - dx
    }
    const up = () => {
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
      el.classList.remove('is-dragging')
      if (!moved) return
      // snapping stays off until the glide below has ended, else the browser snaps straight back to the nearest
      // item and cancels the glide
      el.classList.add('is-settling')
      const settled = () => el.classList.remove('is-settling')
      el.addEventListener('scrollend', settled, { once: true })
      setTimeout(settled, 700) // browsers without scrollend
      // settle on an item: a drag of more than 15% of an item goes on to the next one in that direction (like a
      // flick), a shorter one springs back. And the drag mustn't count as a click on what it ended on.
      const size = stepSize()
      const from = Math.round(left0 / size)
      const dragged = (el.scrollLeft - left0) / size
      const to = Math.abs(dragged) > 0.15 ? from + Math.sign(dragged) * Math.max(1, Math.round(Math.abs(dragged))) : from
      go(Math.max(0, Math.min(el.children.length - 1, to)))
      const eat = (ev) => { ev.stopPropagation(); ev.preventDefault() }
      el.addEventListener('click', eat, { capture: true, once: true })
      setTimeout(() => el.removeEventListener('click', eat, { capture: true }))
    }
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)
    e.preventDefault() // no text selection or image drag
  }
  const onKeyDown = (e) => {
    if (e.target !== row.current) return
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
  }

  const { scrollable, atStart, atEnd, current } = state
  return (
    <div className={`hs ${scrollable ? 'is-scrollable' : ''} ${className}`}>
      <div className={`hs-row ${rowClassName}`} ref={row} onPointerDown={onPointerDown} onKeyDown={onKeyDown}
        role="region" aria-label={label} tabIndex={scrollable ? 0 : undefined}>
        {children}
      </div>
      {scrollable && (
        <>
          <button type="button" className="hs-arrow hs-prev" onClick={() => step(-1)} disabled={atStart} aria-label="Scroll back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button type="button" className="hs-arrow hs-next" onClick={() => step(1)} disabled={atEnd} aria-label="Scroll forward">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </>
      )}
      {dots && scrollable && (
        <div className="post-dots">
          {dots.map((name, i) => (
            <button key={name} type="button" className={i === current ? 'is-on' : ''}
              aria-label={name} aria-current={i === current} onClick={() => go(i)} />
          ))}
        </div>
      )}
    </div>
  )
}
