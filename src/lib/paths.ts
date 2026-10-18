import type { RouteKey } from './router'

export interface NavItem {
  key: RouteKey
  label: string
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home' },
  { key: 'comparison', label: 'Echo Value Calculator' },
  { key: 'probability', label: 'Echo Substat Probability' },
  { key: 'xp-tuners', label: 'Echo Resources' },
]

/** Canonical page title shown in the top bar for the current route. */
export const PAGE_TITLES: Record<RouteKey, string> = {
  home: 'Home',
  comparison: 'Echo Substat Comparison',
  probability: 'Echo Substat Probability',
  'xp-tuners': 'Echo Resources',
}

/** Full document titles (kept in sync with the old per-page <title> tags). */
export const DOC_TITLES: Record<RouteKey, string> = {
  home: 'Accu\u2019s WuWa Tools',
  comparison: 'Echo Substat Comparison \u2014 Accu\u2019s WuWa Tools',
  probability: 'Echo Substat Probability \u2014 Accu\u2019s WuWa Tools',
  'xp-tuners': 'Echo Resources \u2014 Accu\u2019s WuWa Tools',
}

export function getPageTitle(key: RouteKey): string {
  return PAGE_TITLES[key] || 'Echo Tools'
}
