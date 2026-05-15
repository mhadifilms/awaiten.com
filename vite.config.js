import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Custom domain - no base path needed
  // Images are served from Cloudflare R2 via src/utils/assets.js. Keeping Vite's
  // public copy step enabled duplicates the local image archive into dist/.
  publicDir: false,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
