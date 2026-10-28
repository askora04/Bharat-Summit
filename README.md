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

Requires Node.js 18 or later.

```bash
npm install
npm run dev       # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint (clean with 0 errors/warnings) |
| `npm run images` | Convert the originals in `assets-original/` to WebP in `public/assets/` |
| `npm run gallery -- <folders>` | Build the photo gallery into `public/gallery/` (see below) |
| `npm run videos -- <folder>` | Build the event videos into `public/videos/` (see below) |

Routing uses the History API (`/about-us`, `/schedule`, `/speakers`, `/events`), so the host must serve `index.html` for unknown paths (SPA fallback). `vercel.json` already does this for Vercel.

## Deploying to Vercel

The repo is ready to import as is: in Vercel choose **Add New → Project**, pick this repository and press **Deploy**.
Everything else comes from `vercel.json`:

- **Build:** Vite, `npm run build`, output `dist/`.
- **Install:** `npm ci --ignore-scripts`. This skips the download of the ffmpeg binary that `npm run videos` uses locally;
  the website build doesn't need it (verified: clean install + build works with scripts skipped).
- **Routing:** every page path serves `index.html`, so reloading `/speakers/3` or `/events` works.
- **Caching:** the hashed JS/CSS bundles are cached for a year; images in `public/assets` for a day;
  gallery photos and videos for a week (their `gallery.json` / `videos.json` lists for 5 minutes).

**No environment variables are needed.** The photo gallery (`public/gallery/`, 148 MB) and the event videos
(`public/videos/`, 111 MB) are committed with the site and served from `/gallery` and `/videos`.
To move them to S3 or a CDN later, upload those folders and set `VITE_GALLERY_URL` / `VITE_VIDEOS_URL`
(see `.env.example` and the sections below), then redeploy.

## Project Structure

```
bharat-summit/
├── assets-original/          # Full-size image originals (npm run images makes the WebP versions)
├── public/
│   ├── gallery/              # Event photo gallery (npm run gallery)
│   ├── videos/               # Event videos (npm run videos)
│   └── assets/               # Static media and SVG icons (WebP)
│       ├── footer/           # Skyline monuments, boats, and icons
│       ├── home/             # Home page photos and graphics
│       └── organizers/       # Background-free organiser portraits
├── scripts/
│   ├── optimize-images.mjs   # assets-original/ -> public/assets/ WebP
│   ├── build-gallery.mjs     # photo albums -> public/gallery/
│   ├── gallery-captions.json # one-line captions for single photos
│   └── build-videos.mjs      # event videos -> public/videos/
├── src/
│   ├── main.jsx              # React DOM entry point
│   ├── App.jsx               # Header, nav, and SPA page router
│   ├── HomePage.jsx          # / landing page
│   ├── AboutPage.jsx         # /about-us page
│   ├── SchedulePage.jsx      # /schedule agenda & programme
│   ├── SpeakersPage.jsx      # /speakers directory and /speakers/:id detail
│   ├── EventsPage.jsx        # /events photo gallery and full-screen viewer
│   ├── EventVideos.jsx       # /events video section and clip player
│   ├── MediaCoverage.jsx     # About page media coverage (YouTube + press)
│   ├── OrganizedBy.jsx       # Telangana leadership section
│   ├── SummitNumbers.jsx     # "Summit in Numbers" interactive odometers
│   ├── Profile.jsx           # Accessible profile drawer modal
│   ├── Footer.jsx            # Footer links and contact info
│   ├── FooterScene.jsx       # Indian landmarks & river animation
│   ├── router.jsx            # PushState router (Link, usePath, navigate)
│   ├── shared.jsx            # Shared UI helpers (Title, Portrait, TriBar, a)
│   ├── organizersData.js     # Leadership profiles
│   ├── mediaCoverage.js      # Media coverage videos and articles
│   ├── gallery.js            # Loads the photo gallery from S3 (VITE_GALLERY_URL)
│   ├── videos.js             # Loads the event videos from S3 (VITE_VIDEOS_URL)
│   ├── scheduleData.js       # Programme schedule and themes
│   ├── speakersData.js       # Speaker roster
│   ├── footerBoats.js        # River boats SVG data
│   ├── footerHills.js        # Mountain background geometry
│   └── *.css                 # Modular stylesheets
├── .env.example              # VITE_GALLERY_URL and VITE_VIDEOS_URL for production
├── index.html
├── package.json
└── vite.config.js
```

## Content to Replace Before Launch

These are placeholders, marked in the code with `shortcut:` comments:

- **Speakers.** `src/speakersData.js` holds fictional demo speakers. Replace with confirmed participants.
- **Social links.** Set the real profile URLs in `src/Footer.jsx`.
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
`scripts/build-videos.mjs` builds it from the original files: it turns sideways phone clips upright, makes the
vertical clips 720p, copies the already web-ready films without re-encoding, and makes a poster for each.
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
