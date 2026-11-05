import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// public/ (assets, gallery, videos) is copied into dist/ as is. The hashed JS/CSS bundles go to dist/static/,
// apart from the images in dist/assets/, so they can be cached for a year (vercel.json).
export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: 'static',
  },
})
