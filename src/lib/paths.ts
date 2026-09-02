const BASE_URL: string = import.meta.env?.BASE_URL ?? '/'

/** Resolve a page (e.g. "comparison.html" or "") against the deployment base. */
export function href(page: string): string {
  return `${BASE_URL}${page}`
}

export interface NavItem {
  href: string
  label: string
}

export const NAV_ITEMS: NavItem[] = [
  { href: href(''), label: 'Home' },
  { href: href('comparison.html'), label: 'Compare' },
  { href: href('probability.html'), label: 'Probability' },
  { href: href('xp-tuners.html'), label: 'Balance' },
]
