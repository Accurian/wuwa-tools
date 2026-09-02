import { useMemo, useRef, useState } from 'react'
import {
  CHECKPOINTS,
  totalXp,
  fmt,
  fmtRatio,
  getBalanceText,
  type Resources,
} from '../lib/balance'

interface BalanceState {
  cp: (typeof CHECKPOINTS)[number]
  byXp: number
  byTuners: number
  bySc: number
  maxTest: number
  maxVal: number
  bal: { text: string; cls: 'red' | 'yellow' | 'green' }
  ratioDisplay: string
}

function buildBalance(res: Resources, cpIdx: number): BalanceState {
  const cp = CHECKPOINTS[cpIdx]
  const byXp = Math.floor(res.xp / cp.xp)
  const byTuners = Math.floor(res.tuners / cp.tuners)
  const bySc = Math.floor(res.sc / cp.sc)
  const maxTest = Math.min(byXp, byTuners, bySc)
  const maxVal = Math.max(byXp, byTuners, bySc, 1)

  const ratio = res.tuners > 0 ? res.xp / res.tuners : res.xp > 0 ? Infinity : 1
  const bal = getBalanceText(ratio, cp.ratio)
  const ratioDisplay = res.tuners > 0 ? `${fmtRatio(res.xp / res.tuners)} : 1` : '\u221e : 1'

  return { cp, byXp, byTuners, bySc, maxTest, maxVal, bal, ratioDisplay }
}

export function XpTuners() {
  const [tubes, setTubes] = useState({ basic: 0, medium: 0, advanced: 0, premium: 16 })
  const [tuners, setTuners] = useState(12)
  const [sc, setSc] = useState(100000)
  const [cpIdx, setCpIdx] = useState(1)

  const res: Resources = useMemo(
    () => ({ xp: totalXp(tubes), tuners, sc }),
    [tubes, tuners, sc],
  )
  const b = useMemo(() => buildBalance(res, cpIdx), [res, cpIdx])

  function setTube(key: 'basic' | 'medium' | 'advanced' | 'premium', v: number) {
    setTubes((prev) => ({ ...prev, [key]: v }))
  }

  const barSegments = [
    { label: 'By XP', fill: 'xp', width: (b.byXp / b.maxVal) * 100, val: b.byXp },
    { label: 'By Tuners', fill: 'tuner', width: (b.byTuners / b.maxVal) * 100, val: b.byTuners },
    { label: 'By Shell Credits', fill: 'sc', width: (b.bySc / b.maxVal) * 100, val: b.bySc },
  ]
  const BAR_COLORS: Record<string, string> = {
    xp: 'linear-gradient(90deg, #6ac9ff, #4da8e8)',
    tuner: 'linear-gradient(90deg, #d4a72c, #e8c84d)',
    sc: 'linear-gradient(90deg, #4dab5e, #6acc7e)',
  }

  return (
    <div className="page-wrap pt-8">
      {/* Resources */}
      <section className="card">
        <h2 className="card-title">Your Resources</h2>

        <div className="flex flex-wrap gap-4">
          <NumberField label="Basic Tubes" color="#5a9e6b" hint="500 XP each" value={tubes.basic} onChange={(v) => setTube('basic', v)} />
          <NumberField label="Medium Tubes" color="#6ac9ff" hint="1,000 XP each" value={tubes.medium} onChange={(v) => setTube('medium', v)} />
          <NumberField label="Advanced Tubes" color="#b07cd8" hint="2,000 XP each" value={tubes.advanced} onChange={(v) => setTube('advanced', v)} />
          <NumberField label="Premium Tubes" color="#d4a72c" hint="5,000 XP each" value={tubes.premium} onChange={(v) => setTube('premium', v)} />
          <div className="min-w-[140px] flex-1">
            <label className="label">Total Echo XP</label>
            <div className="input flex items-center text-base font-semibold" style={{ color: 'var(--color-info)' }}>
              {fmt(res.xp)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <NumberField label="Premium Tuners" hint="Each tune at +5/+10/+15/+20/+25 costs 1" value={tuners} onChange={setTuners} />
          <NumberField label="Shell Credits" hint="0.1 × XP + 2,000 per tune" value={sc} onChange={setSc} step={5000} />
        </div>
      </section>

      {/* Checkpoint */}
      <section className="card mt-4">
        <h2 className="card-title">Checkpoint Level</h2>
        <p className="text-sm text-muted">
          Choose how far you go before checking substats. Higher levels use more Tuners per XP —
          find where <em>your</em> stash is balanced.
        </p>
        <div className="mt-4">
          <CheckpointSlider value={cpIdx} onChange={setCpIdx} />
        </div>
      </section>

      {/* Budget Overview */}
      <section className="card mt-4">
        <h2 className="card-title">Budget Overview</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Metric label={`Can test to ${b.cp.label}`} value={String(b.maxTest)} color="blue" sub="echoes you can roll" />
          <Metric label="Bottleneck" value={b.ratioDisplay} color={b.bal.cls} sub="XP : Tuner ratio" />
        </div>

        <div className="mt-4">
          {barSegments.map((seg) => (
            <div key={seg.label} className="mb-2 flex items-center gap-2.5">
              <span className="w-[100px] shrink-0 text-right text-xs text-muted">{seg.label}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded border border-border bg-bg">
                <div
                  className="h-full rounded"
                  style={{ width: `${Math.min(seg.width, 100)}%`, background: BAR_COLORS[seg.fill], transition: 'width .3s', minWidth: 2 }}
                />
              </div>
              <span className="w-[50px] shrink-0 text-right text-xs font-semibold tabular-nums">{seg.val}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function CheckpointSlider({ value, onChange }: { value: number; onChange: (i: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const N = CHECKPOINTS.length
  const pct = (i: number) => `${(i / (N - 1)) * 100}%`

  function setFromClient(clientX: number) {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    let p = (clientX - rect.left) / rect.width
    p = Math.max(0, Math.min(1, p))
    const idx = Math.round(p * (N - 1))
    onChange(Math.max(0, Math.min(N - 1, idx)))
  }

  function onPointerDown(e: React.PointerEvent) {
    setFromClient(e.clientX)
    const move = (ev: PointerEvent) => setFromClient(ev.clientX)
    const up = () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  }

  return (
    <div>
      <div ref={trackRef} onPointerDown={onPointerDown} className="relative h-4 cursor-pointer select-none touch-none">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-bg" />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-info shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          style={{ left: pct(value) }}
        />
      </div>

      <div className="relative mt-2 h-6">
        {CHECKPOINTS.map((cp, i) => (
          <button
            key={cp.label}
            onClick={() => onChange(i)}
            style={{ left: pct(i) }}
            className={`absolute top-0 -translate-x-1/2 whitespace-nowrap px-0.5 text-xs font-bold tracking-wide transition-colors ${
              i === value ? 'text-text' : 'text-faint hover:text-muted'
            }`}
          >
            {cp.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function NumberField({
  label,
  value,
  onChange,
  hint,
  color,
  step = 1,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  hint?: string
  color?: string
  step?: number
}) {
  return (
    <div className="min-w-[140px] flex-1">
      <label className="label" style={color ? { color } : undefined}>
        {label}
      </label>
      <input
        className="input text-base font-semibold"
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      />
      {hint && <p className="mt-1 text-[11px] text-faint">{hint}</p>}
    </div>
  )
}

function Metric({
  label,
  value,
  color,
  sub,
}: {
  label: string
  value: string
  color: string
  sub: string
}) {
  const COLORS: Record<string, string> = {
    green: 'var(--color-success)',
    yellow: 'var(--color-warning)',
    red: 'var(--color-danger)',
    blue: 'var(--color-info)',
  }
  return (
    <div className="rounded-lg border border-border bg-bg px-4 py-3.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-faint">{label}</div>
      <div className="mt-0.5 text-2xl font-bold" style={{ color: COLORS[color] || COLORS.blue }}>
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-faint">{sub}</div>
    </div>
  )
}
