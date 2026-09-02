import { useState } from 'react'
import type { ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { Sidebar } from './Sidebar'

export function Layout({
  active,
  children,
}: {
  active: string
  children: ReactNode
}) {
  // Open by default on desktop; closed (drawer) on small screens.
  const [open, setOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
  )

  return (
    <div className="min-h-screen">
      <Sidebar open={open} active={active} onClose={() => setOpen(false)} />

      <div
        className={`flex min-h-screen flex-col transition-[margin] duration-200 ${
          open ? 'md:ml-64' : ''
        }`}
      >
        <SiteHeader onToggleSidebar={() => setOpen((o) => !o)} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  )
}
