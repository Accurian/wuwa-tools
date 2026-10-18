import { IconMoon, IconSun } from './icons'
import { useTheme } from '../lib/theme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      data-theme={theme}
      onClick={toggle}
      className="theme-toggle"
    >
      <span className="theme-toggle__thumb" aria-hidden="true" />
      <span className="theme-toggle__opt" aria-hidden="true">
        <IconSun className="h-3.5 w-3.5" />
      </span>
      <span className="theme-toggle__opt" aria-hidden="true">
        <IconMoon className="h-3.5 w-3.5" />
      </span>
    </button>
  )
}
