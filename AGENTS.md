# personal-portfolio-react

A single-page React portfolio built with Vite, Tailwind CSS, React Router, and Three.js / React Three Fiber (shader gradient background). There is no backend, database, or API — everything runs client-side.

## Cursor Cloud specific instructions

- Dependencies must be installed with `npm install --force`. The dependency tree has peer-dependency conflicts (notably `three` vs `@react-three/drei`/`three-mesh-bvh`), so a plain `npm install` can fail; `--force` matches how Netlify builds this site (`NPM_FLAGS = "--force"` in `netlify.toml`).
- Standard scripts live in `package.json`:
  - `npm start` — Vite dev server. Despite `vite.config.js` setting `strictPort: 3000` (which is not a valid port value, so it is ignored), the dev server actually serves on the default port **5173**. It also has `open: true`, which fails silently in a headless VM — this is harmless.
  - `npm run build` — production build into `build/` (not `dist/`; `outDir` is overridden).
  - `npm run lint` — ESLint (runs with `--max-warnings 0`).
  - `npm run serve` — preview a production build.
- On first load the app shows a full-screen `WelcomeScreen` splash for ~2.5s before the portfolio content (routed via React Router: `/home`, `/projects`, `/info`, `/contact`) appears. Wait for it to fade before interacting.
