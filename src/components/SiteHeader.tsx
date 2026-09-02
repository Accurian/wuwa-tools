import { NAV_ITEMS, href } from '../lib/paths'

export function SiteHeader({ active }: { active: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 px-5 py-3">
        <a href={href('')} className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold-dim text-sm font-black text-bg shadow-[0_0_16px_rgba(201,165,60,0.25)]">
            wuwa
          </span>
          <span className="text-sm font-semibold tracking-[0.14em] text-text">
            ECHO<span className="text-gold">TOOLS</span>
          </span>
        </a>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.label === active
            return (
              <a
                key={item.label}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-surface-2 text-gold'
                    : 'text-muted hover:bg-surface-2 hover:text-text'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
