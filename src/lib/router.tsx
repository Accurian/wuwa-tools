import { useSyncExternalStore } from 'react'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

export type RouteKey = 'home' | 'comparison' | 'probability' | 'xp-tuners'

const BASE: string = import.meta.env?.BASE_URL ?? '/'

export interface RouteDef {
  key: RouteKey
  path: string
}

/** Canonical, extensionless routes. `.html` URLs from the old MPA still resolve. */
export const ROUTES: RouteDef[] = [
  { key: 'home', path: '/' },
  { key: 'comparison', path: '/comparison' },
  { key: 'probability', path: '/probability' },
  { key: 'xp-tuners', path: '/xp-tuners' },
]

const PATH_BY_KEY = Object.fromEntries(ROUTES.map((r) => [r.key, r.path])) as Record<
  RouteKey,
  string
>

/** Build a deployment-aware URL for a route key. */
export function pathFor(key: RouteKey): string {
  return BASE.replace(/\/+$/, '') + PATH_BY_KEY[key]
}

function normalize(pathname: string): string {
  let p = pathname
  const base = BASE.replace(/\/+$/, '')
  if (base && (p === base || p.startsWith(base + '/'))) p = p.slice(base.length)
  if (!p.startsWith('/')) p = '/' + p
  // Backwards-compat with the previous multi-page `.html` URLs.
  p = p.replace(/\/index\.html?$/i, '/').replace(/\.html?$/i, '')
  if (p.length > 1) p = p.replace(/\/+$/, '')
  return p || '/'
}

/** Resolve a pathname to a known route, falling back to the landing page. */
export function resolveRoute(pathname: string): RouteKey {
  const p = normalize(pathname)
  const found = ROUTES.find((r) => r.path === p)
  return found ? found.key : 'home'
}

const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  window.addEventListener('popstate', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('popstate', cb)
  }
}

function getPathname(): string {
  return window.location.pathname
}

/** Client-side navigation. Instant — no full page reload. */
export function navigate(to: string) {
  const target = to || '/'
  const current = getPathname() + window.location.search
  if (target === current) {
    window.scrollTo({ top: 0 })
    return
  }
  window.history.pushState(null, '', target)
  emit()
  window.scrollTo({ top: 0 })
}

/** Subscribe to the current route key. */
export function useRoute(): RouteKey {
  const pathname = useSyncExternalStore(subscribe, getPathname, () => '/')
  return resolveRoute(pathname)
}

type LinkProps = {
  to: RouteKey
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>

/** Anchor that performs client-side navigation while keeping normal link semantics. */
export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const href = pathFor(to)
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        navigate(href)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
