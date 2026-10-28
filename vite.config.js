import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// The photo gallery (public/gallery) and event videos (public/videos) are plain static files:
// Vite serves them in dev and copies them into dist/ for production.
export default defineConfig({
  plugins: [react()],
})
