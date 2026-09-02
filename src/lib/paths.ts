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

/** Canonical page title shown in the top bar for the current route. */
export const PAGE_TITLES: Record<string, string> = {
  home: 'Echo Tools',
  comparison: 'Echo Substat Comparison',
  probability: 'Echo Substat Calculator',
  'xp-tuners': 'Echo Resources',
}

export function getPageTitle(key: string): string {
  return PAGE_TITLES[key] || 'Echo Tools'
}
