import { ThemeToggle } from './ThemeToggle'

export function SiteHeader({
  onToggleSidebar,
  title,
}: {
  onToggleSidebar: () => void
  title: string
}) {
  return (
    <header className="topbar">
      <div className="flex h-14 items-center gap-3 px-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          className="btn-icon md:hidden"
          title="Toggle navigation"
        >
          <span className="text-lg leading-none">☰</span>
        </button>

        <div className="min-w-0">
          <div className="hidden text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-faint sm:block">
            WuWa Tools
          </div>
          <h1 className="truncate text-[0.98rem] font-bold tracking-tight text-text sm:text-base">
            {title}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
