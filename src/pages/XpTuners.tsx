import { useEffect, useMemo, useState } from 'react'
import {
  CHECKPOINTS,
  totalXp,
  fmt,
  fmtRatio,
  getBalanceText,
  getBalanceIndicator,
  type Resources,
} from '../lib/balance'

interface BalanceState {
  cp: (typeof CHECKPOINTS)[number]
  cpIdx: number
  cpNext: (typeof CHECKPOINTS)[number] | null
  byXp: number
  byTuners: number
  bySc: number
  maxTest: number
  pushCount: number
  pushStr: string
  maxVal: number
  minVal: number
  bottleneck: string
  bottleneckClass: 'success' | 'warning' | 'danger'
  ratio: number
  bal: { text: string; cls: 'red' | 'yellow' | 'green' }
  indicatorPos: number
  leftLabel: string
  rightLabel: string
  centerLabel: string
  ratioBadgeCls: string
  ratioBadgeText: string
  bIcon: string
  bText: string
  totalXp: number
  comps: { num: number; cls: string; text: string; active: boolean }[]
}

function buildBalance(res: Resources, cpIdx: number): BalanceState {
  const cp = CHECKPOINTS[cpIdx]
  const cpNext = cpIdx < 4 ? CHECKPOINTS[cpIdx + 1] : null

  const byXp = Math.floor(res.xp / cp.xp)
  const byTuners = Math.floor(res.tuners / cp.tuners)
  const bySc = Math.floor(res.sc / cp.sc)
  const maxTest = Math.min(byXp, byTuners, bySc)

  let pushCount = 0
  let pushStr = ''
  if (maxTest > 0 && cpNext) {
    const xpAfter = res.xp - maxTest * cp.xp
    const tunersAfter = res.tuners - maxTest * cp.tuners
    const scAfter = res.sc - maxTest * cp.sc
    const legXp = cpNext.xp - cp.xp
    const legTuners = cpNext.tuners - cp.tuners
    const legSc = cpNext.sc - cp.sc
    const byXpN = Math.floor(xpAfter / legXp)
    const byTunersN = Math.floor(tunersAfter / legTuners)
    const byScN = Math.floor(scAfter / legSc)
    pushCount = Math.min(byXpN, byTunersN, byScN, maxTest)
    const good = Math.floor(maxTest * 0.4)
    pushStr = pushCount > 0 ? `${pushCount} can push to ${cpNext.label} (${good} expected good substats)` : 'No resources left to push further'
  } else if (!cpNext) {
    pushStr = 'Already at max level'
  } else {
    pushStr = 'Need resources to test first'
  }

  const maxVal = Math.max(byXp, byTuners, bySc, 1)
  const minVal = Math.min(byXp, byTuners, bySc)

  let bottleneck = ''
  let bottleneckClass: BalanceState['bottleneckClass'] = 'success'
  if (minVal === 0) {
    if (byXp === 0 && byTuners === 0 && bySc === 0) {
      bottleneck = 'All depleted'
      bottleneckClass = 'danger'
    } else if (byXp === 0) {
      bottleneck = 'Echo XP'
      bottleneckClass = 'warning'
    } else if (byTuners === 0) {
      bottleneck = 'Premium Tuners'
      bottleneckClass = 'warning'
    } else {
      bottleneck = 'Shell Credits'
      bottleneckClass = 'warning'
    }
  } else {
    const sorted = [
      { name: 'Echo XP', val: byXp },
      { name: 'Premium Tuners', val: byTuners },
      { name: 'Shell Credits', val: bySc },
    ].sort((a, b) => a.val - b.val)
    bottleneck = sorted[0].name
    if (sorted[0].val === sorted[1].val) {
      if (sorted[0].val === sorted[2].val) {
        bottleneck = 'All balanced'
        bottleneckClass = 'success'
      } else {
        bottleneck = `${sorted[0].name} & ${sorted[1].name}`
        bottleneckClass = 'warning'
      }
    } else {
      bottleneckClass = sorted[0].val < sorted[1].val * 0.5 ? 'danger' : 'warning'
    }
  }

  const ratio = res.tuners > 0 ? res.xp / res.tuners : res.xp > 0 ? Infinity : 1
  const bal = getBalanceText(ratio, cp.ratio)
  const indicatorPos = Math.max(0, Math.min(100, getBalanceIndicator(ratio, cp.ratio)))

  let leftLabel = 'XP'
  let rightLabel = 'Tuners'
  let centerLabel = bal.cls === 'green' ? 'BALANCED' : 'MISMATCH'
  if (res.tuners === 0 && res.xp > 0) {
    leftLabel = 'XP-heavy'
    rightLabel = 'No Tuners!'
    centerLabel = 'UNBALANCED'
  } else if (res.xp === 0 && res.tuners > 0) {
    leftLabel = 'No XP!'
    rightLabel = 'Tuner-heavy'
    centerLabel = 'UNBALANCED'
  } else {
    const pct = ratio / cp.ratio
    if (pct > 1.3) {
      leftLabel = 'XP-heavy'
      rightLabel = 'Tuner-light'
    } else if (pct > 0.7) {
      leftLabel = 'Slightly XP-heavy'
      rightLabel = 'Slightly Tuner-heavy'
    } else if (pct > 0) {
      leftLabel = 'XP-light'
      rightLabel = 'Tuner-heavy'
    }
  }

  const ratioText = fmtRatio(cp.ratio)
  let ratioBadgeCls = 'xp-side'
  let ratioBadgeText = `${ratioText} XP/Tuner`
  if (bal.cls === 'red' && bal.text.includes('Tuner')) {
    ratioBadgeCls = 'tuner-side'
    ratioBadgeText = `${ratioText} XP/Tuner → you need more Tuners`
  } else if (bal.cls === 'red' && bal.text.includes('XP')) {
    ratioBadgeCls = 'xp-side'
    ratioBadgeText = `${ratioText} XP/Tuner → you need more XP`
  } else if (bal.cls === 'green') {
    ratioBadgeCls = 'balanced'
    ratioBadgeText = `${ratioText} XP/Tuner ✓ balanced for you`
  } else {
    ratioBadgeCls = ratio > cp.ratio ? 'tuner-side' : 'xp-side'
  }

  let bIcon = '✅'
  let bText = ''
  if (bottleneckClass === 'danger') {
    bIcon = '🔴'
    const lim = bottleneck.includes('XP') ? 'xp' : bottleneck.includes('Tuner') ? 'tuner' : 'sc'
    bText = `<strong>Severe bottleneck:</strong> Your <span class="lim-${lim}">${bottleneck}</span> is critically low. Consider farming more before rolling at ${cp.label}.`
  } else if (bottleneckClass === 'warning') {
    bIcon = '⚠️'
    const lim = bottleneck.includes('XP') ? 'xp' : bottleneck.includes('Tuner') ? 'tuner' : 'sc'
    bText = `<strong>Watch out:</strong> Your <span class="lim-${lim}">${bottleneck}</span> will run out first when testing at ${cp.label}.`
  } else {
    bIcon = '✅'
    bText = `<strong>Balanced!</strong> Your XP, Tuners, and Shell Credits are well-proportioned for rolling at ${cp.label}.`
  }

  const comps = CHECKPOINTS.map((c, i) => {
    const n = Math.min(Math.floor(res.xp / c.xp), Math.floor(res.tuners / c.tuners), Math.floor(res.sc / c.sc))
    const r = getBalanceText(res.tuners > 0 ? res.xp / res.tuners : Infinity, c.ratio)
    return { num: n, cls: r.cls, text: r.text, active: cpIdx === i }
  })

  return {
    cp,
    cpIdx,
    cpNext,
    byXp,
    byTuners,
    bySc,
    maxTest,
    pushCount,
    pushStr,
    maxVal,
    minVal,
    bottleneck,
    bottleneckClass,
    ratio,
    bal,
    indicatorPos,
    leftLabel,
    rightLabel,
    centerLabel,
    ratioBadgeCls,
    ratioBadgeText,
    bIcon,
    bText,
    totalXp: res.xp,
    comps,
  }
}

type SimResult = { kind: 'success' | 'fail'; verdict: string; detail: string }

function runSim(count: number, res: Resources, cpIdx: number): SimResult {
  const cp = CHECKPOINTS[cpIdx]
  const cpNext = cpIdx < 4 ? CHECKPOINTS[cpIdx + 1] : null

  if (count <= 0) {
    return { kind: 'fail', verdict: 'Invalid number', detail: 'Enter at least 1 echo to simulate.' }
  }

  const costXp = count * cp.xp
  const costTuners = count * cp.tuners
  const costSc = count * cp.sc
  const canAfford = res.xp >= costXp && res.tuners >= costTuners && res.sc >= costSc
  const remainingXp = res.xp - costXp
  const remainingTuners = res.tuners - costTuners
  const remainingSc = res.sc - costSc
  const expectedGood = Math.floor(count * 0.4)
  const expectedBad = count - expectedGood

  if (canAfford) {
    let detail = `Testing ${count} echo${count > 1 ? 'es' : ''} to <strong>${cp.label}</strong> costs <strong>${fmt(costXp)} XP</strong> + <strong>${costTuners} Tuners</strong> + <strong>${fmt(costSc)} SC</strong>. `
    detail += `After rolling: <strong>${fmt(Math.max(0, remainingXp))} XP</strong>, <strong>${Math.max(0, remainingTuners)} Tuners</strong>, <strong>${fmt(Math.max(0, remainingSc))} SC</strong> remain.`

    if (cpNext && expectedGood > 0) {
      const legXp = cpNext.xp - cp.xp
      const legTuners = cpNext.tuners - cp.tuners
      const legSc = cpNext.sc - cp.sc
      detail += `<br>Expected: ~<strong>${expectedGood}</strong> echo${expectedGood > 1 ? 'es' : ''} have good substats. `
      if (remainingXp >= expectedGood * legXp && remainingTuners >= expectedGood * legTuners && remainingSc >= expectedGood * legSc) {
        detail += `You can afford to push all ${expectedGood} good ones to ${cpNext.label}.`
      } else {
        const px = Math.floor(remainingXp / legXp)
        const pt = Math.floor(remainingTuners / legTuners)
        const ps = Math.floor(remainingSc / legSc)
        const p = Math.min(px, pt, ps, expectedGood)
        detail += p > 0 ? `You can push <strong>${p}</strong> of them to ${cpNext.label}.` : `No resources left to push any to ${cpNext.label}.`
      }
    } else if (expectedGood > 0 && !cpNext) {
      detail += `<br>Expected: ~<strong>${expectedGood}</strong> already maxed out.`
    }

    detail += `<br>Failed echoes (${expectedBad}) can be fed as fodder for ~70% XP back.`
    return { kind: 'success', verdict: '✓ You can afford this', detail }
  }

  const shortages: string[] = []
  if (res.xp < costXp) shortages.push(`${fmt(costXp - res.xp)} more XP`)
  if (res.tuners < costTuners) shortages.push(`${costTuners - res.tuners} more Tuners`)
  if (res.sc < costSc) shortages.push(`${fmt(costSc - res.sc)} more SC`)
  return { kind: 'fail', verdict: '✗ Not enough resources', detail: `You need ${shortages.join(', ')} to test ${count} echo${count > 1 ? 'es' : ''} to ${cp.label}.` }
}

export function XpTuners() {
  const [tubes, setTubes] = useState({ basic: 0, medium: 0, advanced: 0, premium: 16 })
  const [tuners, setTuners] = useState(12)
  const [sc, setSc] = useState(100000)
  const [cpIdx, setCpIdx] = useState(1)
  const [simCount, setSimCount] = useState(3)
  const [simResult, setSimResult] = useState<SimResult | null>(null)

  const res: Resources = useMemo(
    () => ({ xp: totalXp(tubes), tuners, sc }),
    [tubes, tuners, sc],
  )

  const b = useMemo(() => buildBalance(res, cpIdx), [res, cpIdx])

  useEffect(() => {
    setSimResult(runSim(3, res, cpIdx))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function runSimNow() {
    setSimResult(runSim(simCount, res, cpIdx))
  }

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

  const BAL_CLASS: Record<string, string> = {
    green: '#4dab5e',
    yellow: '#d4a72c',
    red: '#e04848',
  }

  return (
    <div className="page-wrap pt-6">
      <div className="pb-5 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">
          <span className="text-text">echoes.</span>
          <span className="text-info">balance</span>
        </h1>
        <p className="mt-1 text-sm text-muted">Keep your Echo XP and Premium Tuners in check — smart rolling from +10 onward</p>
      </div>

      {/* Resources */}
      <section className="card">
        <h2 className="card-title">Your Resources</h2>
        <div className="flex flex-wrap gap-4">
          <NumberField label="Basic Tubes" color="#5a9e6b" hint="500 XP each" value={tubes.basic} onChange={(v) => setTube('basic', v)} />
          <NumberField label="Medium Tubes" color="#6ac9ff" hint="1,000 XP each" value={tubes.medium} onChange={(v) => setTube('medium', v)} />
          <NumberField label="Advanced Tubes" color="#b07cd8" hint="2,000 XP each" value={tubes.advanced} onChange={(v) => setTube('advanced', v)} />
          <NumberField label="Premium Tubes" color="#d4a72c" hint="5,000 XP each" value={tubes.premium} onChange={(v) => setTube('premium', v)} />
          <NumberField label="Premium Tuners" hint="Each tune at +5/+10/+15/+20/+25 costs 1" value={tuners} onChange={setTuners} />
          <NumberField label="Shell Credits" hint="0.1 × XP + 2,000 per tune" value={sc} onChange={setSc} step={5000} />
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-muted">
          <span>Total Echo XP:</span>
          <strong className="text-xl font-bold text-info">{fmt(res.xp)}</strong>
        </div>
      </section>

      {/* Checkpoint */}
      <section className="card mt-4">
        <h2 className="card-title">Checkpoint Level</h2>
        <p className="-mb-0.5 text-sm text-muted">
          Drag to choose how far you go before checking substats. Higher levels use more Tuners per XP — find where{' '}
          <em>your</em> stash is balanced.
        </p>
        <div className="relative pt-3">
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={cpIdx}
            onChange={(e) => setCpIdx(parseInt(e.target.value))}
            className="w-full cursor-pointer"
            style={{ accentColor: 'var(--color-info)' }}
          />
        </div>
        <div className="mt-2 flex">
          {CHECKPOINTS.map((cp, i) => (
            <button
              key={cp.label}
              onClick={() => setCpIdx(i)}
              className={`flex-1 cursor-pointer px-1 py-1.5 text-center text-xs font-bold transition-colors ${
                i === cpIdx ? 'text-text' : 'text-faint'
              }`}
            >
              <span
                className={`mx-auto mb-1 block h-2.5 w-2.5 rounded-full transition-all ${
                  i === cpIdx ? 'bg-text shadow-[0_0_6px_rgba(240,244,250,0.25)]' : 'bg-border'
                }`}
              />
              {cp.label}
              <span className={`block text-[9px] font-normal ${i === cpIdx ? 'text-muted' : 'text-faint'}`}>{cp.substats}</span>
            </button>
          ))}
        </div>
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg border border-border bg-bg px-4 py-3 text-sm text-muted">
          <span>
            <strong className="text-text">{b.cp.label}</strong> — {b.cp.substats}
          </span>
          <span>
            <strong className="text-text">{fmt(b.cp.xp)}</strong> XP + <strong className="text-text">{b.cp.tuners}</strong> Premium Tuners +{' '}
            <strong className="text-text">{fmt(b.cp.sc)}</strong> SC
          </span>
          <span
            className={`chip ${
              b.ratioBadgeCls === 'balanced'
                ? 'bg-success/10 text-success'
                : b.ratioBadgeCls === 'tuner-side'
                  ? 'bg-warning/10 text-warning'
                  : 'bg-info/10 text-info'
            }`}
          >
            {b.ratioBadgeText}
          </span>
        </div>
      </section>

      {/* Cost reference */}
      <section className="card mt-4">
        <h2 className="card-title">Cost Reference · 5★ Echo</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {['Milestone', 'XP Cost', 'XP ↑ this leg', 'Tuners', 'Shell Credits', 'Action'].map((h) => (
                  <th key={h} className="border-b border-border px-2.5 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-faint">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHECKPOINTS.map((cp, i) => {
                const prev = i > 0 ? CHECKPOINTS[i - 1] : null
                const legXp = prev ? cp.xp - prev.xp : cp.xp
                const highlighted = i === 1
                return (
                  <tr key={cp.label} className="border-b border-border/40">
                    <td className="px-2.5 py-1.5">0 → {cp.label}</td>
                    <td className={`px-2.5 py-1.5 text-right font-semibold tabular-nums ${highlighted ? 'text-info' : ''}`}>{fmt(cp.xp)}</td>
                    <td className="px-2.5 py-1.5 text-right tabular-nums">{fmt(legXp)}</td>
                    <td className={`px-2.5 py-1.5 text-right font-semibold tabular-nums ${highlighted ? 'text-info' : ''}`}>{cp.tuners}</td>
                    <td className={`px-2.5 py-1.5 text-right tabular-nums ${highlighted ? 'text-info' : ''}`}>{fmt(cp.sc)}</td>
                    <td className={`px-2.5 py-1.5 ${highlighted ? 'font-bold text-success' : 'text-muted'}`}>
                      {i === 0 && 'Tune 1st substat'}
                      {i === 1 && 'Checkpoint — stop if bad'}
                      {i === 2 && 'Tune 3rd substat'}
                      {i === 3 && 'Tune 4th substat'}
                      {i === 4 && 'Maxed'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Budget overview */}
      <section className="card mt-4">
        <h2 className="card-title">Budget Overview</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Metric label={`Can test to ${b.cp.label}`} value={String(b.maxTest)} color="blue" sub={`echoes (level & tune substats)`} />
          <Metric label={`Can push to ${b.cpNext ? b.cpNext.label : 'MAX'}`} value={String(b.pushCount)} color="blue" sub={b.pushStr} />
          <Metric label="Bottleneck" value={b.bottleneck} color={b.bottleneckClass === 'danger' ? 'red' : b.bottleneckClass === 'warning' ? 'yellow' : 'green'} sub="limits how many you can roll" />
          <Metric label="Balance Score" value={b.bal.text} color={b.bal.cls} sub="XP vs Tuner ratio" />
        </div>

        <div className="mt-3.5">
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

        <div className="mt-3.5">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-faint">XP ⇄ Tuner Balance</div>
          <div className="relative flex h-6 items-center">
            <div className="flex h-2 flex-1 rounded-l bg-info" style={{ opacity: 0.9 }} />
            <div className="flex h-2 flex-1 rounded-r bg-warning" style={{ opacity: 0.9 }} />
            <div
              className="absolute z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-text shadow shadow-black/30 transition-[left] duration-300"
              style={{ left: `${b.indicatorPos}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px]">
            <span className="font-semibold text-info">{b.leftLabel}</span>
            <span className="text-[11px] font-bold text-text">{b.centerLabel}</span>
            <span className="font-semibold text-warning">{b.rightLabel}</span>
          </div>
        </div>

        <div
          className={`mt-3 flex items-center gap-2.5 rounded-lg border px-4 py-3 ${
            b.bottleneckClass === 'danger'
              ? 'border-danger/40'
              : b.bottleneckClass === 'warning'
                ? 'border-warning/40'
                : 'border-success/40'
          }`}
        >
          <span className="text-xl">{b.bIcon}</span>
          <p className="text-sm text-muted" dangerouslySetInnerHTML={{ __html: b.bText }} />
        </div>

        <div className="mt-3.5">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-faint">
            Quick comparison — how many tests at each checkpoint
          </div>
          <div className="grid grid-cols-5 gap-2">
            {b.comps.map((c, i) => (
              <div
                key={i}
                className={`rounded-lg border p-2.5 text-center ${c.active ? 'border-info/40' : 'border-border'} bg-bg`}
              >
                <div className="text-[11px] font-semibold text-faint">{CHECKPOINTS[i].label}</div>
                <div className="my-0.5 text-lg font-bold tabular-nums" style={{ color: 'var(--color-info)' }}>
                  {c.num}
                </div>
                <div className="text-[10px]" style={{ color: BAL_CLASS[c.cls] }}>
                  {c.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator */}
      <section className="card mt-4 pb-3">
        <h2 className="card-title">Strategy Simulator</h2>
        <p className="mb-3 text-sm text-muted">
          Smart strategy: level to <strong className="text-text">{b.cp.label}</strong>, tune substats, stop if bad (~60% chance).
          <br />
          If good (~40% chance), consider pushing further.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[140px]">
            <label className="label">Echoes to test to <span className="text-text">{b.cp.label}</span></label>
            <input className="input w-28" type="number" min={0} value={simCount} onChange={(e) => setSimCount(parseInt(e.target.value) || 0)} />
          </div>
          <button className="btn" style={{ background: '#1a6bb0', borderColor: '#1a6bb0', color: '#fff', fontWeight: 700 }} onClick={runSimNow}>
            Simulate
          </button>
        </div>

        {simResult && (
          <div
            className={`mt-3 rounded-lg border px-4 py-3.5 ${
              simResult.kind === 'success' ? 'border-success/40 bg-success/10' : 'border-danger/40 bg-danger/10'
            }`}
          >
            <div className="mb-1 text-lg font-bold" style={{ color: simResult.kind === 'success' ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {simResult.verdict}
            </div>
            <p className="text-sm leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: simResult.detail }} />
          </div>
        )}
      </section>

      {/* Expected outcomes */}
      <section className="card mt-4">
        <h2 className="card-title">Expected Outcomes (per 10 echoes tested to +10)</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
          <li>~<strong className="text-text">4</strong> will have good substats → worth pushing to +15/+20/+25</li>
          <li>~<strong className="text-text">6</strong> will have bad substats → stop at +10, use as fodder (70% XP back)</li>
          <li>Avg effective XP lost per failed echo: ~<strong className="text-text">4,950</strong> (after 70% refund)</li>
          <li>Tuners are <strong className="text-text">not recovered</strong> when feeding — spend wisely!</li>
        </ul>
      </section>
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
    <div className="min-w-[180px] flex-1">
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
