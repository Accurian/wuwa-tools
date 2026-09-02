# wuwa-tools

Community calculators for **Wuthering Waves** Echo planning, deployed as a [GitHub Pages](https://pages.github.com/) static site. Everything runs entirely in the browser — no data collected, no tracking.

## Tools

| Tool | Page |
| --- | --- |
| Echo Substat Comparison | [comparison.html](comparison.html) |
| Echo Substats Calculator | [probability.html](probability.html) |
| Echo Budget & Balance | [xp-tuners.html](xp-tuners.html) |

The [landing page](index.html) links all three tools and shares a unified design system and site chrome.

## Architecture

The site is a **Vite multi-page app** built with **React 19 + TypeScript** and styled with **Tailwind CSS v4**. Instead of self-contained HTML files, each tool is a real HTML entry that mounts a React page, sharing:

- A unified dark theme via Tailwind design tokens ([`src/index.css`](src/index.css))
- Shared site chrome — header/nav and footer ([`src/components/`](src/components))
- Reusable data + math modules ([`src/lib/`](src/lib))

### Source layout

```
index.html, comparison.html, probability.html, xp-tuners.html   ← Vite entries
src/
  components/   Layout, SiteHeader, SiteFooter
  entries/      per-page React mount points
  lib/          substats, probability, balance (data + math)
  pages/        Landing, Comparison, Probability, XpTuners
```

## Local development

Requires Node.js 20+ (and a package manager that respects the lockfile).

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check + build to dist/
npm run preview    # preview the production build
npm run typecheck  # type-check only
```

The build output is written to `dist/`; the production asset base is `/wuwa-tools/` to match the project Pages URL.

## Publishing

The site is built and deployed automatically by GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). Push to `main` and the workflow type-checks, builds `dist/`, and publishes it to GitHub Pages.

Before that works, set the repository's **Pages** source to **GitHub Actions** (Settings → Pages → Build and deployment → Source → GitHub Actions).

## Live site

<https://Accurian.github.io/wuwa-tools/>
