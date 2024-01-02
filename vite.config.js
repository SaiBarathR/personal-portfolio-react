import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
  define: {
    global: 'window'
  },
  base: './',
})
