# Wuthering Waves Tools

Tools for **Wuthering Waves**, deployed on [Vercel](https://vercel.com/). Everything runs entirely in the browser — no data collected, no tracking.

<https://wuwa-tools-self.vercel.app/>

## Tools

| Tool | Page |
| --- | --- |
| Echo Substat Comparison | [comparison.html](comparison.html) |
| Echo Substat Calculator | [probability.html](probability.html) |
| Echo Resources | [xp-tuners.html](xp-tuners.html) |

The [landing page](index.html) links all three tools and shares a unified design system and site chrome.

## Architecture

The site is a **Vite multi-page app** built with **React 19 + TypeScript** and styled with **Tailwind CSS v4**. Instead of self-contained HTML files, each tool is a real HTML entry that mounts a React page, sharing:

- A unified dark theme via Tailwind design tokens ([`src/index.css`](src/index.css))
- Shared site chrome — sidebar, header, and footer ([`src/components/`](src/components))
- Reusable data + math modules ([`src/lib/`](src/lib))

Because it's served at the root (no sub-path), links resolve cleanly as `/comparison.html`, `/probability.html`, and `/xp-tuners.html`.

### Source layout

```
index.html, comparison.html, probability.html, xp-tuners.html   ← Vite entries
src/
  components/   Layout, SiteHeader, SiteSidebar
  entries/      per-page React mount points
  lib/          substats, probability, balance (data + math)
  pages/        Landing, Comparison, Probability, XpTuners
```

## Local development

Requires Node.js 20+ (and a package manager that respects the lockfile).

```bash
npm install
npm run dev        # start the dev server at http://localhost:5173/
npm run build      # type-check + build to dist/
npm run preview    # preview the production build
npm run typecheck  # type-check only
```

The build output is written to `dist/`, served from the root path.

## Deployment

The project is configured for [Vercel](https://vercel.com/). Connect the GitHub repo to Vercel and it will auto-detect the Vite project, run `npm run build`, and serve the `dist/` output at the root. `vercel.json` pins the build command and output directory.

- Every push to `main` produces a production deployment.
- Each PR/branch gets its own **preview deployment** URL.
- A custom domain can be attached at the root (no sub-path needed).

There is no GitHub Actions workflow — deployment is handled entirely by Vercel.
