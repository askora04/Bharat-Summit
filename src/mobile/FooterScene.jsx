import { useEffect, useRef } from 'react'
import { a } from './shared.jsx'
import { HILL_LAYERS } from '../data/footerHills.js'

// Footer artwork lives in public/assets/footer/<folder>/<name>.webp
const art = (folder, name) => a(`footer/${folder}/${name}.webp`)

// Everything is measured in source pixels and scaled by --strip-h / 468 in CSS.
const STRIP_H = 468
const GAP = 26

// UNESCO World Heritage Sites come first, the best known first
const UNESCO = [
  { id: 'taj-mahal', folder: 'skyline', name: 'Taj Mahal, Agra', width: 390, height: 192 },
  { id: 'qutub-minar', folder: 'skyline', name: 'Qutub Minar, Delhi', width: 90, height: 372 },
  { id: 'konark', name: 'Konark Sun Temple, Odisha', width: 377, height: 251 },
  { id: 'khajuraho', name: 'Khajuraho Temples, Madhya Pradesh', width: 382, height: 222 },
  { id: 'hampi', name: 'Hampi Stone Chariot, Karnataka', width: 286, height: 188 },
  { id: 'mahabodhi', name: 'Mahabodhi Temple, Bihar', width: 324, height: 232 },
  { id: 'bom-jesus', name: 'Basilica of Bom Jesus, Goa', width: 313, height: 210 },
  { id: 'hawa-mahal', name: 'Hawa Mahal, Rajasthan', width: 334, height: 208 }, // part of the Jaipur City site
]

// Then the rest, led by the host city's Charminar
const OTHERS = [
  { id: 'charminar', name: 'Charminar, Telangana', width: 341, height: 243 },
  { id: 'lotus-temple', folder: 'skyline', name: 'Lotus Temple, Delhi', width: 317, height: 132 },
  { id: 'india-gate', folder: 'skyline', name: 'India Gate, Delhi', width: 140, height: 179 },
  { id: 'palace', folder: 'skyline', name: 'Jama Masjid, Delhi', width: 200, height: 119 },
  { id: 'mysore-palace', folder: 'skyline', name: 'Mysore Palace, Mysuru', width: 138, height: 105 },
  { id: 'golden-temple', name: 'Golden Temple, Punjab', width: 378, height: 192 },
  { id: 'gateway-of-india', name: 'Gateway of India, Maharashtra', width: 389, height: 195 },
  { id: 'victoria-memorial', name: 'Victoria Memorial, West Bengal', width: 405, height: 217 },
  { id: 'meenakshi', name: 'Meenakshi Amman Temple, Tamil Nadu', width: 341, height: 242 },
  { id: 'kedarnath', name: 'Kedarnath Temple, Uttarakhand', width: 356, height: 192 },
  { id: 'kamakhya', name: 'Kamakhya Temple, Assam', width: 347, height: 223 },
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
  { id: 'padmanabhaswamy', name: 'Padmanabhaswamy Temple, Kerala', width: 240, height: 209 },
  { id: 'sheikh-chilli', name: "Sheikh Chilli's Tomb, Haryana", width: 396, height: 211 },
]

const MONUMENTS = [...UNESCO, ...OTHERS]

// Two copies: the loop slides exactly one copy's width (see monument-scroll in Footer.css)
const COPIES = 2
// Keep the drift near 40px/s on desktop (--strip-h 332px) however long the loop is
const LOOP_UNITS = MONUMENTS.reduce((sum, { width }) => sum + width + GAP, 0)
const LOOP_SECONDS = Math.round((LOOP_UNITS * (332 / STRIP_H)) / 40)

function SkylineTile() {
  return (
    <div className="skyline-tile">
      {MONUMENTS.map(({ id, folder = 'landmarks', name, width, height }) => (
        <div key={id} className="skyline-item" style={{ '--w': width, '--h': height }}>
          <img className="skyline-item-outline" src={art(folder, `${id}-outline`)} alt="" draggable="false" loading="lazy" />
          <img className="skyline-item-colour" src={art(folder, id)} alt="" draggable="false" loading="lazy" />
          <span className="skyline-name">{name}</span>
        </div>
      ))}
    </div>
  )
}

export default function FooterScene() {
  const scene = useRef(null)
  // the skyline only moves while it is on screen, so a visitor reaching the footer starts at the UNESCO sites
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      scene.current?.classList.toggle('is-in-view', entry.isIntersecting)
    })
    observer.observe(scene.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="footer-scene" ref={scene} aria-hidden="true">
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
