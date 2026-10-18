import type { ReactNode } from 'react'
import { Link, type RouteKey } from '../lib/router'
import { IconValue, IconProbability, IconResources } from '../components/icons'

interface ToolCard {
  to: RouteKey
  name: string
  desc: string
  accent: 'gold' | 'teal' | 'accent'
  icon: ReactNode
}

const TOOLS: ToolCard[] = [
  {
    to: 'comparison',
    name: 'Echo Substat Comparison',
    desc: 'Compare multiple echoes for specific resonators and rank them by value.',
    accent: 'gold',
    icon: <IconValue className="h-6 w-6" />,
  },
  {
    to: 'probability',
    name: 'Echo Substat Probability',
    desc: 'Visualize the odds of rolling a specific set of substats within a set number of rolls.',
    accent: 'teal',
    icon: <IconProbability className="h-6 w-6" />,
  },
  {
    to: 'xp-tuners',
    name: 'Echo Resources',
    desc: 'Work out how much XP, Tuners, and Shell Credits you can spend.',
    accent: 'accent',
    icon: <IconResources className="h-6 w-6" />,
  },
]

const ACCENT_STYLES: Record<
  ToolCard['accent'],
  { text: string; icon: string; glow: string }
> = {
  gold: {
    text: 'text-gold',
    icon: 'bg-gold/10 text-gold ring-gold/20',
    glow: 'hover:border-gold/50 hover:shadow-[0_0_36px_rgba(216,178,94,0.14)]',
  },
  teal: {
    text: 'text-teal',
    icon: 'bg-teal/10 text-teal ring-teal/20',
    glow: 'hover:border-teal/50 hover:shadow-[0_0_36px_rgba(95,208,212,0.14)]',
  },
  accent: {
    text: 'text-accent',
    icon: 'bg-accent/10 text-accent ring-accent/20',
    glow: 'hover:border-accent/50 hover:shadow-[0_0_36px_rgba(142,203,232,0.14)]',
  },
}

export function Landing() {
  return (
    <div className="page-wrap pt-14 sm:pt-20">
      <section className="mx-auto max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--color-gold)]" />
          Wuthering Waves · Echo Tools
        </div>
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          Welcome!
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          A collection of tools to compare your echoes, calculating your odds, and managing your
          resources.
        </p>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => {
          const s = ACCENT_STYLES[tool.accent]
          return (
            <Link
              key={tool.to}
              to={tool.to}
              className={`card group flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1 ${s.glow}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${s.icon}`}
                >
                  {tool.icon}
                </span>
                <h2 className={`text-[0.95rem] font-semibold leading-tight ${s.text}`}>
                  {tool.name}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted">{tool.desc}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-faint transition-colors group-hover:text-text">
                Open tool
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          )
        })}
      </section>
    </div>
  )
}
