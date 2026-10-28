// Turns the photographer's album folders into the web gallery, served with the site at /gallery
// (or uploaded to S3, see VITE_GALLERY_URL):
//   public/gallery/gallery.json             what the site reads: albums, photos, captions
//   public/gallery/<album>/<photo>-<w>.webp  each photo at every width in SIZES
// Usage: npm run gallery -- <folder with album folders> [<another folder with album folders> ...]
// Re-running skips photos already converted, so new photos can be added to an album at any time.
import { readdir, mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { join } from 'node:path'
import { availableParallelism } from 'node:os'
import sharp from 'sharp'

const SOURCES = process.argv.slice(2)
const OUT = 'public/gallery'
const SIZES = [480, 960, 1600] // grid (1x / 2x), and the full-screen view
const WEBP = { quality: 80, effort: 5, smartSubsample: true }
const CREDIT = '© Maurice Weiss/Ostkreuz' // unless the album names its own photographer

// One album per source folder, in the order the site lists them. `caption` is the photo's one line;
// `dateEnd` marks an album that spans several days.
const ALBUMS = [
  { folder: '250422Familypicture', id: 'gender-working-group', title: 'Gender Working Group', date: '2025-04-24',
    caption: 'Delegates gather for the Gender Working Group family photo' },
  { folder: '250424Arabmeeting', id: 'arab-meeting', title: 'Arab Regional Meeting', date: '2025-04-24',
    caption: 'Delegates in discussion at the Arab regional meeting' },
  { folder: '250424Day1', id: 'day-1', title: 'Day 1', date: '2025-04-24',
    caption: 'Working sessions and an evening welcome on the opening day' },
  { folder: '250425Day2', id: 'day-2', title: 'Day 2', date: '2025-04-25',
    caption: 'Panels, conversations and a heritage visit on day two' },
  { folder: '250426Day3', id: 'day-3', title: 'Day 3', date: '2025-04-26',
    caption: 'Plenary sessions and conversations on the final day' },
  { folder: '250426Boardmeeting', id: 'board-meeting', title: 'Board Meeting', date: '2025-04-26',
    caption: 'Members of the Progressive Alliance at the board meeting' },
  { folder: '250426FinalsessionRaoul', id: 'final-session', title: 'Final Session', date: '2025-04-26',
    caption: 'The closing plenary with Rahul Gandhi on the main stage at HICC' },
  // Every photo here has its own line in gallery-captions.json
  { folder: 'pictures', id: 'around-the-summit', title: 'Around the Summit', date: '2025-04-25', dateEnd: '2025-04-26',
    caption: 'Scenes from around Bharat Summit 2025 at HICC', credit: '© Santhosh (@thinkingtrack)' },
]

// Optional per-photo lines, replacing the album caption: { "day-2/250425mw0154": "..." }
const CAPTIONS_FILE = 'scripts/gallery-captions.json'
// Photos shown in the home page's Moments section; the first FEATURED_COUNT spread across albums if empty.
// Pinned so adding photos doesn't reshuffle the home page; each has its own caption.
const FEATURED = [
  'arab-meeting/250424mw778743', 'day-1/250424mw0034', 'day-1/250424mw0076', 'day-1/250424mw0117',
  'day-2/250425mw0042', 'day-2/250425mw0083', 'day-2/250425mw0125', 'day-2/250425mw0169',
  'day-3/250426mw0004', 'board-meeting/250426mw0001', 'board-meeting/250426mw0049', 'board-meeting/250426mw0090',
  'board-meeting/250426mw0132', 'final-session/250426mw782005', 'final-session/250426mw782402', 'final-session/250426mw782700',
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
  const files = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f)).sort()
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
