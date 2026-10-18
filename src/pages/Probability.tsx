import { useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
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
import { IconCheck } from '../components/icons'

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

const ROLL_OPTIONS = Array.from({ length: SLOTS }, (_, i) => i + 1)

type AccentVars = CSSProperties & { '--accent'?: string }

function accentStyle(color: string): AccentVars {
  return { '--accent': color }
}

export function Probability() {
  const [rolls, setRolls] = useState(SLOTS)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [valueRanges, setValueRanges] = useState<Record<string, ValueRange>>({})

  const selectedCount = Object.keys(selected).length
  const isMaxed = selectedCount >= rolls
  const result = useMemo(
    () => calcProbability(selected, valueRanges, rolls),
    [selected, valueRanges, rolls],
  )

  function changeRolls(next: number) {
    setRolls(next)
    setSelected((prev) => {
      const ids = Object.keys(prev)
      if (ids.length <= next) return prev
      // Keep the substats chosen first when trimming to the new roll count.
      const trimmed: Record<string, boolean> = {}
      for (const id of ids.slice(0, next)) trimmed[id] = true
      return trimmed
    })
  }

  function toggleSelect(id: string) {
    if (selected[id]) {
      setSelected((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      return
    }
    if (selectedCount >= rolls) return
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
      <section className="card mb-4">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div>
            <span className="label mb-2 block">Substats revealed</span>
            <div className="seg" role="group" aria-label="Number of substats revealed">
              {ROLL_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className="seg__item"
                  data-active={rolls === n}
                  aria-pressed={rolls === n}
                  onClick={() => changeRolls(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto text-right">
            <div className="text-3xl font-bold leading-none tabular-nums text-text">
              {selectedCount}
              <span className="text-base font-semibold text-faint">/{rolls}</span>
            </div>
            <div className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-faint">
              desired
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">
          Pick up to <span className="font-semibold text-text">{rolls}</span> substats to see the
          odds they all appear within {rolls} roll{rolls > 1 ? 's' : ''}. Drag a bar to accept a
          specific roll range.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {PROB_SUBSTATS.map((s) => (
          <SubstatCard
            key={s.id}
            substat={s}
            color={COLOR_MAP[s.color] ?? '#8892a0'}
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
  color,
  selected,
  maxed,
  range,
  onToggle,
  onRangeChange,
}: {
  substat: ProbSubstat
  color: string
  selected: boolean
  maxed: boolean
  range: ValueRange
  onToggle: () => void
  onRangeChange: (range: ValueRange) => void
}) {
  return (
    <div
      role="checkbox"
      aria-checked={selected}
      aria-label={substat.name}
      tabIndex={maxed ? -1 : 0}
      onClick={maxed ? undefined : onToggle}
      onKeyDown={(e) => {
        if (maxed) return
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onToggle()
        }
      }}
      data-selected={selected}
      data-maxed={maxed}
      className="substat-card"
      style={accentStyle(color)}
    >
      <div className="mb-3.5 flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: color, boxShadow: selected ? `0 0 10px ${color}` : undefined }}
        />
        <span
          className={`truncate text-sm font-semibold ${selected ? 'text-text' : 'text-muted'}`}
        >
          {substat.name}
        </span>
        <span className="substat-card__select ml-auto" aria-hidden="true">
          {selected && <IconCheck className="h-3 w-3 text-[#101014]" />}
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

  function indexFromClient(clientX: number): number {
    const track = trackRef.current
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round(p * (N - 1))
  }

  function onPointerDown(e: React.PointerEvent) {
    if (disabled) return
    e.preventDefault()
    const startX = e.clientX
    const startIdx = indexFromClient(startX)
    const dMin = Math.abs(startIdx - minRef.current)
    const dMax = Math.abs(startIdx - maxRef.current)
    // Grab the nearer thumb; when the thumbs overlap, pick by drag direction.
    let target: 'min' | 'max' | null = dMin < dMax ? 'min' : dMax < dMin ? 'max' : null

    const move = (ev: PointerEvent) => {
      if (target === null) {
        if (ev.clientX < startX) target = 'min'
        else if (ev.clientX > startX) target = 'max'
        else return
      }
      const idx = indexFromClient(ev.clientX)
      let mn = minRef.current
      let mx = maxRef.current
      if (target === 'min') {
        // May meet the right thumb, so a single value can be selected.
        mn = Math.max(0, Math.min(mx, idx))
      } else {
        mx = Math.min(N - 1, Math.max(mn, idx))
      }
      apply(mn, mx)
    }
    const up = () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={disabled ? 'pointer-events-none opacity-40' : ''}
    >
      <div ref={trackRef} onPointerDown={onPointerDown} className="rng">
        <div className="rng__track" />
        <div
          className="rng__fill"
          style={{ left: pct(minIdx), width: `calc(${pct(maxIdx)} - ${pct(minIdx)})` }}
        />
        <div className="rng__thumb" style={{ left: pct(minIdx) }} />
        <div className="rng__thumb" style={{ left: pct(maxIdx) }} />
      </div>

      <div className="pointer-events-none mt-2 flex justify-between">
        {values.map((v, i) => {
          const active = i >= minIdx && i <= maxIdx
          return (
            <span
              key={i}
              className={`text-[0.6rem] tabular-nums leading-none transition-colors ${
                active ? 'font-semibold' : 'text-faint/60'
              }`}
              style={active ? { color: 'var(--accent)' } : undefined}
            >
              {format(v)}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function ResultsPanel({ result }: { result: ReturnType<typeof calcProbability> }) {
  if (!result) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center">
        <h2 className="mb-3 text-center text-xs uppercase tracking-widest text-muted">Results</h2>
        <p className="py-8 text-sm text-muted">Select a substat to see the probability</p>
      </div>
    )
  }

  const p = Math.max(0, result.prob)
  const pct = formatPct(p)
  const oneIn = format1inX(p)
  const cls = pctClass(p)

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="mb-3 text-center text-xs uppercase tracking-widest text-muted">Results</h2>
      <div className="fade-in text-center">
        <div className="text-4xl font-extrabold tabular-nums" style={{ color: RESULT_COLORS[cls] }}>
          {pct}
        </div>
        <div className="mt-0.5 text-sm font-semibold text-muted">{oneIn}</div>
        <div className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-faint">
          within {result.rolls} roll{result.rolls > 1 ? 's' : ''}
        </div>

        {result.wantIds.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {result.wantIds.map((id) => {
              const s = substatById(id)
              if (!s) return null
              return (
                <span key={id} className="chip border-border bg-surface-2 text-text">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: COLOR_MAP[s.color] ?? '#8892a0' }}
                  />
                  {s.name}
                </span>
              )
            })}
          </div>
        )}

        {result.impossible && (
          <p className="mt-1.5 text-xs font-semibold" style={{ color: 'var(--color-danger)' }}>
            Can&rsquo;t fit {result.wantIds.length} substats into {result.rolls} roll
            {result.rolls > 1 ? 's' : ''}
          </p>
        )}

        {!result.impossible && (
          <div className="mx-auto mt-4 max-w-lg border-t border-border pt-3">
            <h3 className="mb-2 text-[0.65rem] uppercase tracking-wider text-muted">Breakdown</h3>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  {['Substat', 'Appears', 'Value', 'Result'].map((h) => (
                    <th
                      key={h}
                      className="border-b border-border px-1 py-1 text-center font-semibold uppercase tracking-wide text-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.wantIds.map((id) => {
                  const d = result.indiv[id]
                  const name = substatById(id)?.name ?? id
                  return (
                    <tr key={id} className="border-b border-border/40">
                      <td className="px-1 py-1 text-center">{name}</td>
                      <td className="px-1 py-1 text-center tabular-nums">{formatPct(d.indivProb)}</td>
                      <td className="px-1 py-1 text-center tabular-nums">{formatPct(d.valueProb)}</td>
                      <td className="px-1 py-1 text-center tabular-nums">
                        {formatPct(d.indivProb * d.valueProb)}
                      </td>
                    </tr>
                  )
                })}
                <tr className="border-t-2 border-border font-bold text-text">
                  <td className="px-1 py-1.5 text-center">Combined</td>
                  <td className="px-1 py-1.5 text-center tabular-nums">
                    {formatPct(result.basicProb)}
                  </td>
                  <td className="px-1 py-1.5 text-center tabular-nums">
                    {formatPct(result.valueFactor)}
                  </td>
                  <td className="px-1 py-1.5 text-center tabular-nums">{pct}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
