import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/riders-galaxy/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000, // Increase chunk size warning limit to 2000KB
  },
})
