import { useEffect, useMemo, useRef, useState } from 'react'
import {
  PROB_SUBSTATS,
  calcProbability,
  formatPct,
  format1inX,
  pctClass,
  substatById,
  valueLabel,
  SLOTS,
  type ProbSubstat,
  type ValueRange,
} from '../lib/probability'

const COLOR_MAP: Record<string, string> = {
  crit: '#ffd700',
  critdmg: '#ff6f00',
  atk: '#ff8a65',
  basic: '#f06292',
  heavy: '#ffb74d',
  skill: '#ce93d8',
  liberation: '#e57373',
  regen: '#81c784',
  hp: '#4fc3f7',
  def: '#a5d6a7',
  fixed: '#6b7280',
}

const RESULT_COLORS: Record<string, string> = {
  high: 'var(--color-success)',
  mid: 'var(--color-teal)',
  low: 'var(--color-gold)',
  rare: '#ff8a65',
  extreme: 'var(--color-danger)',
}

export function Probability() {
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [valueRanges, setValueRanges] = useState<Record<string, ValueRange>>({})

  const selectedCount = Object.keys(selected).length
  const isMaxed = selectedCount >= SLOTS
  const result = useMemo(() => calcProbability(selected, valueRanges), [selected, valueRanges])

  function toggleSelect(id: string) {
    if (selected[id]) {
      setSelected((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      return
    }
    if (selectedCount >= SLOTS) return
    const s = substatById(id)
    setValueRanges((r) => {
      if (s && s.values && !r[id]) return { ...r, [id]: { min: 0, max: s.values.length - 1 } }
      return r
    })
    setSelected((prev) => ({ ...prev, [id]: true }))
  }

  function setRange(id: string, range: ValueRange) {
    setValueRanges((prev) => ({ ...prev, [id]: range }))
  }

  return (
    <div className="page-wrap pt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          Pick up to {SLOTS} substats, then drag the bar to set the roll range you&rsquo;ll accept.
        </p>
        <span className="chip bg-surface-3 text-text">
          {selectedCount}/{SLOTS}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {PROB_SUBSTATS.map((s) => (
          <SubstatCard
            key={s.id}
            substat={s}
            selected={!!selected[s.id]}
            maxed={!selected[s.id] && isMaxed}
            range={valueRanges[s.id] || { min: 0, max: s.values.length - 1 }}
            onToggle={() => toggleSelect(s.id)}
            onRangeChange={(range) => setRange(s.id, range)}
          />
        ))}
      </div>

      <div className="mt-4">
        <ResultsPanel result={result} />
      </div>
    </div>
  )
}

function SubstatCard({
  substat,
  selected,
  maxed,
  range,
  onToggle,
  onRangeChange,
}: {
  substat: ProbSubstat
  selected: boolean
  maxed: boolean
  range: ValueRange
  onToggle: () => void
  onRangeChange: (range: ValueRange) => void
}) {
  return (
    <div
      onClick={onToggle}
      className={`rounded-xl border p-4 transition-all ${
        maxed
          ? 'cursor-default border-border bg-surface opacity-50'
          : selected
            ? 'cursor-pointer border-white/70 bg-gradient-to-br from-white/10 to-transparent shadow-[0_0_18px_rgba(255,255,255,0.08)]'
            : 'cursor-pointer border-border bg-surface hover:border-white/40 hover:bg-surface-2'
      }`}
    >
      <div className="mb-3 flex items-center justify-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLOR_MAP[substat.color] }} />
        <span className={`text-base font-medium ${selected ? 'text-text' : 'text-muted'}`}>
          {substat.name}
        </span>
      </div>

      <RangeSlider
        values={substat.values}
        range={range}
        onChange={onRangeChange}
        format={(v) => valueLabel(substat, v)}
        disabled={maxed}
      />
    </div>
  )
}

function RangeSlider({
  values,
  range,
  onChange,
  format,
  disabled,
}: {
  values: number[]
  range: ValueRange
  onChange: (range: ValueRange) => void
  format: (v: number) => string
  disabled?: boolean
}) {
  const N = values.length
  const [minIdx, setMinIdx] = useState(range.min)
  const [maxIdx, setMaxIdx] = useState(range.max)
  const minRef = useRef(range.min)
  const maxRef = useRef(range.max)
  const trackRef = useRef<HTMLDivElement>(null)

  function apply(mn: number, mx: number) {
    minRef.current = mn
    maxRef.current = mx
    setMinIdx(mn)
    setMaxIdx(mx)
    onChange({ min: mn, max: mx })
  }

  const pct = (i: number) => `${(i / (N - 1)) * 100}%`

  const thumbHandlers = (isLeft: boolean) => ({
    onPointerDown: (e: React.PointerEvent) => {
      if (disabled) return
      e.preventDefault()
      const move = (ev: PointerEvent) => {
        const track = trackRef.current
        if (!track) return
        const rect = track.getBoundingClientRect()
        let p = (ev.clientX - rect.left) / rect.width
        p = Math.max(0, Math.min(1, p))
        let idx = Math.round(p * (N - 1))
        let mn = minRef.current
        let mx = maxRef.current
        if (isLeft) {
          idx = Math.max(0, Math.min(mx - 1, idx))
          mn = idx
        } else {
          idx = Math.min(N - 1, Math.max(mn + 1, idx))
          mx = idx
        }
        apply(mn, mx)
      }
      const up = () => {
        document.removeEventListener('pointermove', move)
        document.removeEventListener('pointerup', up)
      }
      document.addEventListener('pointermove', move)
      document.addEventListener('pointerup', up)
    },
  })

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={disabled ? 'pointer-events-none opacity-50' : ''}
    >
      <div className="relative h-4 select-none">
        <div
          ref={trackRef}
          className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-bg"
        />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-info"
          style={{
            left: pct(minIdx),
            width: `calc(${pct(maxIdx)} - ${pct(minIdx)})`,
          }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-info shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-transform active:scale-110"
          style={{ left: pct(minIdx) }}
          {...thumbHandlers(true)}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-info shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-transform active:scale-110"
          style={{ left: pct(maxIdx) }}
          {...thumbHandlers(false)}
        />
      </div>

      <div className="pointer-events-none mt-1.5 flex justify-between">
        {values.map((v, i) => (
          <span
            key={i}
            className={`text-[0.62rem] tabular-nums leading-none transition-colors ${
              i >= minIdx && i <= maxIdx ? 'font-semibold text-text' : 'text-faint/70'
            }`}
          >
            {format(v)}
          </span>
        ))}
      </div>
    </div>
  )
}

function ResultsPanel({ result }: { result: ReturnType<typeof calcProbability> }) {
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-muted">Results</h2>
        <p className="py-8 text-sm text-muted">Click a substat to see probability</p>
      </div>
    )
  }

  const p = Math.max(0, result.prob)
  const pct = formatPct(p)
  const oneIn = format1inX(p)
  const cls = pctClass(p)

  const wantNames = result.wantIds.map((id) => substatById(id)?.name ?? id)

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="mb-3 text-center text-xs uppercase tracking-widest text-muted">Results</h2>
      <div className="fade-in text-center">
        <div className="text-4xl font-extrabold tabular-nums" style={{ color: RESULT_COLORS[cls] }}>
          {pct}
        </div>
        <div className="mt-0.5 text-sm font-semibold text-muted">{oneIn}</div>

        <div className="relative mx-auto my-2.5 h-[150px] w-[150px]">
          <DonutChart fraction={p} />
        </div>

        <p className="mt-0.5 text-xs leading-relaxed text-muted">{wantNames.join(' + ')}</p>

        {result.impossible && (
          <p className="mt-1.5 text-xs font-semibold" style={{ color: 'var(--color-danger)' }}>
            Too many substats selected for {SLOTS} slots
          </p>
        )}

        {!result.impossible && (
          <div className="mx-auto mt-2.5 max-w-lg border-t border-border pt-2">
            <h3 className="mb-1 text-[0.65rem] uppercase tracking-wider text-muted">Breakdown</h3>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border-b border-border px-1 py-0.5 text-left font-semibold uppercase tracking-wide text-muted">Substat</th>
                  <th className="border-b border-border px-1 py-0.5 text-left font-semibold uppercase tracking-wide text-muted">Roll</th>
                  <th className="border-b border-border px-1 py-0.5 text-left font-semibold uppercase tracking-wide text-muted">Value</th>
                  <th className="border-b border-border px-1 py-0.5 text-left font-semibold uppercase tracking-wide text-muted">Total</th>
                </tr>
              </thead>
              <tbody>
                {result.wantIds.map((id) => {
                  const d = result.indiv[id]
                  const name = substatById(id)?.name ?? id
                  return (
                    <tr key={id} className="border-b border-border/40">
                      <td className="px-1 py-0.5">{name}</td>
                      <td className="px-1 py-0.5 tabular-nums">{formatPct(d.indivProb)}</td>
                      <td className="px-1 py-0.5 tabular-nums">{formatPct(d.valueProb)}</td>
                      <td className="px-1 py-0.5 tabular-nums">{formatPct(d.indivProb * d.valueProb)}</td>
                    </tr>
                  )
                })}
                <tr className="border-t-2 border-border font-bold text-text">
                  <td className="px-1 py-1">Combined</td>
                  <td className="px-1 py-1 tabular-nums">{formatPct(result.basicProb)}</td>
                  <td className="px-1 py-1 tabular-nums">{formatPct(result.valueFactor)}</td>
                  <td className="px-1 py-1 tabular-nums">{pct}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function DonutChart({ fraction }: { fraction: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentRef = useRef(0)
  const targetRef = useRef(fraction)
  const rafRef = useRef(0)

  useEffect(() => {
    targetRef.current = fraction

    function draw(pct: number) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return
      const size = canvas.parentElement?.getBoundingClientRect().width || 150
      const dpr = window.devicePixelRatio || 1
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.scale(dpr, dpr)
      const cx = size / 2
      const cy = size / 2
      const outer = size * 0.42
      const inner = size * 0.26
      ctx.clearRect(0, 0, size, size)
      const f = Math.min(1, Math.max(0, pct))
      const angle = f * Math.PI * 2
      const start = -Math.PI / 2

      ctx.beginPath()
      ctx.arc(cx, cy, outer, 0, Math.PI * 2)
      ctx.arc(cx, cy, inner, Math.PI * 2, 0, true)
      ctx.closePath()
      ctx.fillStyle = '#2c2c2e'
      ctx.fill()

      if (f > 0.001) {
        ctx.beginPath()
        ctx.arc(cx, cy, outer, start, start + angle)
        ctx.arc(cx, cy, inner, start + angle, start, true)
        ctx.closePath()
        const grad = ctx.createLinearGradient(0, 0, size, size)
        grad.addColorStop(0, '#00d4ff')
        grad.addColorStop(0.5, '#00b8e8')
        grad.addColorStop(1, '#00ff88')
        ctx.fillStyle = grad
        ctx.fill()
      }

      ctx.fillStyle = '#f1f2f4'
      ctx.font = `bold ${size * 0.14}px -apple-system, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(formatPct(f), cx, cy - size * 0.035)
      ctx.fillStyle = '#c6c9cf'
      ctx.font = `${size * 0.07}px -apple-system, sans-serif`
      ctx.fillText(format1inX(f), cx, cy + size * 0.1)
    }

    function animate() {
      const diff = targetRef.current - currentRef.current
      if (Math.abs(diff) < 0.0005) {
        currentRef.current = targetRef.current
        draw(currentRef.current)
        rafRef.current = 0
        return
      }
      currentRef.current += diff * 0.15
      draw(currentRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }

    if (currentRef.current === 0 && targetRef.current > 0) {
      currentRef.current = 0.001
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (targetRef.current === 0) {
      currentRef.current = 0
      draw(0)
    } else {
      animate()
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [fraction])

  return <canvas ref={canvasRef} className="h-full w-full" />
}
