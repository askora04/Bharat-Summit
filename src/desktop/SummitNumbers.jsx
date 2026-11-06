import { useCallback, useEffect, useRef, useState } from 'react'
import { TriBar } from './shared.jsx'
import './numbers.css'

// Ported from "Summit in Numbers — section-html/Main.dc.html".
const DURATION = 2400 // count-up length per number (ms)
const COUNT_AT = { del: 3700, spk: 4000, par: 4300 } // ms after start: bubble delay + 3.2s, once its rings have risen
const REEL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
const PARTICLE_COLORS = ['#24405F', '#1E6A90', '#2A9DAA', '#7CCBC1', '#F4CFA3', '#F6A623', '#EE6A2A', '#D9282F', '#A31C2B']
const PARTICLES = Array.from({ length: 45 }, (_, i) => ({
  '--a': `${i * 8 + ((i * 37) % 7)}deg`,
  '--d': `${18 + ((i * 53) % 28)}cqw`,
  width: `${(0.6 + ((i * 7) % 7) * 0.25).toFixed(2)}cqw`,
  height: `${(0.6 + ((i * 7) % 7) * 0.25).toFixed(2)}cqw`,
  background: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  animationDelay: `${((i % 5) * 0.03).toFixed(2)}s`,
}))

const NODES = [
  {
    key: 'del', target: 500, suffix: '+', label: ['DELEGATES'],
    pos: { left: '27%', top: '30%', width: '40%' }, fly: { '--fx': '57.5%', '--fy': '50%', '--dl': '.5s' }, bob: '6.2s',
    tint: '#1E6A90', dots: '#7CCBC1', dotsW: 0.7, spin: 'sin-spin', track: '#1E6A90', arc: '#2C8FC0', r: 41, sw: 3.4, core: 36,
    numSize: 'clamp(30px, 9.2cqw, 64px)', lbl: { fontSize: 'clamp(10px, 1.8cqw, 13px)', letterSpacing: '0.22em', color: '#8CC8E4' },
  },
  {
    key: 'spk', target: 70, suffix: '+', label: ['COUNTRIES'],
    pos: { left: '73%', top: '26%', width: '31.9%' }, fly: { '--fx': '-72%', '--fy': '75%', '--dl': '.8s' }, bob: '5.4s',
    tint: '#2A9DAA', dots: '#7CCBC1', dotsW: 0.8, spin: 'sin-spin-r', track: '#2A9DAA', arc: '#2A9DAA', r: 40.5, sw: 3.8, core: 35,
    numSize: 'clamp(26px, 7.4cqw, 52px)', lbl: { fontSize: 'clamp(10px, 1.7cqw, 13px)', letterSpacing: '0.22em', color: '#8ED8DE' },
  },
  {
    key: 'par', target: 2, suffix: 'nd', label: ['ANNUAL', 'CONFERENCE'],
    pos: { left: '50%', top: '76%', width: '27.8%' }, fly: { '--fx': '0%', '--fy': '-93.5%', '--dl': '1.1s' }, bob: '6.8s',
    tint: '#EE6A2A', dots: '#F4CFA3', dotsW: 0.9, spin: 'sin-spin', track: '#EE6A2A', arc: '#EE6A2A', r: 40, sw: 4, core: 34,
    numSize: 'clamp(22px, 6.3cqw, 46px)', lbl: { fontSize: 'clamp(9px, 1.4cqw, 11px)', letterSpacing: '0.16em', lineHeight: 1.3, color: '#F8B48E' },
  },
]


// Odometer: one reel per digit. The ones reel spins continuously; a higher reel only
// rolls forward during the last unit before the place below it wraps, like a real counter.
function odometer(target, v) {
  const out = []
  for (let k = String(target).length - 1; k >= 0; k--) {
    const unit = 10 ** k
    let pos = k === 0 ? v % 10 : (Math.floor(v / unit) % 10) + Math.max(0, (v % unit) - (unit - 1))
    if (v >= target) pos = Math.floor(target / unit) % 10 // land exactly
    out.push({ pos, op: k === 0 ? 1 : Math.min(1, 0.25 + v / unit) })
  }
  return out
}

function Bubble({ node, progress }) {
  const n = node
  return (
    <div className="sin-node" style={n.pos}>
      <div className="sin-fly" style={n.fly}>
        <div className="sin-bob" style={{ '--bob': n.bob }}>
          <svg viewBox="0 0 100 100" className="sin-svg">
            <circle className="sin-grow" style={{ '--gd': '3.4s', '--s0': 0.93 }} cx="50" cy="50" r="50" fill={n.tint} fillOpacity="0.16" />
            <g className="sin-grow" style={{ '--gd': '2.9s', '--s0': 0.88 }}>
              <circle className={n.spin} cx="50" cy="50" r="46.5" fill="none" stroke={n.dots} strokeWidth={n.dotsW} strokeDasharray="0.8 2.4" />
            </g>
            <g className="sin-grow" style={{ '--gd': '2.4s', '--s0': 0.85 }}>
              <circle cx="50" cy="50" r={n.r} fill="none" stroke={n.track} strokeOpacity="0.35" strokeWidth={n.sw} />
              <circle cx="50" cy="50" r={n.r} fill="none" stroke={n.arc} strokeWidth={n.sw} strokeLinecap="round" pathLength="100"
                strokeDasharray="100" strokeDashoffset={(100 - progress * 100).toFixed(2)} transform="rotate(-90 50 50)" />
            </g>
            <circle className="sin-grow" style={{ '--gd': '.2s', '--s0': 0 }} cx="50" cy="50" r={n.core} fill="#1B2536" />
          </svg>
          <div className="sin-text">
            <span className="sin-num" style={{ '--dl': n.fly['--dl'], fontSize: n.numSize }}>
              {odometer(n.target, n.target * progress).map((c, i) => (
                <span className="sin-col" key={i} style={{ opacity: c.op.toFixed(2) }}>
                  <span className="sin-reel" style={{ transform: `translateY(${(-c.pos).toFixed(3)}em)` }}>
                    {REEL.map((r, j) => <span key={j}>{r}</span>)}
                  </span>
                </span>
              ))}
              {n.suffix === '+'
                ? <span style={{ color: '#7CCBC1' }}>+</span>
                : <span className="sin-ord">{n.suffix}</span>}
            </span>
            <span className="sin-lbl" style={{ '--dl': n.fly['--dl'], ...n.lbl }}>
              {n.label.map((l) => <span key={l} className="line">{l}</span>)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SummitNumbers() {
  const rootRef = useRef(null)
  const raf = useRef(0)
  const [started, setStarted] = useState(false)
  const [t, setT] = useState(0)

  const start = useCallback(() => {
    setStarted(true)
    setT(0)
    const t0 = performance.now()
    const end = COUNT_AT.par + DURATION
    const tick = (now) => {
      const elapsed = now - t0
      setT(elapsed)
      if (elapsed < end) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    // always animates, even with reduced motion asked for (numbers.css)
    if (typeof IntersectionObserver === 'undefined') return start()
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); start() }
    }, { threshold: 0.25 })
    io.observe(rootRef.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf.current) }
  }, [start])

  const progress = (key) => {
    const p = Math.min(1, Math.max(0, (t - COUNT_AT[key]) / DURATION))
    return 1 - (1 - p) ** 3 // easeOutCubic
  }

  return (
    <section ref={rootRef} className={`sin ${started ? 'is-in' : ''}`} id="intro" aria-labelledby="sin-title">
      <div className="sin-wrap">
        <div className="sin-left">
          <TriBar className="sin-rise d1 sin-tribar" />
          <h2 id="sin-title" className="sin-rise d2 section-title sin-title">BHARAT <strong>SUMMIT</strong></h2>
          <p className="sin-rise d3 sin-intro">Amid rising threats to democracy and an increasingly fragmented world order, the Bharat Summit brings together global leaders, thinkers, and changemakers to shape progressive solutions for common challenges. Organised by the Telangana Government to mark 80 years of Independence and Nehru’s 137th birth anniversary, it also explores how India can lead the way toward a more just and inclusive world.</p>
          <p className="sin-rise d4 sin-date"><strong>Date:</strong> NOV 12–14, 2026</p>
          <div className="sin-rise d4 sin-rule" />
        </div>

        <div className="sin-right">
          <ul className="sr-only">
            <li>500+ delegates.</li>
            <li>70+ countries.</li>
            <li>2nd annual conference.</li>
          </ul>
          <div className="sin-stage" aria-hidden="true">
            <div className="sin-halo" style={{ '--hd': '1.2s', width: '26%', border: '1px dashed #3A4A63' }} />
            <div className="sin-halo" style={{ '--hd': '.9s', width: '19%', border: '2px solid #24405F' }} />
            <div className="sin-halo" style={{ '--hd': '.6s', width: '13%', background: '#1B2536', border: '2px solid #2A9DAA' }} />
            <div className="sin-halo" style={{ '--hd': '.3s', width: '8.5%', background: '#24405F' }} />
            <span className="sin-wave" style={{ borderColor: '#7CCBC1' }} />
            <span className="sin-wave w2" style={{ borderColor: '#F6A623' }} />
            <span className="sin-wave w3" style={{ borderColor: '#D9282F' }} />
            {PARTICLES.map((style, i) => <span key={i} className="sin-p" style={style} />)}
            <div className="sin-core" />

            {/* Connectors, drawn over the sun and under the bubbles: each runs from the sun's solid core
                ring (13% wide) to its bubble's centre, so it reads as one line into the bubble's ring */}
            <svg viewBox="0 0 100 100" className="sin-svg sin-links">
              {NODES.map((n, i) => {
                const [x, y] = [parseFloat(n.pos.left), parseFloat(n.pos.top)]
                const k = 6.5 / Math.hypot(x - 50, y - 50) // start on the core ring's edge
                return (
                  <line key={n.key} className="sin-line" pathLength="1" x1={50 + (x - 50) * k} y1={50 + (y - 50) * k} x2={x} y2={y}
                    stroke={n.track} strokeWidth=".35" strokeLinecap="round"
                    style={{ animationDelay: `${0.5 + i * 0.3}s` }} />
                )
              })}
            </svg>

            {NODES.map((n) => <Bubble key={n.key} node={n} progress={progress(n.key)} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
