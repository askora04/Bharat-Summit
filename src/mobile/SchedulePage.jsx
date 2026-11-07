import { useState } from 'react'
import { TriBar } from './shared.jsx'
import { MonumentHero } from './SpeakersPage.jsx'
import { DAYS, KINDS, LEGEND } from '../data/scheduleData.js'
import './schedule.css'

// The agenda as in the content document: a colour key, day buttons, then each day's table with Sl. No. / Agenda /
// Name & Details / Time. Every row is shaded by its kind of session (panel, plenary, expo, Telangana Rising),
// in the document's colours, the agenda cell a shade deeper. On phones the rows stack into cards (schedule.css).
const tabLabel = (d) => `${d.tab} — ${d.short.split(' ').slice(1).join(' ')}`

// the details in the document's order: lines of text, and lists (Speakers, Panelists...), Moderator on one line
function Details({ title, parts = [] }) {
  return (
    <>
      <p className="sc-title">{title}</p>
      {parts.map((p, i) => p.text ? <p className="sc-text" key={i}>{p.text}</p>
        : p.items.length === 1 && /moderator/i.test(p.label || '') ? (
          <p className="sc-moderator" key={i}><span>{p.label}:</span> {p.items[0]}</p>
        ) : (
          <div className="sc-group" key={i}>
            {p.label && <p className="sc-group-label">{p.label}</p>}
            <ol>{p.items.map((it) => <li key={it}>{it}</li>)}</ol>
          </div>
        ))}
    </>
  )
}

function Row({ no, kind, agenda, place, title, parts, time }) {
  const k = KINDS[kind]
  return (
    <tr className={`sc-row is-${kind}`} style={{ '--row': k.row, '--agenda': k.agenda }}>
      <td className="sc-no" data-label="Sl. No.">{no}</td>
      <td className="sc-agenda" data-label="Agenda">{agenda}{place && <span className="sc-place">{place}</span>}</td>
      <td className="sc-details" data-label="Name / Details"><Details title={title} parts={parts} /></td>
      <td className="sc-time" data-label="Time">{time}</td>
    </tr>
  )
}

export default function SchedulePage() {
  const [tab, setTab] = useState(DAYS[0].id) // opens on the first day, Day 0
  const day = DAYS.find((d) => d.id === tab)

  return (
    <>
      <MonumentHero className="sc-hero" kicker="BHARAT SUMMIT 2026" title={<>AGENDA &amp; <strong>SCHEDULE</strong></>}>
        <p className="sc-hero-lede">A programme of plenary sessions, panel discussions and exhibitions<br />exploring a more just and inclusive global order.</p>
        <p className="sc-hero-meta">12–14 November 2026 · HICC, Hyderabad</p>
        <TriBar className="sc-hero-bar" />
      </MonumentHero>

      <main className="sc-page" id="programme">
        <ul className="sc-legend" aria-label="Colour key">
          {LEGEND.map((kind) => (
            <li key={kind} style={{ '--agenda': KINDS[kind].agenda }}><span aria-hidden />{KINDS[kind].label}</li>
          ))}
        </ul>

        <div className="sc-days" role="tablist" aria-label="Programme days">
          {DAYS.map((d) => (
            <button key={d.id} role="tab" aria-selected={tab === d.id} className="sc-day" onClick={() => setTab(d.id)}>
              {tabLabel(d)}
            </button>
          ))}
        </div>

        <h2 className="sc-heading" id="sc-heading">{day.tab} · {day.date}</h2>

        <table className="sc-table" aria-labelledby="sc-heading">
          <thead>
            <tr>
              <th scope="col" className="sc-no">Sl. No.</th>
              <th scope="col">Agenda</th>
              <th scope="col">Name / Details</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody key={tab}>
            {day.sessions.map((s) => <Row key={s.no} {...s} />)}
          </tbody>
        </table>
      </main>
    </>
  )
}
