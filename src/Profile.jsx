import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Portrait } from './shared.jsx'
import './profile.css'

const ICONS = {
  close: <path d="M18 6 6 18M6 6l12 12" />,
  prev: <path d="m15 18-6-6 6-6" />,
  next: <path d="m9 18 6-6-6-6" />,
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
// people: [{ name, role, bio, bg, img }]
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
          <p className="sp-role">{p.role}</p>
          <p className="sp-bio">{p.bio}</p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
