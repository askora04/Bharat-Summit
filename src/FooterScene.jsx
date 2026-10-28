import { a } from './shared.jsx'
import { HILL_LAYERS } from './footerHills.js'
import { SVG_BOATS } from './footerBoats.js'

// Footer artwork lives in public/assets/footer/<folder>/<name>.webp
const art = (folder, name) => a(`footer/${folder}/${name}.webp`)
// The Figma houseboat and canoe live with the skyline strip; the other boats have their own folder
const boatFolder = (id) => (id === 'houseboat' || id === 'canoe' ? 'skyline' : 'boats')

// Everything is measured in source pixels and scaled by --strip-h / 468 in CSS.
const STRIP_W = 1438
const STRIP_H = 468
const LANDMARK_GAP = 26

// Monuments inside the original Figma skyline strip, at their box in it
const MONUMENTS = [
  { id: 'trees-left', name: 'Trees', left: 0, top: 283, width: 76, height: 92 },
  { id: 'lotus-temple', name: 'Lotus Temple, Delhi', left: 76, top: 243, width: 317, height: 132 },
  { id: 'india-gate', name: 'India Gate, Delhi', left: 420, top: 196, width: 140, height: 179 },
  { id: 'palace', name: 'Jama Masjid, Delhi', left: 570, top: 256, width: 200, height: 119 },
  { id: 'qutub-minar', name: 'Qutub Minar, Delhi', left: 786, top: 3, width: 90, height: 372 },
  { id: 'taj-mahal', name: 'Taj Mahal, Agra', left: 906, top: 183, width: 390, height: 192 },
  { id: 'mysore-palace', name: 'Mysore Palace, Mysuru', left: 1298, top: 270, width: 138, height: 105 },
  { id: 'houseboat', name: 'Kerala houseboat', left: 470, top: 378, width: 350, height: 90, boat: true },
  { id: 'canoe', name: 'Boatman in a canoe', left: 996, top: 379, width: 214, height: 89, boat: true },
]

// One landmark per state/UT, each standing on its own ground line (bottom edge)
const LANDMARKS = [
  { id: 'charminar', name: 'Charminar, Telangana', width: 341, height: 243 },
  { id: 'hawa-mahal', name: 'Hawa Mahal, Rajasthan', width: 334, height: 208 },
  { id: 'golden-temple', name: 'Golden Temple, Punjab', width: 378, height: 192 },
  { id: 'gateway-of-india', name: 'Gateway of India, Maharashtra', width: 389, height: 195 },
  { id: 'victoria-memorial', name: 'Victoria Memorial, West Bengal', width: 405, height: 217 },
  { id: 'konark', name: 'Konark Sun Temple, Odisha', width: 377, height: 251 },
  { id: 'meenakshi', name: 'Meenakshi Amman Temple, Tamil Nadu', width: 341, height: 242 },
  { id: 'kedarnath', name: 'Kedarnath Temple, Uttarakhand', width: 356, height: 192 },
  { id: 'khajuraho', name: 'Khajuraho Temples, Madhya Pradesh', width: 382, height: 222 },
  { id: 'bom-jesus', name: 'Basilica of Bom Jesus, Goa', width: 313, height: 210 },
  { id: 'kamakhya', name: 'Kamakhya Temple, Assam', width: 347, height: 223 },
  { id: 'mahabodhi', name: 'Mahabodhi Temple, Bihar', width: 324, height: 232 },
  { id: 'somnath', name: 'Somnath Temple, Gujarat', width: 372, height: 227 },
  { id: 'hadimba', name: 'Hadimba Temple, Himachal Pradesh', width: 297, height: 221 },
  { id: 'tirupati', name: 'Tirupati Balaji Temple, Andhra Pradesh', width: 332, height: 198 },
  { id: 'kangla', name: 'Kangla Fort, Manipur', width: 343, height: 175 },
  { id: 'solomons-temple', name: "Solomon's Temple, Mizoram", width: 343, height: 225 },
  { id: 'naga-village', name: 'Naga Heritage Village, Nagaland', width: 353, height: 226 },
  { id: 'ujjayanta', name: 'Ujjayanta Palace, Tripura', width: 392, height: 214 },
  { id: 'kashi-vishwanath', name: 'Kashi Vishwanath Temple, Uttar Pradesh', width: 358, height: 242 },
  { id: 'cellular-jail', name: 'Cellular Jail, Andaman & Nicobar', width: 369, height: 197 },
  { id: 'hari-parbat', name: 'Hari Parbat Fort, Jammu & Kashmir', width: 338, height: 218 },
  { id: 'tathagata', name: 'Tathagata Buddha Park, Sikkim', width: 361, height: 236 },
  { id: 'tawang', name: 'Tawang Monastery, Arunachal Pradesh', width: 367, height: 203 },
  { id: 'baidyanath', name: 'Baidyanath Temple, Jharkhand', width: 242, height: 226 },
  { id: 'bhoramdeo', name: 'Bhoramdeo Temple, Chhattisgarh', width: 268, height: 220 },
  { id: 'hampi', name: 'Hampi Stone Chariot, Karnataka', width: 286, height: 188 },
  { id: 'padmanabhaswamy', name: 'Padmanabhaswamy Temple, Kerala', width: 240, height: 209 },
  { id: 'sheikh-chilli', name: "Sheikh Chilli's Tomb, Haryana", width: 396, height: 211 },
]

// Boats along the river under the landmarks: x from the start of a loop copy, bottom above
// the strip's lower edge (the river is the bottom 92 units), size scale and facing
const BOAT_SIZES = {
  'kerala-houseboat': [230, 68],
  'varanasi-boat': [111, 30],
  'gateway-boat': [100, 22],
  houseboat: [350, 90],
  canoe: [214, 89],
  ...Object.fromEntries(Object.entries(SVG_BOATS).map(([id, { width, height }]) => [id, [width, height]])),
}
const BOATS = [
  { id: 'rowboat', x: 1560, bottom: 30, scale: 0.7 },
  { id: 'varanasi-boat', x: 1950, bottom: 36, scale: 1 },
  { id: 'snake-boat', x: 2400, bottom: 14, scale: 0.7 },
  { id: 'kerala-houseboat', x: 3050, bottom: 4, scale: 0.78, flip: true },
  { id: 'dhow', x: 3650, bottom: 10, scale: 0.62 },
  { id: 'gateway-boat', x: 4150, bottom: 44, scale: 1, flip: true },
  { id: 'ferry', x: 4600, bottom: 6, scale: 0.62 },
  { id: 'canoe', x: 5250, bottom: 8, scale: 0.7, flip: true },
  { id: 'yacht', x: 5800, bottom: 14, scale: 0.55 },
  { id: 'trawler', x: 6300, bottom: 6, scale: 0.6, flip: true },
  { id: 'varanasi-boat', x: 6900, bottom: 40, scale: 1.1, flip: true },
  { id: 'houseboat', x: 7400, bottom: 2, scale: 0.62 },
  { id: 'snake-boat', x: 8100, bottom: 16, scale: 0.65, flip: true },
  { id: 'dhow', x: 8700, bottom: 6, scale: 0.6, flip: true },
  { id: 'gateway-boat', x: 9150, bottom: 38, scale: 1.1 },
  { id: 'kerala-houseboat', x: 9700, bottom: 6, scale: 0.74 },
  { id: 'rowboat', x: 10300, bottom: 34, scale: 0.65, flip: true },
  { id: 'ferry', x: 10800, bottom: 4, scale: 0.6, flip: true },
  { id: 'yacht', x: 11400, bottom: 20, scale: 0.5 },
  { id: 'trawler', x: 11850, bottom: 8, scale: 0.58 },
]

// Two copies: the loop slides exactly one copy's width (see monument-scroll in Footer.css)
const COPIES = 2
// Keep the drift near 40px/s on desktop (--strip-h 332px) however long the loop is
const LOOP_UNITS = STRIP_W + LANDMARKS.reduce((sum, { width }) => sum + width + LANDMARK_GAP, 0)
const LOOP_SECONDS = Math.round((LOOP_UNITS * (332 / STRIP_H)) / 40)

const pct = (v, total) => `${(v / total) * 100}%`

function Layers({ outline, colour, lazy, reflect }) {
  const loading = lazy ? 'lazy' : undefined
  return (
    <>
      {reflect && (
        <img className="skyline-item-reflection" src={outline} alt="" draggable="false" loading={loading} />
      )}
      <img className="skyline-item-outline" src={outline} alt="" draggable="false" loading={loading} />
      <img className="skyline-item-colour" src={colour} alt="" draggable="false" loading={loading} />
    </>
  )
}

function BoatDrawing({ width, height, paths }) {
  return (
    <svg className="boat-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {paths.map(([d, fill]) => (
        <path key={d} d={d} style={fill ? { '--fill': fill } : undefined} />
      ))}
    </svg>
  )
}

function SkylineTile() {
  return (
    <div className="skyline-tile">
      <div className="skyline-strip">
        <img
          className="skyline-base"
          src={art('skyline', 'skyline-base')}
          alt=""
          width={STRIP_W}
          height={STRIP_H}
          draggable="false"
        />
        {MONUMENTS.map(({ id, name, left, top, width, height, boat }) => (
          <div
            key={id}
            className={boat ? 'skyline-item skyline-item--boat' : 'skyline-item'}
            title={name}
            style={{
              left: pct(left, STRIP_W),
              top: pct(top, STRIP_H),
              width: pct(width, STRIP_W),
              height: pct(height, STRIP_H),
            }}
          >
            <Layers outline={art('skyline', `${id}-outline`)} colour={art('skyline', id)} reflect={!boat} />
          </div>
        ))}
      </div>
      {LANDMARKS.map(({ id, name, width, height }) => (
        <div
          key={id}
          className="skyline-item skyline-landmark"
          title={name}
          style={{ '--w': width, '--h': height }}
        >
          <Layers outline={art('landmarks', `${id}-outline`)} colour={art('landmarks', id)} lazy reflect />
        </div>
      ))}
      {BOATS.map(({ id, x, bottom, scale, flip }) => (
        <div
          key={`${id}-${x}`}
          className={
            flip
              ? 'skyline-item skyline-item--boat skyline-boat skyline-boat--flip'
              : 'skyline-item skyline-item--boat skyline-boat'
          }
          style={{
            '--x': x,
            '--b': bottom,
            '--w': BOAT_SIZES[id][0] * scale,
            '--h': BOAT_SIZES[id][1] * scale,
          }}
        >
          {SVG_BOATS[id] ? (
            <BoatDrawing {...SVG_BOATS[id]} />
          ) : (
            <Layers outline={art(boatFolder(id), `${id}-outline`)} colour={art(boatFolder(id), id)} lazy />
          )}
        </div>
      ))}
    </div>
  )
}

export default function FooterScene() {
  return (
    <div className="footer-scene" aria-hidden="true">
      <div className="footer-water" />
      {HILL_LAYERS.map(({ name, width, height, art }) => (
        <div
          key={name}
          className={`footer-hills footer-hills--${name}`}
          style={{ '--art': art, '--hw': width, '--hh': height }}
        />
      ))}
      <div className="skyline-viewport">
        <div className="skyline-track" style={{ '--copies': COPIES, '--loop-duration': `${LOOP_SECONDS}s` }}>
          {Array.from({ length: COPIES }, (_, i) => (
            <SkylineTile key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
