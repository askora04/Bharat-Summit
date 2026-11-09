import { useState, useCallback } from 'react'
import { a, Title, Portrait, Marquee } from './shared.jsx'
import { ORGANIZERS, ORGANIZER_PROFILES } from '../data/organizersData.js'
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
        {/* a looping strip, like the speakers row; the list is doubled so one copy is wider than the screen */}
        <Marquee className="container org-marquee" clickableCopy drag items={[...ORGANIZERS, ...ORGANIZERS]} render={(o, copy) => {
          const i = ORGANIZERS.indexOf(o)
          return (
            <button
              className="org-card"
              type="button"
              tabIndex={copy ? -1 : undefined}
              aria-label={`${o.name}. View profile`}
              onClick={() => setOpen({ people: ORGANIZER_PROFILES, index: i, label: 'ORGANISER' })}
            >
              <Portrait bg={o.bg} src={a(o.img)} className="org-portrait" />
              <span className="org-body">
                <span className="org-name">{o.name}</span>
                <span className="org-role">{o.role}</span>
              </span>
              <img className="org-arrow" src={a('card-arrow.svg')} width="30" height="30" alt="" />
            </button>
          )
        }} />
      </section>

      {open && (
        <Profile
          people={open.people}
          index={open.index}
          label={open.label}
          onClose={close}
          onStep={step}
        />
      )}
    </>
  )
}
