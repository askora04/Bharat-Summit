import { Children, useEffect, useRef, useState } from 'react'
import './scroller.css'

// A row that scrolls sideways by hand, with every kind of input: a swipe on touch screens, a sideways trackpad
// swipe or Shift + wheel, dragging with the mouse, the arrow keys once it has focus and, with `dots`, a dot per
// item. Used by the Summit Archives clips and About's social posts.
//
// auto: the row also slides on its own, as a carousel, about one item every `auto` seconds, looping without end
//   (the items are shown twice; when the first set has slid out, the row jumps back by one set, which looks the
//   same). It holds while the visitor is on it (the mouse over it, a drag, a swipe, the wheel, keyboard focus) and
//   goes on 2s after they let go; it also holds while the row is off screen or the tab is hidden.
// className: the wrapper; rowClassName: the scrolling row; label: names it for screen
// readers; dots: an aria label per item, for the dots under the row.
export default function Scroller({ className = '', rowClassName = '', label, dots, auto = 0, children }) {
  const row = useRef(null)
  const [state, setState] = useState({ scrollable: false, current: 0 })
  const items = Children.toArray(children)
  const count = items.length

  // Where item i starts, as a scroll position, in the row's own pixels. Measured from the boxes on screen, not
  // offsetLeft: items can be zoomed (the phone views enlarge the clips), and offsetLeft then comes in the item's
  // own zoomed units. The row itself can sit in a zoomed-out layout (the phone layout's .dz): `scale` undoes that.
  const scaleOf = (el) => el.getBoundingClientRect().width / el.offsetWidth || 1
  // the items' boxes; a carousel's copies sit in wrappers without a box of their own (display: contents)
  const itemEls = () => [...row.current.children].map((c) => (c.classList.contains('hs-copy') ? c.firstElementChild : c))
  const itemLeft = (i) => {
    const els = itemEls()
    return (els[i].getBoundingClientRect().left - els[0].getBoundingClientRect().left) / scaleOf(row.current)
  }
  // one item's width plus the gap
  const stepSize = () => (count > 1 ? itemLeft(1) : row.current.clientWidth * 0.8)
  const step = (dir) => row.current.scrollBy({ left: dir * stepSize(), behavior: 'smooth' })
  const go = (i) => row.current.scrollTo({ left: itemLeft(i), behavior: 'smooth' })

  // the dots' state: set only when it changes, not on every scrolled frame
  useEffect(() => {
    const el = row.current
    let last = ''
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      const next = {
        scrollable: max > 1,
        current: max > 1 ? Math.round((el.scrollLeft / max) * (count - 1)) : 0,
      }
      const key = JSON.stringify(next)
      if (key !== last) { last = key; setState(next) }
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    el.addEventListener('scroll', update, { passive: true })
    return () => { ro.disconnect(); el.removeEventListener('scroll', update) }
  }, [count])

  // The carousel: slides the row a little every frame while nobody is using it
  const hold = useRef({ hover: false, down: false, focus: false, until: 0 })
  const holdFor = (ms) => { hold.current.until = Math.max(hold.current.until, performance.now() + ms) }
  useEffect(() => {
    if (!auto) return undefined
    const el = row.current
    let frame = 0, prev = 0, pos = el.scrollLeft, visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(el)
    const tick = (now) => {
      frame = requestAnimationFrame(tick)
      const dt = Math.min(64, now - (prev || now)) / 1000
      prev = now
      const h = hold.current
      if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft // the visitor moved it: carry on from there
      const half = count ? itemLeft(count) : 0 // one set of items: where the copies start
      if (h.hover || h.down || h.focus || now < h.until || !visible || document.hidden || !half) return
      pos += (stepSize() / auto) * dt
      if (pos >= half) pos -= half // the second set looks the same as the first: jump back by one set
      el.scrollLeft = pos
    }
    frame = requestAnimationFrame(tick)
    // a visitor scrolling by hand (swipe, wheel, trackpad) holds it for a moment; so does a jump back by one set
    // when they slide past the start
    const onWheel = () => holdFor(2000)
    const onTouch = () => holdFor(2500)
    el.addEventListener('wheel', onWheel, { passive: true })
    el.addEventListener('touchstart', onTouch, { passive: true })
    el.addEventListener('touchmove', onTouch, { passive: true })
    el.addEventListener('touchend', onTouch, { passive: true })
    return () => {
      cancelAnimationFrame(frame); io.disconnect()
      el.removeEventListener('wheel', onWheel); el.removeEventListener('touchstart', onTouch)
      el.removeEventListener('touchmove', onTouch); el.removeEventListener('touchend', onTouch)
    }
  }, [auto]) // eslint-disable-line react-hooks/exhaustive-deps -- stepSize reads the DOM each frame

  // Dragging with the mouse (touch screens scroll natively). Positions inside a zoomed-out layout (the phone
  // layout's .dz) come in screen pixels, so the drag is scaled to the row's own pixels.
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = row.current
    const zoom = scaleOf(el)
    const x0 = e.clientX, left0 = el.scrollLeft
    let moved = false
    hold.current.down = true
    const move = (ev) => {
      const dx = (ev.clientX - x0) / zoom
      if (!moved && Math.abs(dx) > 4) { moved = true; el.classList.add('is-dragging') }
      if (moved) {
        let left = left0 - dx
        // a looping row: dragged past either end, carry on into the other set
        if (auto) { const half = itemLeft(count); left = ((left % half) + half) % half }
        el.scrollLeft = left
      }
    }
    const up = () => {
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
      el.classList.remove('is-dragging')
      hold.current.down = false
      holdFor(2000)
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
      const from = Math.round(el.scrollLeft / size)
      const dragged = (el.scrollLeft - left0) / size
      const to = Math.abs(dragged) > 0.15 ? Math.round(left0 / size) + Math.sign(dragged) * Math.max(1, Math.round(Math.abs(dragged))) : from
      go(Math.max(0, Math.min(itemEls().length - 1, to)))
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
  const mouse = (fn) => (e) => { if (e.pointerType === 'mouse') fn() }

  const { scrollable, current } = state
  return (
    <div className={`hs ${scrollable ? 'is-scrollable' : ''} ${auto ? 'is-auto' : ''} ${className}`}
      onPointerEnter={mouse(() => { hold.current.hover = true })}
      onPointerLeave={mouse(() => { hold.current.hover = false; holdFor(800) })}
      // keyboard focus holds it (a mouse click also focuses, but the mouse hold covers that)
      onFocus={(e) => { if (e.target.matches(':focus-visible')) hold.current.focus = true }}
      onBlur={() => { hold.current.focus = false; holdFor(800) }}>
      <div className={`hs-row ${rowClassName}`} ref={row} onPointerDown={onPointerDown} onKeyDown={onKeyDown}
        role="region" aria-label={label} tabIndex={scrollable ? 0 : undefined}>
        {items}
        {/* a looping carousel shows the items twice; the copies take clicks (half the cards on screen can be
            copies) but are hidden from screen readers */}
        {auto > 0 && items.map((item, i) => (
          <div className="hs-copy" key={`copy-${i}`} aria-hidden="true">{item}</div>
        ))}
      </div>
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
