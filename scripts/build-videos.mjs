// Turns the event videos into web-ready files, kept apart from the photo gallery and served with the
// site at /videos (or uploaded to S3, see VITE_VIDEOS_URL):
//   public/videos/videos.json   what the site reads: titles, sizes, durations
//   public/videos/<id>.mp4      H.264 + AAC, upright, starts playing before it has fully downloaded
//   public/videos/<id>.webp     poster frame shown until the video is played
// Usage: npm run videos -- <folder with the original videos>
// Re-running skips videos already converted; delete a video's .mp4 to redo it.
import { mkdir, writeFile, readFile, access, stat } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { join } from 'node:path'
import ffmpeg from 'ffmpeg-static'
import sharp from 'sharp'

const run = promisify(execFile)
const SRC = process.argv[2]
const OUT = 'public/videos'

// In the order the site shows them (the first film is the one featured). `rotate`: the clip was filmed upright but saved sideways.
// `poster`: seconds into the video for the poster frame. `kind`: 'film' (16:9, shown large) or 'clip' (9:16).
// `subtitle`: an optional second line under a clip's title, such as the speaker's role.
const VIDEOS = [
  { file: 'bs25_tvc_v4.mp4', id: 'bharat-summit-2025-tv-spot', kind: 'film', poster: 25.5,
    title: 'Bharat Summit 2025: TV spot', caption: '25–26 April 2025 · Hyderabad International Convention Centre' },
  { file: 'bs25_promo_2404.mp4', id: 'bharat-summit-2025-promo', kind: 'film', poster: 9.4,
    title: 'Bharat Summit 2025: the promo film', caption: 'Who will author the narrative of a just world order?' },
  { file: 'd-sridhar-babu.mp4', id: 'd-sridhar-babu', kind: 'clip', poster: 20,
    title: 'In conversation: Shri D. Sridhar Babu', subtitle: 'Minister for Information Technology, Telangana' },
  { file: 'gurdeep-singh-sappal.mp4', id: 'gurdeep-singh-sappal', kind: 'clip', poster: 20,
    title: 'In conversation: Gurdeep Singh Sappal',
    subtitle: 'In-charge of Administration, AICC · Member, Congress Working Committee' },
  { file: '2j0a1814.mp4', id: 'delegate-interview-1', kind: 'clip', rotate: true, poster: 3,
    title: 'In conversation: T. S. Singh Deo', subtitle: 'Former Deputy Chief Minister, Chhattisgarh' },
  { file: '2j0a1817.mp4', id: 'delegate-interview-2', kind: 'clip', rotate: true, poster: 3,
    title: 'In conversation: Digvijaya Singh', subtitle: 'Agriculturalist and former Member of Rajya Sabha' },
  { file: '2j0a1808.mp4', id: 'charkha-demonstration', kind: 'clip', rotate: true, poster: 1.5,
    title: 'A spinning-wheel demonstration at the exhibition' },
  { file: '2j0a1809.mp4', id: 'exhibition-floor', kind: 'clip', rotate: true, poster: 1.5,
    title: 'Visitors on the exhibition floor' },
]

// Everything is 720p: the films play in a panel (not full screen by default) and the vertical clips are shown
// smaller still, at most 30 fps. CRF differs by kind: the films are fast-cut promo footage, the clips mostly
// interviews, which compress far better. Both stay visually close to the originals (SSIM ~0.98-0.99).
const SIZE = { film: 1280, clip: 1280 } // longest side
const CRF = { film: '23', clip: '27' }
const H264 = (kind) => ['-c:v', 'libx264', '-preset', 'slow', '-crf', CRF[kind], '-profile:v', 'high', '-pix_fmt', 'yuv420p']
const AAC = ['-c:a', 'aac', '-b:a', '96k', '-ac', '2']

if (!SRC) {
  console.error('Usage: npm run videos -- <folder with the original videos>')
  process.exit(1)
}
const exists = (p) => access(p).then(() => true, () => false)
await mkdir(OUT, { recursive: true })
const previous = (await exists(join(OUT, 'videos.json')))
  ? Object.fromEntries(JSON.parse(await readFile(join(OUT, 'videos.json'), 'utf8')).videos.map((v) => [v.id, v]))
  : {}

// Duration and frame size from ffmpeg's report on the file
async function probe(file) {
  const { stderr } = await run(ffmpeg, ['-hide_banner', '-i', file]).catch((e) => e)
  const [, h, m, s] = stderr.match(/Duration: (\d+):(\d+):([\d.]+)/)
  const [, w, ht] = stderr.match(/Video: .*?, (\d{3,5})x(\d{3,5})/)
  return { duration: +h * 3600 + +m * 60 + +s, w: +w, h: +ht }
}

const videos = []
for (const v of VIDEOS) {
  const src = join(SRC, v.file)
  const mp4 = join(OUT, `${v.id}.mp4`)
  const { file: _file, poster: _poster, rotate, ...info } = v

  if (!previous[v.id] || !(await exists(mp4))) {
    const long = SIZE[v.kind]
    // transpose=1 turns the picture 90° clockwise; then fit the longest side
    const filters = [rotate && 'transpose=1', `scale='if(gt(iw,ih),min(${long},iw),-2)':'if(gt(iw,ih),-2,min(${long},ih))'`,
      v.kind === 'clip' && 'fps=30'].filter(Boolean).join(',')
    process.stdout.write(`${v.id.padEnd(28)} converting… `)
    const encode = ['-vf', filters, ...H264(v.kind), ...AAC]
    await run(ffmpeg, ['-v', 'error', '-y', '-i', src, '-map', '0:v:0', '-map', '0:a:0?',
      ...encode, '-movflags', '+faststart', '-map_metadata', '-1', mp4], { maxBuffer: 1 << 26 })

    // Poster frame from the converted file, so it is already upright
    const { stdout } = await run(ffmpeg, ['-v', 'error', '-ss', String(v.poster), '-i', mp4, '-frames:v', '1',
      '-f', 'image2pipe', '-vcodec', 'png', '-'], { encoding: 'buffer', maxBuffer: 1 << 28 })
    const posterImg = sharp(stdout).resize({ width: 1280, height: 1280, fit: 'inside' })
    await posterImg.clone().webp({ quality: 80 }).toFile(join(OUT, `${v.id}.webp`))
    const { data } = await posterImg.clone().resize(1, 1).removeAlpha().raw().toBuffer({ resolveWithObject: true })

    const meta = await probe(mp4)
    const [before, after] = [(await stat(src)).size, (await stat(mp4)).size]
    console.log(`${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(1)} MB, ${meta.w}x${meta.h}`)
    videos.push({ ...info, w: meta.w, h: meta.h, duration: Math.round(meta.duration),
      color: '#' + [...data].map((c) => c.toString(16).padStart(2, '0')).join(''), size: after })
  } else {
    console.log(`${v.id.padEnd(28)} up to date`)
    videos.push({ ...previous[v.id], ...info })
  }
}

await writeFile(join(OUT, 'videos.json'), JSON.stringify({ version: 1, videos }))
console.log(`\n${videos.length} videos -> ${OUT}/`)
