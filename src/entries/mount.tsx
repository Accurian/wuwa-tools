import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import type { ReactNode } from 'react'
import { Layout } from '../components/Layout'
import '../index.css'

export function mount(active: string, node: ReactNode) {
  const el = document.getElementById('root')
  if (!el) throw new Error('#root element not found')
  createRoot(el).render(
    <StrictMode>
      <Layout active={active}>{node}</Layout>
    </StrictMode>,
  )
}
