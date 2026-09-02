import { href } from '../lib/paths'

interface ToolCard {
  href: string
  name: string
  desc: string
  accent: 'gold' | 'teal' | 'accent'
}

const TOOLS: ToolCard[] = [
  {
    href: href('comparison.html'),
    name: 'Echo Substat Comparison',
    desc: 'Compare multiple echoes for specific resonators.',
    accent: 'gold',
  },
  {
    href: href('probability.html'),
    name: 'Echo Substat Calculator',
    desc: 'Visualize the probability of getting a specific set of substats.',
    accent: 'teal',
  },
  {
    href: href('xp-tuners.html'),
    name: 'Echo Resources',
    desc: 'Figure out how much XP and Tuners you can spend.',
    accent: 'accent',
  },
]

const ACCENT_STYLES: Record<ToolCard['accent'], { text: string; glow: string }> = {
  gold: {
    text: 'text-gold',
    glow: 'hover:border-gold/50 hover:shadow-[0_0_30px_rgba(201,165,60,0.12)]',
  },
  teal: {
    text: 'text-teal',
    glow: 'hover:border-teal/50 hover:shadow-[0_0_30px_rgba(79,195,196,0.12)]',
  },
  accent: {
    text: 'text-accent',
    glow: 'hover:border-accent/50 hover:shadow-[0_0_30px_rgba(158,203,255,0.12)]',
  },
}

export function Landing() {
  return (
    <div className="page-wrap pt-14 sm:pt-20">
      <section className="text-center">
        <h1 className="text-lg font-semibold leading-snug tracking-tight sm:text-xl lg:whitespace-nowrap">
          A collection of tools that I have created for{' '}
          <span className="font-bold text-gold">Wuthering Waves</span>.
        </h1>
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
            </a>
          )
        })}
      </section>
    </div>
  )
}
