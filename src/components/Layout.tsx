import { useState } from 'react'
import type { ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { Sidebar } from './Sidebar'
import { getPageTitle } from '../lib/paths'
import type { RouteKey } from '../lib/router'

const SIDEBAR_KEY = 'wuwa:sidebar-open'

function initialOpen(): boolean {
  if (typeof window === 'undefined') return true
  // Persist the user's choice across page loads (MPA navigation reloads).
  try {
    const saved = localStorage.getItem(SIDEBAR_KEY)
    if (saved !== null) return saved === '1'
  } catch {
    /* ignore */
  }
  // Default: open on desktop, collapsed (drawer) on small screens.
  return window.innerWidth >= 768
}

export function Layout({
  active,
  children,
}: {
  active: RouteKey
  children: ReactNode
}) {
  const [open, setOpen] = useState(initialOpen)

  function setOpenPersist(next: boolean) {
    setOpen(next)
    try {
      localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="min-h-screen">
      <Sidebar
        open={open}
        active={active}
        onClose={() => setOpenPersist(false)}
        onExpand={() => setOpenPersist(true)}
      />

      <div
        className={`flex min-h-screen flex-col transition-[margin] duration-200 ${
          open ? 'md:ml-64' : 'md:ml-14'
        }`}
      >
        <SiteHeader onToggleSidebar={() => setOpenPersist(!open)} title={getPageTitle(active)} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  )
}
