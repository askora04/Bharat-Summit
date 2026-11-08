# Bharat Summit 2026

Website for **Bharat Summit 2026**, hosted by the Government of Telangana and curated by the Samruddha Bharat Foundation at the Hyderabad International Convention Centre (HICC).

Built with React 19 and Vite, plain CSS, and no UI framework.

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, Summit in Numbers, speaker marquee, Organised By, Curated by SBF, moments gallery, venue |
| `/about-us` | About Us | Story, panel themes, world leaders preview, media coverage (videos + press), social feeds, venue |
| `/schedule` | Schedule | Programme tabs (Day 0–2, Nov 12–14), plenary & panel sessions, themes, expo & exhibitions |
| `/speakers` | Speakers | Full 40-speaker roster grid with filters and interactive profiles |
| `/speakers/:id` | Speaker Detail | Individual speaker profile, biography, and social links |
| `/events` | Events & Moments | Event videos (films, interviews) and the 2025 photo gallery, both loaded from S3 |

Every page shares the unified header with scroll-progress tracking and the animated footer (moving skyline of Indian landmarks, river, boats).

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev       # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run dev:iphone` | The same, reachable from a phone on the same Wi-Fi (open the printed Network URL on the iPhone); iPhone frames at `/src/iphone/preview.html` |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint (clean with 0 errors/warnings) |
| `npm run images` | Convert the originals in `assets-original/` to WebP in `public/assets/` |
| `npm run gallery -- <folders>` | Build the photo gallery into `public/gallery/` (see below) |
| `npm run videos -- <folder>` | Build the event videos into `public/videos/` (see below) |
| `k6 run scripts/load-test.js` | Load-test the live site with [Grafana k6](https://k6.io) (up to 200 visitors, ~8 min; `-e PEAK=50` for fewer, `-e SMOKE=1` for a 40 s check). Uses real bandwidth: the 200-visitor run downloads ~10 GB |
| `k6 cloud run -e PEAK=5000 -e LITE=1 -e CAP_GB=40 scripts/load-test.js` | The 5000-visitor test on Grafana Cloud k6 (load from Mumbai, no images or videos). Steps and costs: [load-test-5000-users.txt](load-test-5000-users.txt) |

Routing uses the History API (`/about-us`, `/schedule`, `/speakers`, `/events`), so the host must serve `index.html` for unknown paths (SPA fallback). `vercel.json` already does this for Vercel.

## Deploying to Vercel

The repo is ready to import as is: in Vercel choose **Add New → Project**, pick this repository and press **Deploy**.
Everything else comes from `vercel.json`:

- **Build:** Vite, `npm run build`, output `dist/`.
- **Install:** `npm ci --ignore-scripts`. This skips the download of the ffmpeg binary that `npm run videos` uses locally;
  the website build doesn't need it (verified: clean install + build works with scripts skipped).
- **Routing:** every page path serves `index.html`, so reloading `/speakers/3` or `/events` works. Paths with a
  file extension never do, so a missing image or file is a real 404, not the homepage. Trailing slashes redirect
  to the path without one (`/speakers/` -> `/speakers`). Don't turn on `cleanUrls`: it stops the rewrite to
  `/index.html` from resolving, and every page but the home page then 404s on reload. An address that isn't a page
  shows the nearest one and the address bar is corrected to it (an unknown path -> `/`, an unknown speaker ->
  `/speakers`); each speaker page is titled with the speaker's name.
- **Search and sharing:** `index.html` has the description, canonical URL and Open Graph / Twitter card tags (for
  `https://bharatsummit.co`; change them if the domain changes). The share image is `public/assets/og-image.jpg`
  (1200 × 630, made from the banner's last frame) and the iPhone home-screen icon `public/apple-touch-icon.png`;
  both are JPG/PNG on purpose, as link previews and iOS don't take WebP or SVG. `dist/sitemap.xml` is written at
  build time (`vite.config.js`) with every page and speaker page; `public/robots.txt` points to it.
- **Caching:** pages always revalidate, so a deploy shows at once; the hashed JS/CSS bundles (`/static/`) are
  cached for a year; images in `/assets/` for an hour (served stale for a day while revalidating) and the font for
  30 days; gallery photos and videos for a week (their `gallery.json` / `videos.json` lists for 5 minutes).
  Replacing a banner video under the same name? Bump its `?v=` in the code so visitors don't get the cached one.
- **Security headers:** HSTS, no MIME sniffing, no framing by other sites, a strict referrer policy, camera /
  microphone / location / payment turned off, and a Content-Security-Policy limited to what can't break the
  Instagram, X and Facebook embeds (frame-ancestors, object-src, base-uri, form-action, HTTPS upgrades).

**No environment variables are needed.** The photo gallery (`public/gallery/`, 20 MB) and the event videos
(`public/videos/`, 73 MB) are committed with the site and served from `/gallery` and `/videos`.
To move them to S3 or a CDN later, upload those folders and set `VITE_GALLERY_URL` / `VITE_VIDEOS_URL`
(see `.env.example` and the sections below), then redeploy.

## Project Structure

```
bharat-summit/
├── public/                   # Copied into dist/ as is; every image is WebP or SVG
│   ├── assets/               # Site images, icons and the Jost font
│   │   ├── footer/           # Skyline monuments and social icons
│   │   ├── home/             # Home page photos and graphics
│   │   ├── organizers/       # Background-free organiser portraits
│   │   └── speakers/         # Speaker cut-outs (file name = speaker's name, slugged)
│   ├── gallery/              # Event photo gallery (npm run gallery)
│   └── videos/               # Event videos and posters (npm run videos)
├── scripts/                  # Media build tools, run locally (not part of the site build)
│   ├── optimize-images.mjs   # assets-original/ -> public/assets/ WebP
│   ├── build-gallery.mjs     # photo albums -> public/gallery/
│   ├── gallery-captions.json # one-line captions for single photos
│   └── build-videos.mjs      # event videos -> public/videos/
├── src/
│   ├── main.jsx              # Entry: loads the desktop layout, or the mobile one on phones (<= 700px) other than iPhones
│   ├── desktop/              # Desktop layout: App (header, routes), pages, sections, stylesheets
│   ├── mobile/               # Phone layout, a tuned copy of desktop/ (preview.html: dev-only phone frame)
│   ├── iphone/               # iPhone view: the desktop layout scaled to the screen (1200px viewport, index.html);
│   │                         #   iphone.css: Safari fixes; preview.html: iPhone SE, 12/13/14, 15/16, 16 Pro Max
│   ├── data/                 # Content: speakers, schedule, organisers, media coverage, footer hills
│   └── lib/                  # Shared logic: router, motion, gallery/videos loaders, asset URL helper, and
│                             #   Scroller (the hand-scrolled rows: archive clips, About's social posts)
├── .env.example              # Optional VITE_GALLERY_URL / VITE_VIDEOS_URL (S3 or CDN)
├── index.html
├── vercel.json               # Build, SPA routing, caching and security headers
└── vite.config.js
```

Full-size originals stay on your machine and are git-ignored: `assets-original/` (input for `npm run images`)
and `gallery-originals/` (input for `npm run gallery`).

## Content to Replace Before Launch

These are placeholders, marked in the code with `shortcut:` comments:

- **Speakers.** `src/data/speakersData.js` holds the speaker roster. Check it against confirmed participants.
- **Social links.** Set the real profile URLs in `src/desktop/Footer.jsx` and `src/mobile/Footer.jsx`.
- **Terms & Conditions and Privacy Policy.** Add destination content as required.

## Accessibility

- Animations respect the operating system's *reduce motion* setting.
- Interactive cards are accessible buttons with explicit ARIA labels.
- The profile drawer supports Escape and arrow keys, and restores focus when closed.

## Event gallery

The `/events` gallery and the home page's Moments section read `public/gallery/`, which ships with the site.
`scripts/build-gallery.mjs` builds it from the photographer's album folders:

```
public/gallery/
├── gallery.json                      # albums, photo sizes, captions, featured photos
└── <album>/<photo>-{480,960,1600}.webp
```

Album titles, dates, credits and one-line captions are set in `ALBUMS` at the top of the script. To give single
photos their own line, add them to `scripts/gallery-captions.json` (`{ "day-2/250425mw0154": "…" }`) and re-run.
Re-runs only convert new photos.

```bash
# one or more folders holding album folders; each album is found in whichever folder has it
npm run gallery -- /path/to/mauriceweiss_250400PA_Hydarabad /path/to/folder-containing-pictures
```

## Event videos

The video section at the top of `/events` reads `public/videos/`, kept apart from the photos.
`scripts/build-videos.mjs` builds it from the original files: it turns sideways phone clips upright, encodes
everything as 720p H.264 (films at CRF 23, interview clips at CRF 27, 96 kbps audio) and makes a poster for each.
Titles, roles, order (the first film is featured) and poster frames are set in `VIDEOS` at the top of the script.

```bash
npm run videos -- /path/to/web     # the folder with the original .mp4 files; re-runs skip finished videos
```

## Moving the media to S3 (optional)

If the repo or deployments get too large, serve the media from S3 instead:

```bash
aws s3 sync public/gallery/ s3://YOUR_BUCKET/gallery/ --exclude gallery.json --cache-control "public, max-age=31536000, immutable"
aws s3 cp public/gallery/gallery.json s3://YOUR_BUCKET/gallery/gallery.json --cache-control "public, max-age=300"
aws s3 sync public/videos/ s3://YOUR_BUCKET/videos/ --exclude videos.json --cache-control "public, max-age=31536000, immutable"
aws s3 cp public/videos/videos.json s3://YOUR_BUCKET/videos/videos.json --cache-control "public, max-age=300"
```

Then set `VITE_GALLERY_URL` and `VITE_VIDEOS_URL` in Vercel, allow the site's domain in the bucket's CORS rule
(`GET`/`HEAD`), and make the objects publicly readable (or serve them through CloudFront).
