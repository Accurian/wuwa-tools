import type { ReactNode } from 'react'
import { NAV_ITEMS } from '../lib/paths'
import { Link, type RouteKey } from '../lib/router'
import { IconHome, IconValue, IconProbability, IconResources, IconEcho } from './icons'

const ICONS: Record<RouteKey, ReactNode> = {
  home: <IconHome />,
  comparison: <IconValue />,
  probability: <IconProbability />,
  'xp-tuners': <IconResources />,
}

export function Sidebar({
  open,
  active,
  onClose,
  onExpand,
}: {
  open: boolean
  active: RouteKey
  onClose: () => void
  onExpand: () => void
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-chrome transition-all duration-200 ${
          open ? 'w-64 translate-x-0' : 'w-14 -translate-x-full md:translate-x-0'
        }`}
      >
        {open ? (
          <>
            <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-4">
              <span className="text-gold">
                <IconEcho className="h-4 w-4" />
              </span>
              <Link
                to="home"
                onClick={onClose}
                className="min-w-0 truncate font-display text-[0.95rem] font-bold tracking-tight text-text transition-colors hover:text-gold"
                title="Home"
              >
                Accu&rsquo;s WuWa Tools
              </Link>
              <button
                onClick={onClose}
                aria-label="Collapse navigation"
                title="Collapse navigation"
                className="ml-auto shrink-0 text-muted transition-colors hover:text-text"
              >
                <span className="text-lg leading-none">«</span>
              </button>
            </div>

            <nav className="flex flex-col gap-1 overflow-y-auto p-3">
              {NAV_ITEMS.map((item) => {
                const isActive = item.key === active
                return (
                  <Link
                    key={item.key}
                    to={item.key}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className="nav-item"
                  >
                    <span className="shrink-0">{ICONS[item.key]}</span>
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto border-t border-border/60 px-4 py-3 text-[0.62rem] leading-relaxed text-faint">
              Fan-made. Not affiliated with KURO Games.
            </div>
          </>
        ) : (
          <>
            <button
              onClick={onExpand}
              aria-label="Expand navigation"
              title="Expand navigation"
              className="flex h-14 w-full shrink-0 items-center justify-center text-muted transition-colors hover:bg-surface-2 hover:text-text"
            >
              <span className="text-lg leading-none">»</span>
            </button>

            <nav className="flex flex-1 flex-col items-center gap-1.5 p-2">
              {NAV_ITEMS.map((item) => {
                const isActive = item.key === active
                return (
                  <Link
                    key={item.key}
                    to={item.key}
                    aria-current={isActive ? 'page' : undefined}
                    title={item.label}
                    className="nav-rail"
                  >
                    {ICONS[item.key]}
                  </Link>
                )
              })}
            </nav>
          </>
        )}
      </aside>
    </>
  )
}
