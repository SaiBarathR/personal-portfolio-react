/* eslint-env node */
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Runs netlify/functions/* inside the Vite dev server, so plain `npm start`
// has GitHub data too. `netlify dev` and production use the real functions.
const netlifyFunctionsDev = () => ({
  name: 'netlify-functions-dev',
  configureServer(server) {
    const { root, mode, envDir } = server.config
    // Unprefixed keys (the GitHub token) stay in this Node process; only
    // VITE_-prefixed ones are ever bundled for the browser.
    Object.assign(process.env, loadEnv(mode, envDir, ''))

    server.middlewares.use('/.netlify/functions', async (req, res, next) => {
      try {
        const url = new URL(req.originalUrl, `http://${req.headers.host}`)
        const name = url.pathname.split('/')[3] || ''
        const file = resolve(root, 'netlify/functions', `${name}.js`)
        if (!/^[\w-]+$/.test(name) || !existsSync(file)) return next()

        const { default: handler } = await server.ssrLoadModule(file)
        const response = await handler(
          new Request(url, { method: req.method, headers: req.headers })
        )
        res.statusCode = response.status
        response.headers.forEach((value, key) => res.setHeader(key, value))
        res.end(Buffer.from(await response.arrayBuffer()))
      } catch (error) {
        next(error)
      }
    })
  },
})

export default defineConfig({
  plugins: [react(), netlifyFunctionsDev()],
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
