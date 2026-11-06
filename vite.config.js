import { writeFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { SPEAKERS } from './src/data/speakersData.js'

const SITE = 'https://bharatsummit.co'

// dist/sitemap.xml, made at build time so it always lists every speaker page (public/robots.txt points to it)
function sitemap() {
  return {
    name: 'sitemap',
    apply: 'build',
    closeBundle() {
      const paths = ['/', '/about-us', '/schedule', '/speakers', '/events', ...SPEAKERS.map((s) => `/speakers/${s.id}`)]
      const urls = paths.map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc></url>`).join('\n')
      writeFileSync('dist/sitemap.xml',
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
    },
  }
}

// https://vite.dev/config/
// public/ (assets, gallery, videos) is copied into dist/ as is. The hashed JS/CSS bundles go to dist/static/,
// apart from the images in dist/assets/, so they can be cached for a year (vercel.json).
export default defineConfig({
  plugins: [react(), sitemap()],
  build: {
    assetsDir: 'static',
  },
})
