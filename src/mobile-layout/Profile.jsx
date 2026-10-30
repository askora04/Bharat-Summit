import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Portrait } from './shared.jsx'
import './profile.css'

const ICONS = {
  close: <path d="M18 6 6 18M6 6l12 12" />,
  prev: <path d="m15 18-6-6 6-6" />,
  next: <path d="m9 18 6-6-6-6" />,
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  chat: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  share: <><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="m16 6-4-4-4 4M12 2v13" /></>,
}

// the bio with each occurrence of `phrase` in bold
function marked(text, phrase) {
  if (!phrase) return text
  return text.split(phrase).flatMap((part, i) => (i ? [<strong key={i}>{phrase}</strong>, part] : [part]))
}

function Icon({ name, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[name]}
    </svg>
  )
}

// Full-screen profile over a deep, blurred backdrop: photo on the left, details on the right.
// people: [{ name, bio, highlight?, bg, img }]. No share links on phones.
export default function Profile({ people, index, label, onClose, onStep }) {
  const p = people[index]
  const closeRef = useRef(null)

  useEffect(() => {
    const opener = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onStep(-1)
      if (e.key === 'ArrowRight') onStep(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      opener?.focus?.()
    }
  }, [onClose, onStep])

  return createPortal(
    <div className="sp-profile" role="dialog" aria-modal="true" aria-labelledby="sp-name" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sp-backdrop" style={{ background: p.bg }} aria-hidden>
        <img src={p.img} alt="" />
      </div>
      <button className="sp-close" ref={closeRef} onClick={onClose} aria-label="Close profile"><Icon name="close" size={22} /></button>
      {people.length > 1 && (
        <>
          <button className="sp-step sp-prev" onClick={() => onStep(-1)} aria-label="Previous profile"><Icon name="prev" size={22} /></button>
          <button className="sp-step sp-next" onClick={() => onStep(1)} aria-label="Next profile"><Icon name="next" size={22} /></button>
        </>
      )}

      {/* keyed so each profile re-runs its entrance */}
      <div className="sp-content" key={index}>
        <Portrait bg={p.bg} className="sp-photo">
          <img src={p.img} alt="" />
        </Portrait>
        <div className="sp-info">
          <p className="sp-meta">{label} <span>—</span> {index + 1} / {people.length}</p>
          <h3 id="sp-name">{p.name}</h3>
          <p className="sp-bio">{marked(p.bio, p.highlight)}</p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
