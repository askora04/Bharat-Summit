import { useState } from 'react'
import { TriBar } from './shared.jsx'
import { DAYS, THEMES, EXHIBITIONS } from './scheduleData.js'
import './schedule.css'

// Day buttons over a Time / Session / Theme / Description table, as in the agenda document
const tabLabel = (t) => `${t.tab} — ${t.short.split(' ').slice(1).join(' ')}`
const EXPO = 'expo' // the tab after the days: Expo & Exhibitions

// Rows take their theme's colour for the hover accent; untagged ones use navy.
// data-label names each cell when rows stack into cards on phones (see schedule.css)
function Row({ time, timeLabel, label, title, theme, desc, color = '#082852', ink = '#082852' }) {
  const t = THEMES[theme]
  return (
    <tr className="sc-row" style={{ '--c': t?.color ?? color, '--ink': t?.ink ?? ink }}>
      <td className="sc-row-time" data-label={timeLabel}>{time}</td>
      <td className="sc-row-session" data-label="Session"><span>{label}:</span> {title}</td>
      <td className="sc-row-theme" data-label="Theme">{t?.name}</td>
      <td className="sc-row-desc" data-label="Description">{desc}</td>
    </tr>
  )
}

// Expo & Exhibitions: Date / Exhibition / Description
function ExpoTable() {
  return (
    <table className="sc-table sc-expo-table" aria-labelledby="sc-heading">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Exhibition</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody key={EXPO}>
        {EXHIBITIONS.map(({ date, title, theme, desc }) => {
          const t = THEMES[theme]
          return (
            <tr className="sc-row" key={title} style={{ '--c': t?.color ?? '#082852', '--ink': t?.ink ?? '#082852' }}>
              <td className="sc-row-time" data-label="Date">{date}</td>
              <td className="sc-row-session" data-label="Exhibition">{title}</td>
              <td className="sc-row-desc" data-label="Description">{desc}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function SchedulePage() {
  const [tab, setTab] = useState(DAYS[0].id) // opens on the first day, Day 0
  const day = DAYS.find((d) => d.id === tab)

  return (
    <>
      <section className="sc-hero">
        <div className="sc-wrap">
          <p className="sc-hero-kicker">BHARAT SUMMIT 2026</p>
          <h1>AGENDA &amp; <strong>SCHEDULE</strong></h1>
          <p className="sc-hero-lede">A programme of plenary sessions, panel discussions and exhibitions exploring a more just and inclusive global order.</p>
          <p className="sc-hero-meta">12–14 November 2026 · HICC, Hyderabad</p>
          <TriBar className="sc-hero-bar" />
        </div>
      </section>

      <main className="sc-page" id="programme">
        <div className="sc-days" role="tablist" aria-label="Programme days">
          {DAYS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className="sc-day"
              onClick={() => setTab(t.id)}>
              {tabLabel(t)}
            </button>
          ))}
          <button role="tab" aria-selected={tab === EXPO} className="sc-day" onClick={() => setTab(EXPO)}>
            Expo &amp; Exhibitions
          </button>
        </div>

        <h2 className="sc-heading" id="sc-heading">
          {day ? `${day.tab} — ${day.date}` : 'Expo & Exhibitions — 12–14 November 2026'}
        </h2>

        {day ? (
          <table className="sc-table" aria-labelledby="sc-heading">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Session</th>
                <th scope="col">Theme</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody key={tab}>
              {day.sessions.map((s) => <Row key={s.label + s.title} timeLabel="Time" {...s} />)}
            </tbody>
          </table>
        ) : <ExpoTable />}
      </main>
    </>
  )
}
