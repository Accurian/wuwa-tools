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
  const [popover, setPopover] = useState<{ id: string; rect: DOMRect } | null>(null)

  const selectedCount = Object.keys(selected).length
  const isMaxed = selectedCount >= SLOTS

  const result = useMemo(() => calcProbability(selected, valueRanges), [selected, valueRanges])

  function toggleSelect(id: string) {
    setSelected((prev) => {
      if (prev[id]) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      if (Object.keys(prev).length >= SLOTS) return prev
      const s = substatById(id)
      setValueRanges((r) => {
        if (s && s.values && !r[id]) return { ...r, [id]: { min: 0, max: s.values.length - 1 } }
        return r
      })
      return { ...prev, [id]: true }
    })
    setPopover(null)
  }

  function openSlider(id: string, rect: DOMRect) {
    const s = substatById(id)
    if (!s || !s.values) return
    setPopover((prev) => {
      if (prev && prev.id === id) return null
      return { id, rect }
    })
  }

  // close the popover on click outside / Escape
  useEffect(() => {
    if (!popover) return
    function onClick(e: MouseEvent) {
      if ((e.target as HTMLElement).closest('.substat-gear')) return
      const el = document.querySelector('.value-popover')
      if (el && el.contains(e.target as Node)) return
      setPopover(null)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPopover(null)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [popover])

  const popSubstat = popover ? substatById(popover.id) : null

  return (
    <div className="page-wrap pt-8">
      <div className="grid items-start gap-4 lg:grid-cols-[1fr_300px]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PROB_SUBSTATS.map((s) => (
            <SubstatCard
              key={s.id}
              substat={s}
              selected={!!selected[s.id]}
              maxed={!selected[s.id] && isMaxed}
              onToggle={() => toggleSelect(s.id)}
              onGear={(rect) => {
                if (!selected[s.id]) {
                  if (selectedCount >= SLOTS) return
                  toggleSelect(s.id)
                }
                openSlider(s.id, rect)
              }}
            />
          ))}
        </div>

        <ResultsPanel result={result} />

        {popover && popSubstat && (
          <ValuePopover
            key={popSubstat.id}
            substat={popSubstat}
            range={valueRanges[popSubstat.id] || { min: 0, max: popSubstat.values.length - 1 }}
            anchorRect={popover.rect}
            onChange={(range) => setValueRanges((prev) => ({ ...prev, [popSubstat.id]: range }))}
          />
        )}
      </div>
    </div>
  )
}

function SubstatCard({
  substat,
  selected,
  maxed,
  onToggle,
  onGear,
}: {
  substat: ProbSubstat
  selected: boolean
  maxed: boolean
  onToggle: () => void
  onGear: (rect: DOMRect) => void
}) {
  return (
    <div
      onClick={onToggle}
      className={`relative cursor-pointer select-none rounded-lg border p-3 transition-all ${
        maxed
          ? 'cursor-default border-border bg-surface opacity-40'
          : selected
            ? 'border-teal bg-gradient-to-br from-teal/10 to-transparent shadow-[0_0_12px_rgba(0,212,255,0.12)]'
            : 'border-border bg-surface hover:border-info hover:bg-surface-2'
      }`}
    >
      <div className="flex items-center justify-center gap-1.5">
        <span className="h-[7px] w-[7px] rounded-full" style={{ background: COLOR_MAP[substat.color] }} />
        <span className={`text-sm font-medium ${selected ? 'text-text' : 'text-muted'}`}>{substat.name}</span>
      </div>

      <button
        className="substat-gear absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded p-0 text-xs leading-none text-muted opacity-40 transition-all hover:bg-surface-3 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          onGear(e.currentTarget.getBoundingClientRect())
        }}
        title="Select which roll values to accept"
      >
        ⚙
      </button>
    </div>
  )
}

function ResultsPanel({ result }: { result: ReturnType<typeof calcProbability> }) {
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-center lg:sticky lg:top-20">
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
    <div className="rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-20">
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
          <div className="mt-2.5 border-t border-border pt-2">
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
                <tr className="border-t-2 border-border font-bold text-teal">
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
      ctx.fillStyle = '#1a2238'
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

      ctx.fillStyle = '#e7edf5'
      ctx.font = `bold ${size * 0.14}px -apple-system, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(formatPct(f), cx, cy - size * 0.035)
      ctx.fillStyle = '#8892b0'
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
      currentRef.current = targetRef.current > 0 ? Math.max(0.001, 0) : 0
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

function ValuePopover({
  substat,
  range,
  anchorRect,
  onChange,
}: {
  substat: ProbSubstat
  range: ValueRange
  anchorRect: DOMRect
  onChange: (range: ValueRange) => void
}) {
  const N = substat.values.length
  const [minIdx, setMinIdx] = useState(range.min)
  const [maxIdx, setMaxIdx] = useState(range.max)
  // Refs mirror the live indices so pointer-move handlers never read stale state.
  const minRef = useRef(range.min)
  const maxRef = useRef(range.max)

  const containerRef = useRef<HTMLDivElement>(null)

  const [pos, setPos] = useState<{ top: number; left: number; arrowLeft: number; arrowBottom?: boolean } | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const popW = el.offsetWidth
    const popH = el.offsetHeight
    let top = anchorRect.bottom + 8
    let left = anchorRect.left + anchorRect.width / 2 - popW / 2
    if (left < 8) left = 8
    if (left + popW > window.innerWidth - 8) left = window.innerWidth - popW - 8
    let arrowLeft = anchorRect.left + anchorRect.width / 2 - left
    arrowLeft = Math.max(10, Math.min(popW - 10, arrowLeft))
    let arrowBottom = false
    if (top + popH > window.innerHeight - 8) {
      top = anchorRect.top - popH - 8
      arrowBottom = true
    }
    setPos({ top, left, arrowLeft, arrowBottom })
  }, [anchorRect, N])

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
      e.preventDefault()
      const move = (ev: PointerEvent) => {
        const track = containerRef.current?.querySelector('.vs-track')
        if (!track) return
        const rect = (track as HTMLElement).getBoundingClientRect()
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
      ref={containerRef}
      className="value-popover fixed z-50 w-[330px] max-w-[calc(100vw-24px)] rounded-xl border border-border bg-surface p-5 pb-3.5 shadow-2xl"
      style={pos ? { top: pos.top, left: pos.left } : { visibility: 'hidden' }}
    >
      {pos && (
        <div
          className="absolute h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-border bg-surface"
          style={{
            top: pos.arrowBottom ? 'auto' : -7,
            bottom: pos.arrowBottom ? -7 : 'auto',
            left: pos.arrowLeft,
            transform: pos.arrowBottom ? 'rotate(225deg)' : 'rotate(45deg)',
            ...(pos.arrowBottom
              ? { borderBottom: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }
              : { borderTop: '1px solid var(--color-border)', borderLeft: '1px solid var(--color-border)' }),
          }}
        />
      )}

      <div className="mb-1 text-center text-xs font-semibold text-teal">
        {valueLabel(substat, substat.values[minIdx])} – {valueLabel(substat, substat.values[maxIdx])}
      </div>

      <div className="vs-track-wrap relative h-7">
        <div className="vs-track absolute left-1 right-1 top-1/2 h-1 -translate-y-1/2 rounded bg-bg" />
        <div
          className="vs-fill absolute top-0 h-full rounded"
          style={{
            left: pct(minIdx),
            width: `calc(${pct(maxIdx)} - ${pct(minIdx)})`,
            background: 'linear-gradient(90deg, #0088cc, #00d4ff)',
          }}
        />
        <div
          className="vs-thumb absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-teal shadow-[0_0_6px_rgba(0,212,255,0.4)]"
          style={{ left: pct(minIdx) }}
          {...thumbHandlers(true)}
        />
        <div
          className="vs-thumb absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-teal shadow-[0_0_6px_rgba(0,212,255,0.4)]"
          style={{ left: pct(maxIdx) }}
          {...thumbHandlers(false)}
        />
      </div>

      <div className="pointer-events-none flex justify-between px-1 pt-0.5 text-[0.62rem] text-muted">
        {substat.values.map((v, i) => (
          <span key={i} className={i >= minIdx && i <= maxIdx ? 'font-semibold text-teal' : ''}>
            {valueLabel(substat, v)}
          </span>
        ))}
      </div>
    </div>
  )
}
