# Wuthering Waves Tools

Tools for **Wuthering Waves**, deployed on [Vercel](https://vercel.com/). Everything runs entirely in the browser — no data collected, no tracking.

<https://wuwa-tools-self.vercel.app/>

## Tools

| Tool | Route |
| --- | --- |
| Echo Substat Comparison | `/comparison` |
| Echo Substat Probability | `/probability` |
| Echo Resources | `/xp-tuners` |

The [landing page](index.html) links all three tools and shares a unified design system and site chrome.

## Architecture

The site is a **single-page Vite app** built with **React 19 + TypeScript** and styled with **Tailwind CSS v4**. A tiny client-side router ([`src/lib/router.tsx`](src/lib/router.tsx)) handles navigation instantly — no full page reloads or flash between pages. Legacy `.html` URLs still resolve via the rewrite in `vercel.json`.

Everything shares:

- A themeable design system (light + dark) via Tailwind design tokens ([`src/index.css`](src/index.css))
- Shared site chrome — sidebar, header (with the light/dark toggle), and footer ([`src/components/`](src/components))
- Reusable data + math modules ([`src/lib/`](src/lib))

### Source layout

```
index.html                    ← single Vite entry
src/
  main.tsx                    ← router + app mount
  components/                 Layout, SiteHeader, Sidebar, ThemeToggle, icons
  lib/                        router, theme, substats, probability, balance (data + math)
  pages/                      Landing, Comparison, Probability, XpTuners
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
