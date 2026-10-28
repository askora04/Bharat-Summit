import { useState, useCallback } from 'react'
import { a, Title, Lines, Portrait } from './shared.jsx'
import { ORGANIZERS, ORGANIZER_PROFILES } from './organizersData.js'
import Profile from './Profile.jsx'

export default function OrganizedBy({ sectionId = 'organised' }) {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (dir) => setOpen((o) => ({ ...o, index: (o.index + dir + o.people.length) % o.people.length })),
    []
  )

  return (
    <>
      <section className="organised reveal" id={sectionId}>
        <Title light="ORGANIZED" bold="BY" />
        <span className="gov-emblem">
          <span className="gov-emblem-halo" aria-hidden />
          <span className="gov-emblem-orbit" aria-hidden />
          <img src={a('telangana-emblem.webp')} width="150" height="150" alt="Government of Telangana" />
        </span>
        <div className="container org-cards">
          {ORGANIZERS.map((o, i) => (
            <button
              className="org-card"
              type="button"
              key={o.name}
              aria-label={`${o.name}, ${o.role.join(' ')}. View profile`}
              onClick={() => setOpen({ people: ORGANIZER_PROFILES, index: i, label: 'ORGANISER', hash: sectionId })}
            >
              <Portrait bg={o.bg} src={a(o.img)} className="org-portrait" />
              <span className="org-body">
                <span className="org-name">{o.name}</span>
                <span className="org-role"><Lines lines={o.role} /></span>
              </span>
              <img className="org-arrow" src={a('card-arrow.svg')} width="30" height="30" alt="" />
            </button>
          ))}
        </div>
      </section>

      {open && (
        <Profile
          people={open.people}
          index={open.index}
          label={open.label}
          shareHash={open.hash}
          onClose={close}
          onStep={step}
        />
      )}
    </>
  )
}
