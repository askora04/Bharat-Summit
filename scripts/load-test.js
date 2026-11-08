// Load test for the live site with Grafana k6 (https://k6.io). Not part of the site build.
//   k6 run scripts/load-test.js                          # bharatsummit.co, up to 200 visitors, ~8 min
//   k6 run -e PEAK=50 -e BASE_URL=https://staging... scripts/load-test.js
//   k6 run -e SMOKE=1 scripts/load-test.js               # ~40s with 4 visitors: checks the script works
//   k6 cloud run -e PEAK=5000 -e LITE=1 -e CAP_GB=40 scripts/load-test.js
//                                                        # Grafana Cloud k6: 5000 visitors from its servers
//                                                        # (see load-test-5000-users.txt for the steps)
// Options: PEAK (visitors at the peak), LITE=1 (pages, scripts, styles and data only: no images or videos, about
// a tenth of the bandwidth), CAP_GB (stop the test once it has downloaded this much; 15 by default).
//
// Two scenarios run together:
//   visitors  simulated people: open the home page (the page, its scripts and styles, the font, images and the
//             banner video), then one or two more pages (About, Schedule, Speakers, a speaker, Summit Archives
//             with gallery photos and video posters; a quarter of them start a video), pausing 3-8s between
//             pages as people do. Ramps 0 -> 25% -> 100% of PEAK, holds, ramps down.
//   probe     a steady 2 small requests a second (the page, the video and photo lists) to show how quickly the
//             server answers as the load rises (probe_ttfb), apart from download times.
// Videos are requested as a browser starts them: the first 1 MB (a Range request); the rest would stream while
// the visitor watches. The test stops itself once it has downloaded CAP_GB (Vercel bandwidth).
import http from 'k6/http'
import { check, sleep } from 'k6'
import { Trend } from 'k6/metrics'

const BASE = __ENV.BASE_URL || 'https://bharatsummit.co'
const SMOKE = !!__ENV.SMOKE // a ~30s run with a few visitors, to check the script: k6 run -e SMOKE=1 scripts/load-test.js
const PEAK = SMOKE ? 4 : Number(__ENV.PEAK || 200)
const T = (min) => (SMOKE ? `${min * 5}s` : `${min}m`) // stage lengths
const LITE = !!__ENV.LITE // no images or videos
const CAP_GB = Number(__ENV.CAP_GB || 15)

const probeTtfb = new Trend('probe_ttfb', true)
const pageTtfb = new Trend('page_ttfb', true)

export const options = {
  scenarios: {
    visitors: {
      executor: 'ramping-vus', exec: 'visit', startVUs: 0, gracefulRampDown: '30s',
      stages: [
        { duration: T(1), target: Math.ceil(PEAK * 0.25) },
        { duration: T(2), target: PEAK },
        { duration: T(3), target: PEAK },
        { duration: T(2), target: 0 },
      ],
    },
    probe: { executor: 'constant-arrival-rate', exec: 'probe', rate: 2, timeUnit: '1s', duration: T(8), preAllocatedVUs: 10, maxVUs: 50 },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // fewer than 1% of requests fail
    probe_ttfb: ['p(95)<800'], // the server answers 95% of small requests within 0.8s
    page_ttfb: ['p(95)<1000'],
    data_received: [{ threshold: `count<${CAP_GB * 1e9}`, abortOnFail: true }], // safety cap: CAP_GB
  },
  summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
  userAgent: 'k6 load test (Bharat Summit site owner)',
  // Grafana Cloud k6 (k6 cloud run): the test's name there, and where the load comes from: Mumbai, next to the
  // Vercel data centre that serves India. Ignored by a local k6 run.
  cloud: {
    name: `Bharat Summit, ${PEAK} visitors${LITE ? ' (lite)' : ''}`,
    distribution: { mumbai: { loadZone: 'amazon:in:mumbai', percent: 100 } },
  },
}

const pick = (list, n) => { const a = [...list]; const out = []; while (a.length && out.length < n) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]); return out }
const pause = () => sleep(3 + Math.random() * 5)
const ok = (res) => check(res, { 'status is 200/206': (r) => r.status === 200 || r.status === 206 })
const req = (path, kind, headers) => ['GET', BASE + path, null, { tags: { kind }, headers }]
const batch = (reqs) => http.batch(reqs).forEach(ok)

// What a visitor's browser downloads, read from the live site once at the start, so the test follows deploys
export function setup() {
  const html = http.get(BASE + '/').body
  const entry = /src="(\/static\/index-[^"]+\.js)"/.exec(html)[1]
  const entryJs = http.get(BASE + entry).body
  const chunks = [...new Set((entryJs.match(/static\/[A-Za-z0-9_.-]+\.(?:js|css)/g) || []).map((p) => '/' + p))]
  const app = chunks.find((p) => /\/App-.*\.js$/.test(p))
  const appJs = http.get(BASE + app).body
  const assets = [...new Set((appJs.match(/"[a-z0-9][a-z0-9/_-]*\.(?:webp|svg)"/gi) || []).map((s) => '/assets/' + s.slice(1, -1)))]
  // keep only the images that exist (some names in the code are pieces of longer paths)
  const images = assets.filter((p) => http.request('HEAD', BASE + p, null, { responseCallback: http.expectedStatuses(200, 404), tags: { kind: 'setup' } }).status === 200)
  const gallery = http.get(BASE + '/gallery/gallery.json').json()
  const videos = http.get(BASE + '/videos/videos.json').json().videos.map((v) => v.id)
  const code = [entry, app, ...chunks.filter((p) => /\/motion-.*\.js$/.test(p) || (/\.css$/.test(p) && !/iphone/.test(p))).slice(0, 2)]
  console.log(`setup: ${code.length} script/style files, ${images.length} images, ${gallery.photos.length} photos, ${videos.length} videos`)
  return { code, images, photos: gallery.photos.map((p) => p.id), videos }
}

function home(d) {
  const res = http.get(BASE + '/', { tags: { kind: 'page' } })
  ok(res); pageTtfb.add(res.timings.waiting)
  batch([...d.code.map((p) => req(p, 'static')), req('/assets/fonts/Jost.woff2', 'static'), req('/assets/logo.svg', 'image')])
  if (LITE) return
  batch(pick(d.images, 18).map((p) => req(p, 'image')))
  ok(http.get(BASE + '/videos/hero-banner.mp4?v=9', { tags: { kind: 'video' } })) // the banner plays on every visit
}

function page(d) {
  const r = Math.random()
  if (r < 0.2) { // Summit Archives: gallery thumbnails, a few larger photos, the video posters; some start a video
    batch([req('/gallery/gallery.json', 'data'), req('/videos/videos.json', 'data')])
    if (LITE) return
    batch([...pick(d.photos, 24).map((id) => req(`/gallery/${id}-480.webp`, 'image')), ...pick(d.photos, 4).map((id) => req(`/gallery/${id}-960.webp`, 'image'))])
    batch(d.videos.map((id) => req(`/videos/${id}.webp`, 'image')))
    if (Math.random() < 0.25) ok(http.get(`${BASE}/videos/${pick(d.videos, 1)[0]}.mp4`, { headers: { Range: 'bytes=0-1048575' }, tags: { kind: 'video' } }))
  } else { // About, Schedule, Speakers, a speaker: the page's images (the scripts are already loaded)
    if (!LITE) batch(pick(d.images, 14).map((p) => req(p, 'image')))
  }
}

export function visit(d) {
  home(d)
  pause()
  page(d)
  pause()
  if (Math.random() < 0.5) { page(d); pause() }
}

export function probe() {
  const p = pick(['/', '/videos/videos.json', '/gallery/gallery.json'], 1)[0]
  const res = http.get(BASE + p, { tags: { kind: 'probe' } })
  ok(res); probeTtfb.add(res.timings.waiting)
}
