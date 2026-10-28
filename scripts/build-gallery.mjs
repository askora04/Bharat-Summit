// Turns the photographer's album folders into the web gallery, served with the site at /gallery
// (or uploaded to S3, see VITE_GALLERY_URL):
//   public/gallery/gallery.json             what the site reads: albums, photos, captions
//   public/gallery/<album>/<photo>-<w>.webp  each photo at every width in SIZES
// Usage: npm run gallery -- <folder with album folders> [<another folder with album folders> ...]
//   e.g. npm run gallery -- "D:/govt/Photos for the website-20261028T204223Z-1-001/Photos for the website"
// Re-running skips photos already converted, so new photos can be added to an album at any time.
import { readdir, mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { join } from 'node:path'
import { availableParallelism } from 'node:os'
import { createHash } from 'node:crypto'
import sharp from 'sharp'

const SOURCES = process.argv.slice(2)
const OUT = 'public/gallery'
const SIZES = [480, 960, 1600] // grid (1x / 2x), and the full-screen view
const WEBP = { quality: 80, effort: 5, smartSubsample: true }
const CREDIT = '© Maurice Weiss/Ostkreuz' // unless the album names its own photographer

// One album per source folder, in the order the site lists them. `caption` is the photo's one line;
// `dateEnd` marks an album that spans several days.
const ALBUMS = [
  { folder: 'Day 1', id: 'day-1', title: 'Day 1', date: '2025-04-24',
    caption: 'Panels and conversations on the opening day' },
  { folder: 'Day 2', id: 'day-2', title: 'Day 2', date: '2025-04-25',
    caption: 'Panels and conversations on day two' },
  { folder: 'Final Day', id: 'final-day', title: 'Final Day', date: '2025-04-26',
    caption: 'The final day, with Rahul Gandhi on the main stage at HICC' },
]

// Optional per-photo lines, replacing the album caption: { "day-2/250425mw0154": "..." }
const CAPTIONS_FILE = 'scripts/gallery-captions.json'
// Photos shown in the home page's Moments section; the first FEATURED_COUNT spread across albums if empty.
// Pinned so adding photos doesn't reshuffle the home page; each has its own caption.
const FEATURED = [
  'day-1/dsc_1047', 'day-1/dsc_1591', 'day-1/dsc_1870', 'day-1/dsc_1295', 'day-1/dsc_1132',
  'day-2/cvp03642', 'day-2/dsc_1779', 'day-2/dsc_2030', 'day-2/dsc01304', 'day-2/cvp03808', 'day-2/dsc_2150',
  'final-day/dsc02063', 'final-day/dsc_2229', 'final-day/dsc02193', 'final-day/dsc02381', 'final-day/dsc_2284',
]
const FEATURED_COUNT = 16

if (!SOURCES.length) {
  console.error('Usage: npm run gallery -- <folder with album folders> [<another folder with album folders> ...]')
  process.exit(1)
}

const exists = (p) => access(p).then(() => true, () => false)
const captions = (await exists(CAPTIONS_FILE)) ? JSON.parse(await readFile(CAPTIONS_FILE, 'utf8')) : {}
// Previous run's entries, so unchanged photos don't need re-reading
const previous = (await exists(join(OUT, 'gallery.json')))
  ? Object.fromEntries(JSON.parse(await readFile(join(OUT, 'gallery.json'), 'utf8')).photos.map((p) => [p.id, p]))
  : {}

// 250425mw0154LowRessRGB.jpg -> 250425mw0154, 2F2A0009(1).JPG -> 2f2a0009-1
const photoId = (file) => file.replace(/\.jpe?g$/i, '').replace(/(LowRessRGB|HighAdobeRGB|AdobeHigh|LOWres)$/i, '')
  .replace(/\s*\((\d+)\)$/, '-$1').toLowerCase()

async function convert(src, id, credit) {
  const last = join(OUT, `${id}-${SIZES.at(-1)}.webp`)
  if (previous[id] && (await exists(last))) return previous[id]

  // .rotate() applies the camera's orientation; output is converted to sRGB (some originals are Adobe RGB)
  const image = sharp(src).rotate()
  const results = await Promise.all(SIZES.map((w) =>
    image.clone()
      .resize({ width: w, height: w, fit: 'inside', withoutEnlargement: true })
      .webp(WEBP)
      .withExifMerge({ IFD0: { Copyright: credit } })
      .toFile(join(OUT, `${id}-${w}.webp`))))
  // Average colour, shown while the photo loads
  const { data } = await sharp(join(OUT, `${id}-${SIZES[0]}.webp`)).resize(1, 1).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = results.at(-1)
  return { id, w: width, h: height, color: '#' + [...data].map((v) => v.toString(16).padStart(2, '0')).join('') }
}

const photos = []
const albums = []
for (const album of ALBUMS) {
  // the album's folder may sit in any of the source folders
  let dir
  for (const src of SOURCES) if (!dir && (await exists(join(src, album.folder)))) dir = join(src, album.folder)
  if (!dir) {
    console.error(`Album folder "${album.folder}" not found in: ${SOURCES.join(', ')}`)
    process.exit(1)
  }
  // a byte-identical copy of an earlier file (e.g. "DSC_1764 (1).JPG" beside "DSC_1764.JPG") is left out
  const seen = new Set()
  const files = []
  for (const f of (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f)).sort()) {
    const hash = createHash('md5').update(await readFile(join(dir, f))).digest('hex')
    if (!seen.has(hash)) { seen.add(hash); files.push(f) }
  }
  await mkdir(join(OUT, album.id), { recursive: true })

  // a few at a time: each conversion already uses several cores
  const credit = album.credit ?? CREDIT
  const queue = files.map((f) => [join(dir, f), `${album.id}/${photoId(f)}`, credit])
  const done = []
  const workers = Array.from({ length: Math.max(2, availableParallelism() / 2) }, async () => {
    for (let job; (job = queue.shift());) {
      done.push(await convert(...job))
      process.stdout.write(`\r${album.id.padEnd(22)} ${done.length}/${files.length}`)
    }
  })
  await Promise.all(workers)
  process.stdout.write('\n')

  done.sort((a, b) => a.id.localeCompare(b.id))
  for (const p of done) photos.push({ ...p, album: album.id, ...(captions[p.id] && { caption: captions[p.id] }) })
  const { folder: _folder, ...info } = album
  albums.push({ ...info, count: done.length })
}

// Spread the featured photos evenly across the whole collection, landscape only (they fill fixed tiles)
const landscape = photos.filter((p) => p.w > p.h)
const featured = FEATURED.length ? FEATURED
  : Array.from({ length: FEATURED_COUNT }, (_, i) => landscape[Math.floor((i + 0.5) * landscape.length / FEATURED_COUNT)].id)

await writeFile(join(OUT, 'gallery.json'), JSON.stringify({ version: 1, sizes: SIZES, credit: CREDIT, albums, featured, photos }))
console.log(`\n${photos.length} photos in ${albums.length} albums -> ${OUT}/`)
