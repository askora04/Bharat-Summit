// Distant mountain ranges and nearer hills behind the skyline, drawn as seamless
// repeating SVG backgrounds. Seeded so they look the same on every load.

const random = (seed) => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32

const svgUrl = (width, height, body) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${body}</svg>`,
  )}")`

const fade = (id, colour) =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${colour}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`

// One ridge of sharp peaks with shoulders, a facet line and a zigzag snow line per summit
function ridge({ width, height, count, min, max, seed }) {
  const rand = random(seed)
  const step = width / count
  let line = `M0 ${height - min}`
  let detail = ''
  for (let i = 0; i < count; i++) {
    const x = i * step
    const px = x + step * (0.35 + rand() * 0.3)
    const py = height - (min + rand() * (max - min))
    const drop = height - py
    // Last valley returns to the starting height so the tile repeats seamlessly
    const valley = i === count - 1 ? height - min : height - min * (0.75 + rand() * 0.4)
    const lx = px - step * 0.22,
      ly = py + drop * 0.3
    const rx = px + step * 0.24,
      ry = py + drop * 0.36
    line += `L${lx} ${ly}L${px} ${py}L${rx} ${ry}L${x + step} ${valley}`
    const t = Math.min(15, drop * 0.22)
    const sl = (px - lx) / (ly - py),
      sr = (rx - px) / (ry - py)
    detail +=
      `M${px - t * sl} ${py + t}L${px - t * sl * 0.5} ${py + t - 5}L${px} ${py + t + 3}` +
      `L${px + t * sr * 0.5} ${py + t - 4}L${px + t * sr} ${py + t}` +
      `M${px} ${py}L${px + step * 0.08} ${py + drop * 0.5}`
  }
  return { line, detail, fill: `${line}L${width} ${height}L0 ${height}Z` }
}

// A pale, taller range behind a denser front range
function mountains({ width, height }) {
  const back = ridge({ width, height, count: 10, min: 105, max: 225, seed: 7 })
  const front = ridge({ width, height, count: 15, min: 45, max: 140, seed: 13 })
  return svgUrl(
    width,
    height,
    fade('b', '#e6eef8') +
      fade('f', '#d6e4f4') +
      `<path d="${back.fill}" fill="url(#b)"/>` +
      `<path d="${back.line}${back.detail}" fill="none" stroke="#c2d3ea" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<path d="${front.fill}" fill="url(#f)"/>` +
      `<path d="${front.line}${front.detail}" fill="none" stroke="#9db6d8" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>`,
  )
}

// Soft rolling hills
function hills({ width, height, count, min, max, seed }) {
  const rand = random(seed)
  const step = width / count
  let ridge = `M0 ${height - min}`
  let prev = height - min
  for (let i = 0; i < count; i++) {
    const x = i * step
    const top = height - (min + rand() * (max - min))
    const valley = i === count - 1 ? height - min : height - min * (0.7 + rand() * 0.6)
    // Control point chosen so the curve's midpoint lands on the hilltop
    ridge += `Q${x + step / 2} ${2 * top - (prev + valley) / 2} ${x + step} ${valley}`
    prev = valley
  }
  const fill = `${ridge}L${width} ${height}L0 ${height}Z`
  return svgUrl(
    width,
    height,
    fade('h', '#e6eff9') +
      `<path d="${fill}" fill="url(#h)"/>` +
      `<path d="${ridge}" fill="none" stroke="#b3c8e3" stroke-width="1.5" stroke-linecap="round"/>`,
  )
}

// width/height are in strip source pixels (scaled by --strip-h / 468 in CSS)
export const HILL_LAYERS = [
  { name: 'far', width: 2600, height: 230, art: mountains({ width: 2600, height: 230 }) },
  {
    name: 'near',
    width: 1700,
    height: 95,
    art: hills({ width: 1700, height: 95, count: 7, min: 24, max: 85, seed: 21 }),
  },
]
