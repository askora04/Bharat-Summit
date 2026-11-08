// Converts the full-size PNG/JPG originals in assets-original/ into WebP in public/assets/,
// at the same path. Run after adding or replacing an original: npm run images
// Only some files: npm run images -- speakers/jane-doe.png speakers/john-doe.png (paths inside assets-original/)
import { readdir, mkdir, stat } from 'node:fs/promises'
import { dirname, extname, join, relative } from 'node:path'
import sharp from 'sharp'

const SRC = 'assets-original'
const OUT = 'public/assets'

// Never wider than this; 2x the widest the image is shown, so it stays sharp on retina screens
const MAX_WIDTH = 2000
const MAX_WIDTH_FOR = {
  'hicc.png': 1320, // venue photo, shown at most ~660px wide (2x)
}
// speaker cut-outs: up to 1024px square, 2x the largest the profile shows them (525px tall)
const SPEAKER_WIDTH = 1024
const toSlash = (p) => p.split('\\').join('/')
const ONLY = process.argv.slice(2).map(toSlash)

// Visually lossless: WebP at these settings is indistinguishable from the original at display size
const WEBP = { quality: 78, alphaQuality: 85, effort: 6, smartSubsample: true }
// Line art, small text and map labels soften at 85, so these get a higher quality
// (lossless was checked too: no visible gain at 2-3x the size)
const DETAILED = { ...WEBP, quality: 90, alphaQuality: 95 }
const WEBP_FOR = {
  'telangana.png': DETAILED,
  'map.png': DETAILED,
  'home/venue-map.png': DETAILED,
  'media-sprite.png': DETAILED,
}

// Speaker cut-outs come framed tighter or looser; each is rescaled, bottom edge kept and head
// centred, so the top of every head (or hat) sits the same distance from the top of the frame.
const SPEAKERS = /^speakers[\\/]/
const HEAD_TOP = 0.13 // of the frame's height

async function measureHead(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const span = (y) => {
    let a = -1, b = -1
    for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 128) { if (a < 0) a = x; b = x }
    return a < 0 ? null : [a, b]
  }
  let top = 0
  while (top < info.height - 1 && !span(top)) top++
  const rows = []
  const depth = Math.round(info.height * 110 / 512), step = Math.max(2, Math.round(depth / 55)) // the top of the head, whatever the size
  for (let y = top; y <= Math.min(top + depth, info.height - 1); y += step) { const r = span(y); if (r) rows.push(r) }
  return { top, centre: rows.reduce((s, [a, b]) => s + (a + b) / 2, 0) / rows.length }
}

async function frameSpeaker(src) {
  const { width: N, height } = await sharp(src).metadata()
  const head = await measureHead(src)
  const scale = (height * (1 - HEAD_TOP)) / (height - head.top)
  const w = Math.round(N * scale), h = Math.round(height * scale)
  const left = Math.round(N / 2 - head.centre * scale), top = height - h
  const clear = { r: 0, g: 0, b: 0, alpha: 0 }
  const placed = await sharp(await sharp(src).resize(w, h).toBuffer())
    .extend({ top: Math.max(0, top), left: Math.max(0, left), right: Math.max(0, N - left - w), bottom: 0, background: clear })
    .toBuffer()
  return sharp(placed).extract({ left: Math.max(0, -left), top: Math.max(0, -top), width: N, height })
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else if (/\.(png|jpe?g)$/i.test(entry.name)) yield path
  }
}

let before = 0
let after = 0
for await (const src of walk(SRC)) {
  const rel = relative(SRC, src)
  if (ONLY.length && !ONLY.includes(toSlash(rel))) continue
  const out = join(OUT, rel.slice(0, -extname(rel).length) + '.webp')
  await mkdir(dirname(out), { recursive: true })

  const { width } = await sharp(src).metadata()
  const max = MAX_WIDTH_FOR[rel] ?? (SPEAKERS.test(rel) ? SPEAKER_WIDTH : MAX_WIDTH)
  const input = SPEAKERS.test(rel) ? await (await frameSpeaker(src)).png().toBuffer() : src
  await sharp(input)
    .resize({ width: Math.min(width, max), withoutEnlargement: true })
    .webp(WEBP_FOR[rel] ?? WEBP)
    .toFile(out)

  const [a, b] = [(await stat(src)).size, (await stat(out)).size]
  before += a
  after += b
  console.log(`${rel.padEnd(32)} ${(a / 1e3).toFixed(0).padStart(6)} KB -> ${(b / 1e3).toFixed(0).padStart(5)} KB`)
}
console.log(`\ntotal ${(before / 1e6).toFixed(2)} MB -> ${(after / 1e6).toFixed(2)} MB`)
