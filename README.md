# DockerMaster

DockerMaster is a responsive Vue 3 learning website for Node.js developers who want to understand Docker, convert npm workflows into containers, use Docker Compose, and keep a searchable CLI reference nearby.

## Features

- Responsive guide layout with sidebar navigation and mobile drawer
- Chapter progress tracking with `localStorage`
- Light/dark theme toggle and compact reading mode
- Command palette for quick chapter navigation
- Interactive learning dashboard with saved tracks and checklist state
- Docker CLI reference with search, filters, favorites, sorting, dense view, copy actions, and recently copied commands
- Practical chapters covering Docker basics, benefits, Dockerfiles, Compose, `.env`, `.dockerignore`, and common CLI workflows

## Tech Stack

- Vue 3
- Vue Router 4
- Vite 5
- Plain CSS with scoped Vue component styles

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  App.vue                 # App shell, sidebar, theme, command palette
  main.js                 # Vue app and router setup
  views/
    Home.vue              # Landing page and learning dashboard
    WhatIsDocker.vue      # Docker concepts and lifecycle
    WhyDocker.vue         # Benefits, scenarios, workflows
    Converting.vue        # npm to Docker conversion guide
    Compose.vue           # Docker Compose guide
    Commands.vue          # Searchable Docker CLI reference
```

## Routes

- `#/` - Introduction
- `#/what-is-docker` - Docker fundamentals
- `#/why-docker` - Why use Docker
- `#/converting` - npm to Docker
- `#/compose` - Docker Compose
- `#/commands` - CLI command reference

The app uses hash history, so it works well as a static site without server rewrite configuration.

## Deployment

The Vite config uses:

```js
base: "./"
```

That makes the built `dist/` folder portable for static hosting. After running `npm run build`, deploy the contents of `dist/` to any static host such as GitHub Pages, Netlify, Vercel, Cloudflare Pages, or an Nginx static directory.

## Notes

Some UI preferences are stored in the browser with `localStorage`, including theme, compact mode, visited chapters, checklist state, command favorites, command sorting, and recent copies.

If you are running this project from WSL and Node reports a WSL 1 compatibility error, run the npm scripts from Windows Node or upgrade the environment to WSL 2.
