export function SiteHeader({
  onToggleSidebar,
  title,
}: {
  onToggleSidebar: () => void
  title: string
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-bg/85 backdrop-blur">
      <div className="flex h-12 items-center gap-2.5 px-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          className="btn-icon text-muted hover:bg-surface-2 hover:text-text"
          title="Toggle navigation"
        >
          ☰
        </button>
        <h1 className="truncate text-base font-bold tracking-tight text-text">{title}</h1>
      </div>
    </header>
  )
}
