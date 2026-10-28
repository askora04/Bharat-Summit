// Converts the full-size PNG/JPG originals in assets-original/ into WebP in public/assets/,
// at the same path. Run after adding or replacing an original: npm run images
import { readdir, mkdir, stat } from 'node:fs/promises'
import { dirname, extname, join, relative } from 'node:path'
import sharp from 'sharp'

const SRC = 'assets-original'
const OUT = 'public/assets'

// Never wider than this; 2x the widest the image is shown, so it stays sharp on retina screens
const MAX_WIDTH = 2000
const MAX_WIDTH_FOR = {
  'hicc.png': 1600, // venue photo, shown at most ~660px wide
}

// Visually lossless: WebP at these settings is indistinguishable from the original at display size
const WEBP = { quality: 85, alphaQuality: 90, effort: 6, smartSubsample: true }
// Line art, small text and map labels soften at 85, so these get a higher quality
// (lossless was checked too: no visible gain at 2-3x the size)
const DETAILED = { ...WEBP, quality: 90, alphaQuality: 95 }
const WEBP_FOR = {
  'telangana.png': DETAILED,
  'map.png': DETAILED,
  'home/venue-map.png': DETAILED,
  'media-sprite.png': DETAILED,
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
  const out = join(OUT, rel.slice(0, -extname(rel).length) + '.webp')
  await mkdir(dirname(out), { recursive: true })

  const { width } = await sharp(src).metadata()
  const max = MAX_WIDTH_FOR[rel] ?? MAX_WIDTH
  await sharp(src)
    .resize({ width: Math.min(width, max), withoutEnlargement: true })
    .webp(WEBP_FOR[rel] ?? WEBP)
    .toFile(out)

  const [a, b] = [(await stat(src)).size, (await stat(out)).size]
  before += a
  after += b
  console.log(`${rel.padEnd(32)} ${(a / 1e3).toFixed(0).padStart(6)} KB -> ${(b / 1e3).toFixed(0).padStart(5)} KB`)
}
console.log(`\ntotal ${(before / 1e6).toFixed(2)} MB -> ${(after / 1e6).toFixed(2)} MB`)
