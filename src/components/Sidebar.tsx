import { NAV_ITEMS } from '../lib/paths'

export function Sidebar({
  open,
  active,
  onClose,
}: {
  open: boolean
  active: string
  onClose: () => void
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transform border-r border-border bg-surface transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center border-b border-border px-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-muted">Menu</span>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active
            return (
              <a
                key={item.key}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-surface-3 text-gold'
                    : 'text-muted hover:bg-surface-2 hover:text-text'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
