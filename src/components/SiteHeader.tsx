import { href } from '../lib/paths'

export function SiteHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-bg/85 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-5">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          className="btn-icon text-muted hover:bg-surface-2 hover:text-text"
          title="Toggle navigation"
        >
          ☰
        </button>
        <a
          href={href('')}
          className="text-lg font-bold tracking-tight text-text transition-colors hover:text-gold"
        >
          Accu&rsquo;s Tools
        </a>
      </div>
    </header>
  )
}
