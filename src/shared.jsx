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

// Hero headlines: letters rise in one after another; screen readers get the plain text
export function Letters({ text }) {
  return (
    <span className="letters" aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden className="li" style={{ '--li': i }}>{ch === ' ' ? '\u00a0' : ch}</span>
      ))}
    </span>
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

// A row that drifts sideways forever; pauses on hover/focus. Rendered twice for a seamless loop,
// the second copy hidden from screen readers and keyboard. `secs` is the time per item.
// `clickableCopy` keeps the second copy clickable (inert would block the mouse too); render(item, copy)
// must then take its controls out of the tab order when copy is 1.
export function Marquee({ items, render, className = '', secs = 6, clickableCopy = false }) {
  return (
    <div className={`marquee ${className}`} style={{ '--dur': `${items.length * secs}s` }}>
      <div className="marquee-track">
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
