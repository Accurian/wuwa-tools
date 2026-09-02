import type { ReactNode } from 'react'
import { href, NAV_ITEMS } from '../lib/paths'
import { IconHome, IconValue, IconProbability, IconResources } from './icons'

const ICONS: Record<string, ReactNode> = {
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
  active: string
  onClose: () => void
  onExpand: () => void
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-chrome transition-all duration-200 ${
          open
            ? 'w-64 translate-x-0'
            : 'w-14 -translate-x-full md:translate-x-0'
        }`}
      >
        {open ? (
          <>
            <div className="flex h-12 shrink-0 items-center border-b border-border px-4">
              <a
                href={href('')}
                className="truncate text-sm font-bold tracking-tight text-text transition-colors hover:text-gold"
                title="Home"
              >
                Accu&rsquo;s WuWa Tools
              </a>
            </div>

            <nav className="flex flex-col gap-1 overflow-y-auto p-3">
              {NAV_ITEMS.map((item) => {
                const isActive = item.key === active
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-surface-3 text-gold'
                        : 'text-muted hover:bg-surface-2 hover:text-text'
                    }`}
                  >
                    <span className="shrink-0">{ICONS[item.key]}</span>
                    {item.label}
                  </a>
                )
              })}
            </nav>
          </>
        ) : (
          <>
            <button
              onClick={onExpand}
              aria-label="Expand navigation"
              title="Expand navigation"
              className="flex h-12 w-full shrink-0 items-center justify-center text-muted transition-colors hover:bg-surface-2 hover:text-text"
            >
              <span className="text-lg leading-none">»</span>
            </button>

            <nav className="flex flex-1 flex-col items-center gap-1 p-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive = item.key === active
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    title={item.label}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? 'bg-surface-3 text-gold'
                        : 'text-muted hover:bg-surface-2 hover:text-text'
                    }`}
                  >
                    {ICONS[item.key]}
                  </a>
                )
              })}
            </nav>
          </>
        )}
      </aside>
    </>
  )
}
