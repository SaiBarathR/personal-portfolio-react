# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# personal-portfolio-react

## GitHub data

The Projects and Activity pages read GitHub through a Netlify Function
(`netlify/functions/github.js`), so the token stays on the server. Private
repositories are counted but always shown as "Private repository", with no
name or link.

- Set `GIT_PERSONAL_KEY` in Netlify (Site configuration → Environment
  variables) and in a local `.env`. Do not prefix it with `VITE_` — that would
  bundle it into the browser code.
- Run locally with `npm run dev` (needs the Netlify CLI: `npm i -g netlify-cli`),
  which serves the site and the function on http://localhost:8888.
  Plain `npm start` runs the UI without GitHub data.
