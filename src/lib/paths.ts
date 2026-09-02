const BASE_URL: string = import.meta.env?.BASE_URL ?? '/'

/** Resolve a page (e.g. "comparison.html" or "") against the deployment base. */
export function href(page: string): string {
  return `${BASE_URL}${page}`
}

export interface NavItem {
  key: string
  href: string
  label: string
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', href: href(''), label: 'Home' },
  { key: 'comparison', href: href('comparison.html'), label: 'Echo Value Calculator' },
  { key: 'probability', href: href('probability.html'), label: 'Echo Substat Probability' },
  { key: 'xp-tuners', href: href('xp-tuners.html'), label: 'Echo Resources' },
]
