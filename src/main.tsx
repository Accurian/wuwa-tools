import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import type { ComponentType } from 'react'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing'
import { Comparison } from './pages/Comparison'
import { Probability } from './pages/Probability'
import { XpTuners } from './pages/XpTuners'
import { DOC_TITLES } from './lib/paths'
import { useRoute, type RouteKey } from './lib/router'
import './index.css'

const PAGES: Record<RouteKey, ComponentType> = {
  home: Landing,
  comparison: Comparison,
  probability: Probability,
  'xp-tuners': XpTuners,
}

function App() {
  const route = useRoute()

  useEffect(() => {
    document.title = DOC_TITLES[route]
  }, [route])

  const Page = PAGES[route]

  return (
    <Layout active={route}>
      <div key={route} className="route-fade">
        <Page />
      </div>
    </Layout>
  )
}

const container = document.getElementById('root')
if (!container) throw new Error('#root element not found')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
