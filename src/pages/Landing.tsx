import { href } from '../lib/paths'

interface ToolCard {
  href: string
  name: string
  desc: string
  chips: string[]
  accent: 'gold' | 'teal' | 'accent'
}

const TOOLS: ToolCard[] = [
  {
    href: href('comparison.html'),
    name: 'Echo Substat Comparison',
    desc: 'Build multiple echo substat profiles side by side, weight them for a specific resonator, and see which gear or planned roll wins.',
    chips: ['13 substats', 'Presets', 'Weighted score'],
    accent: 'gold',
  },
  {
    href: href('probability.html'),
    name: 'Echo Substats Calculator',
    desc: 'Estimate the probability of rolling exactly the substat values you want, with a live donut chart and per-stat breakdown.',
    chips: ['Roll odds', 'Range sliders', 'Live chart'],
    accent: 'teal',
  },
  {
    href: href('xp-tuners.html'),
    name: 'Echo Budget & Balance',
    desc: 'Keep your Echo XP, Premium Tuners, and Shell Credits in check when rolling — find the checkpoint where your stash is balanced.',
    chips: ['XP', 'Tuners', 'Shell Credits'],
    accent: 'accent',
  },
]

const ACCENT_STYLES: Record<ToolCard['accent'], { text: string; glow: string; chip: string }> = {
  gold: {
    text: 'text-gold',
    glow: 'hover:border-gold/50 hover:shadow-[0_0_30px_rgba(201,165,60,0.12)]',
    chip: 'bg-gold/10 text-gold border-gold/25',
  },
  teal: {
    text: 'text-teal',
    glow: 'hover:border-teal/50 hover:shadow-[0_0_30px_rgba(79,195,196,0.12)]',
    chip: 'bg-teal/10 text-teal border-teal/25',
  },
  accent: {
    text: 'text-accent',
    glow: 'hover:border-accent/50 hover:shadow-[0_0_30px_rgba(158,203,255,0.12)]',
    chip: 'bg-accent/10 text-accent border-accent/25',
  },
}

export function Landing() {
  return (
    <div className="page-wrap pt-16 sm:pt-20">
      <section className="mx-auto max-w-3xl text-center">
        <span className="chip border-gold/25 bg-gold/10 text-gold">Wuthering Waves</span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Echo{' '}
          <span className="bg-gradient-to-r from-gold via-gold-bright to-gold bg-clip-text text-transparent">
            Planning Tools
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted sm:text-lg">
          Community calculators for Wuthering Waves Echo planning — roll odds, substat
          comparison, and resource balance. All client-side, no data leaves your browser.
        </p>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => {
          const s = ACCENT_STYLES[tool.accent]
          return (
            <a
              key={tool.href}
              href={tool.href}
              className={`card group flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1 ${s.glow}`}
            >
              <span className={`text-lg font-semibold ${s.text}`}>{tool.name}</span>
              <p className="text-sm leading-relaxed text-muted">{tool.desc}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                {tool.chips.map((c) => (
                  <span key={c} className={`chip ${s.chip}`}>
                    {c}
                  </span>
                ))}
              </div>
              <span className="mt-1 text-sm font-medium text-faint transition-colors group-hover:text-text">
                Open tool →
              </span>
            </a>
          )
        })}
      </section>
    </div>
  )
}
