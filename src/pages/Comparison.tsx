import { useMemo, useRef, useState } from 'react'
import {
  SUBSTATS,
  STAT_NAMES,
  getDisplay,
  findClosestValueIndex,
  calcQuality,
  getQualityColor,
  getTierLabel,
  getTierColor,
  PRESETS,
} from '../lib/substats'

interface Slot {
  statName: string | null
  valueIndex: number
}

interface Echo {
  id: number
  name: string
  slots: Slot[]
}

function createEcho(id: number): Echo {
  return {
    id,
    name: `Echo ${id}`,
    slots: Array.from({ length: 5 }, () => ({ statName: null, valueIndex: -1 })),
  }
}

function initialEchoes(): Echo[] {
  return [createEcho(1), createEcho(2)]
}

function usedStatNames(echo: Echo): string[] {
  return echo.slots.filter((s) => s.statName).map((s) => s.statName as string)
}

function calcEchoScore(echo: Echo, charWeights: Record<string, number>): number {
  let total = 0
  for (const slot of echo.slots) {
    if (!slot.statName || slot.valueIndex < 0) continue
    const s = SUBSTATS[slot.statName]
    if (!s || slot.valueIndex >= s.values.length) continue
    const weight = charWeights[slot.statName] || 1
    total += weight * (s.values[slot.valueIndex] / s.median)
  }
  if (total === 0) return 0
  return Math.round(total * 100) / 100
}

function findBestEcho(echoes: Echo[], charWeights: Record<string, number>): number | null {
  let bestId: number | null = null
  let bestScore = -1
  for (const echo of echoes) {
    const score = calcEchoScore(echo, charWeights)
    if (score > bestScore) {
      bestScore = score
      bestId = echo.id
    }
  }
  return bestId
}

export function Comparison() {
  const [echoes, setEchoes] = useState<Echo[]>(initialEchoes)
  const [charWeights, setCharWeights] = useState<Record<string, number>>(() => {
    const w: Record<string, number> = {}
    for (const n of STAT_NAMES) w[n] = 0
    return w
  })
  const [weightsOpen, setWeightsOpen] = useState(false)
  const nextIdRef = useRef(3)

  const bestId = useMemo(
    () => findBestEcho(echoes, charWeights),
    [echoes, charWeights],
  )

  const hasWeights = useMemo(() => STAT_NAMES.some((n) => charWeights[n] > 0), [charWeights])

  const filledCount = echoes.reduce(
    (sum, e) => sum + e.slots.filter((s) => s.statName && s.valueIndex >= 0).length,
    0,
  )
  const totalSlots = echoes.reduce((sum, e) => sum + e.slots.length, 0)

  const bestScore = bestId !== null ? calcEchoScore(echoes.find((e) => e.id === bestId)!, charWeights) : 0

  const statusText = `${echoes.length} echo${echoes.length > 1 ? 's' : ''} · ${filledCount}/${totalSlots} substats filled${
    bestScore > 0 && bestId !== null
      ? ` · Best: ${echoes.find((e) => e.id === bestId)!.name} (${bestScore.toFixed(2)}%)`
      : ''
  }`

  function addEcho() {
    if (echoes.length >= 10) return
    const id = nextIdRef.current++
    setEchoes((prev) => [...prev, createEcho(id)])
  }

  function removeEcho(id: number) {
    if (echoes.length <= 1) return
    setEchoes((prev) => prev.filter((e) => e.id !== id))
  }

  function resetEcho(id: number) {
    setEchoes((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, slots: e.slots.map(() => ({ statName: null, valueIndex: -1 })) }
          : e,
      ),
    )
  }

  function resetAll() {
    nextIdRef.current = 1
    const fresh = initialEchoes()
    // ids 1,2 regenerated; keep counter aligned after init
    nextIdRef.current = fresh[fresh.length - 1].id + 1
    setEchoes(fresh)
  }

  function setSubstat(echoId: number, slotIdx: number, statName: string) {
    setEchoes((prev) =>
      prev.map((e) => {
        if (e.id !== echoId) return e
        const slot = e.slots[slotIdx]
        if (slot.statName === statName) return e
        const used = usedStatNames(e).filter((s) => s !== slot.statName)
        if (statName && used.includes(statName)) return e
        const slots = e.slots.map((s, i) => {
          if (i !== slotIdx) return s
          let valueIndex = -1
          if (statName) {
            const def = SUBSTATS[statName]
            if (def) {
              const medianIdx = findClosestValueIndex(statName, def.median)
              valueIndex = medianIdx >= 0 ? medianIdx : 0
            }
          }
          return { statName, valueIndex }
        })
        return { ...e, slots }
      }),
    )
  }

  function setValue(echoId: number, slotIdx: number, valueIndex: number) {
    setEchoes((prev) =>
      prev.map((e) =>
        e.id === echoId
          ? {
              ...e,
              slots: e.slots.map((s, i) => (i === slotIdx ? { ...s, valueIndex } : s)),
            }
          : e,
      ),
    )
  }

  function setEchoName(echoId: number, name: string) {
    setEchoes((prev) =>
      prev.map((e) =>
        e.id === echoId ? { ...e, name: name || `Echo ${e.id}` } : e,
      ),
    )
  }

  function setWeight(name: string, val: string) {
    const parsed = parseFloat(val)
    setCharWeights((prev) => ({ ...prev, [name]: isNaN(parsed) ? 0 : parsed }))
  }

  function loadPreset(key: string) {
    if (!key || !PRESETS[key]) return
    const preset = PRESETS[key]
    setCharWeights(() => {
      const w: Record<string, number> = {}
      for (const n of STAT_NAMES) w[n] = preset.weights[n] || 0
      return w
    })
  }

  const chartEntries = useMemo(() => {
    const entries = STAT_NAMES.map((n) => ({ name: n, val: charWeights[n] || 0 }))
      .filter((e) => e.val > 0)
      .sort((a, b) => b.val - a.val)
    const maxVal = Math.max(...entries.map((e) => e.val), 0.01)
    return { entries, maxVal }
  }, [charWeights])

  const scoredEchoes = useMemo(
    () =>
      echoes
        .map((e) => ({ echo: e, score: calcEchoScore(e, charWeights) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score),
    [echoes, charWeights],
  )

  return (
    <div className="page-wrap pt-8">
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <button className="btn btn-primary" onClick={addEcho}>
          + Add Echo
        </button>
        <select
          className="select w-auto text-sm"
          defaultValue=""
          onChange={(e) => loadPreset(e.target.value)}
        >
          <option value="">Presets</option>
          {Object.entries(PRESETS)
            .filter(([k]) => k !== '')
            .sort(([, a], [, b]) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }))
            .map(([k, p]) => (
              <option key={k} value={k}>
                {p.label}
              </option>
            ))}
        </select>
        <button
          className={`btn ${weightsOpen ? 'active' : ''}`}
          style={weightsOpen ? { background: 'var(--color-gold)', color: '#1e1e20', borderColor: 'var(--color-gold)', fontWeight: 600 } : undefined}
          onClick={() => setWeightsOpen((v) => !v)}
        >
          Substat Value
        </button>
        <button className="btn" onClick={resetAll}>
          Reset All
        </button>
        <span className="text-sm text-muted">{statusText}</span>
      </div>

      <div className="flex items-start gap-4">
        {weightsOpen && (
          <aside className="sticky top-[4.5rem] w-64 shrink-0 rounded-xl border border-border bg-surface p-3.5">
            <div className="mb-2 flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs uppercase tracking-wider text-muted">Substat Value</h3>
              <button
                className="text-muted hover:text-danger"
                onClick={() => setWeightsOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {STAT_NAMES.map((name) => (
                <div key={name} className="flex items-center gap-1">
                  <label className="min-w-[55px] shrink-0 text-xs text-muted">{getDisplay(name)}</label>
                  <input
                    type="number"
                    step="0.01"
                    id={`w-${name.replace(/\s+/g, '_')}`}
                    className="input ml-auto w-16 px-1 py-0.5 text-center text-xs"
                    value={charWeights[name] || ''}
                    onChange={(e) => setWeight(name, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return
                      e.preventDefault()
                      setWeight(name, (e.target as HTMLInputElement).value)
                      const idx = STAT_NAMES.indexOf(name)
                      const next = STAT_NAMES[idx + 1]
                      if (next) {
                        requestAnimationFrame(() => {
                          document.getElementById(`w-${next.replace(/\s+/g, '_')}`)?.focus()
                        })
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3.5 border-t border-white/5 pt-2.5">
              <h4 className="mb-2 text-xs uppercase tracking-wider text-muted">Value Distribution</h4>
              <div className="flex flex-col gap-1">
                {chartEntries.entries.map((entry) => {
                  const pct = (entry.val / chartEntries.maxVal) * 100
                  const color = getQualityColor((entry.val / chartEntries.maxVal) * 100)
                  const maxEntry = chartEntries.entries[0]?.val ?? 0.01
                  const colorForBar = getQualityColor((entry.val / Math.max(maxEntry, 0.01)) * 100)
                  return (
                    <div key={entry.name} className="flex h-4 items-center gap-2">
                      <span className="w-[60px] shrink-0 text-right text-xs text-muted">{getDisplay(entry.name)}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded bg-white/5">
                        <div
                          className="h-full rounded"
                          style={{ width: `${pct}%`, background: colorForBar, transition: 'width .4s', minWidth: 2 }}
                        />
                      </div>
                      <span
                        className="w-12 shrink-0 text-right text-xs tabular-nums"
                        style={color ? { color } : undefined}
                      >
                        {entry.val.toFixed(2)}
                      </span>
                    </div>
                  )
                })}
                {chartEntries.entries.length === 0 && (
                  <p className="text-xs text-faint">No weights set yet.</p>
                )}
              </div>
            </div>
          </aside>
        )}

        <div className="grid min-w-0 flex-1 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {echoes.map((echo) => (
            <EchoCard
              key={echo.id}
              echo={echo}
              isBest={bestId === echo.id && calcEchoScore(echo, charWeights) > 0}
              hasWeights={hasWeights}
              charWeights={charWeights}
              onRemove={() => removeEcho(echo.id)}
              onReset={() => resetEcho(echo.id)}
              onNameChange={(n) => setEchoName(echo.id, n)}
              onSetSubstat={(i, s) => setSubstat(echo.id, i, s)}
              onSetValue={(i, v) => setValue(echo.id, i, v)}
            />
          ))}
        </div>
      </div>

      {scoredEchoes.length > 1 && (
        <section className="card mt-5">
          <h3 className="card-title">Ranking</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {['#', 'Echo', 'Value', 'Substats', 'Best Roll', 'Worst Roll'].map((h) => (
                    <th
                      key={h}
                      className="border-b border-white/5 px-2 py-1.5 text-left font-medium text-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scoredEchoes.map(({ echo, score }, rank) => {
                  const filled = echo.slots.filter((s) => s.statName && s.valueIndex >= 0)
                  let bestQ = -1
                  let worstQ = Infinity
                  let bestName = ''
                  let worstName = ''
                  for (const slot of filled) {
                    const q = calcQuality(slot.statName as string, slot.valueIndex)
                    if (q > bestQ) {
                      bestQ = q
                      bestName = slot.statName as string
                    }
                    if (q < worstQ) {
                      worstQ = q
                      worstName = slot.statName as string
                    }
                  }
                  const isBest = rank === 0
                  return (
                    <tr key={echo.id} className={`border-b border-white/5 ${isBest ? 'bg-gold/5' : ''}`}>
                      <td className="px-2 py-1.5">{rank + 1}</td>
                      <td className="px-2 py-1.5">{echo.name}</td>
                      <td className="px-2 py-1.5 font-semibold text-gold">{score.toFixed(2)}%</td>
                      <td className="px-2 py-1.5">
                        {filled.length}/{echo.slots.length}
                      </td>
                      <td className="px-2 py-1.5">
                        {bestQ >= 0 ? `${bestName} (${Math.round(bestQ)}%)` : '-'}
                      </td>
                      <td className="px-2 py-1.5">
                        {worstQ < Infinity ? `${worstName} (${Math.round(worstQ)}%)` : '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

function EchoCard({
  echo,
  isBest,
  hasWeights,
  charWeights,
  onRemove,
  onReset,
  onNameChange,
  onSetSubstat,
  onSetValue,
}: {
  echo: Echo
  isBest: boolean
  hasWeights: boolean
  charWeights: Record<string, number>
  onRemove: () => void
  onReset: () => void
  onNameChange: (name: string) => void
  onSetSubstat: (slotIdx: number, statName: string) => void
  onSetValue: (slotIdx: number, valueIndex: number) => void
}) {
  const score = calcEchoScore(echo, charWeights)
  const used = usedStatNames(echo)

  const contributions = echo.slots
    .filter((s) => s.statName && s.valueIndex >= 0)
    .map((s) => {
      const def = SUBSTATS[s.statName as string]
      const weight = charWeights[s.statName as string] || 1
      const contrib = weight * (def.values[s.valueIndex] / def.median)
      return { name: s.statName as string, value: Math.round(contrib * 100) / 100 }
    })
  const maxContrib = Math.max(...contributions.map((c) => c.value), 0.01)

  return (
    <div
      className={`card flex flex-col ${isBest ? 'border-gold shadow-[0_0_20px_rgba(201,165,60,0.15)]' : ''}`}
    >
      <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2">
          {isBest && <span className="text-lg text-gold">👑</span>}
          <input
            className="w-full border-b border-transparent bg-transparent text-[0.95rem] font-semibold text-text outline-none transition-colors focus:border-gold"
            value={echo.name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={(e) => {
              if (!e.target.value.trim()) onNameChange(`Echo ${echo.id}`)
            }}
            aria-label="Echo name"
          />
          <span className="chip border-gold/25 bg-gold/10 text-gold">
            {echo.slots.filter((s) => s.statName).length}/{echo.slots.length}
          </span>
        </div>
        <button className="btn-icon text-muted hover:bg-danger/10 hover:text-danger" onClick={onRemove} title="Remove echo">
          ×
        </button>
      </div>

      {echo.slots.map((slot, i) => (
        <div
          key={i}
          className={`mb-2.5 rounded-lg border bg-white/[0.02] p-2.5 transition-colors ${
            slot.statName ? 'border-gold/15' : 'border-white/5'
          }`}
        >
          <div className="mb-1.5 flex items-center gap-1.5">
            <select
              className="select flex-1 py-1 text-sm"
              value={slot.statName ?? ''}
              onChange={(e) => onSetSubstat(i, e.target.value)}
            >
              <option value="">-- Select substat --</option>
              {STAT_NAMES.filter((name) => {
                if (name === slot.statName) return true
                if (used.includes(name)) return false
                if (hasWeights && charWeights[name] <= 0) return false
                return true
              }).map((name) => (
                <option key={name} value={name}>
                  {getDisplay(name)}
                </option>
              ))}
            </select>
            {slot.statName && (
              <button className="btn btn-sm btn-danger" onClick={() => onSetSubstat(i, '')} title="Clear">
                ×
              </button>
            )}
          </div>

          {slot.statName && (() => {
            const def = SUBSTATS[slot.statName]
            const medianIdx = findClosestValueIndex(slot.statName, def.median)
            const quality = calcQuality(slot.statName, slot.valueIndex)
            const tierLabel = getTierLabel(slot.statName, slot.valueIndex)
            const tierColor = getTierColor(tierLabel)
            const qColor = getQualityColor(quality)
            return (
              <>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {def.values.map((val, vi) => {
                    const isMedian = vi === medianIdx
                    const isSelected = vi === slot.valueIndex
                    const chance = def.chance?.[vi] ? `${def.chance[vi].toFixed(2)}%` : ''
                    return (
                      <button
                        key={vi}
                        className={`relative rounded border px-2.5 py-1 text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-gold bg-gold font-bold text-bg shadow-[0_0_8px_rgba(201,165,60,0.3)]'
                            : isMedian
                              ? 'border-gold/30 text-gold-dim hover:border-white/30 hover:bg-white/5'
                              : 'border-white/10 bg-black/30 text-muted hover:border-white/30 hover:text-text'
                        }`}
                        style={isSelected && isMedian ? { background: 'var(--color-gold)', color: '#1e1e20' } : undefined}
                        onClick={() => onSetValue(i, vi)}
                        title={`Roll chance: ${chance}`}
                      >
                        {def.format(val)}
                        {isMedian && (
                          <span className="absolute -right-1.5 -top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-gold text-[0.5rem] font-bold text-bg">
                            M
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span style={{ color: tierColor }}>{tierLabel}</span>
                  <div className="h-1 flex-1 overflow-hidden rounded bg-white/5">
                    <div
                      className="h-full rounded transition-all"
                      style={{ width: `${quality}%`, background: qColor }}
                    />
                  </div>
                  <span className="min-w-[36px] text-right font-semibold" style={{ color: qColor }}>
                    {Math.round(quality)}%
                  </span>
                </div>
              </>
            )
          })()}
        </div>
      ))}

      {score > 0 && contributions.length > 0 && (
        <div className="mt-1 border-t border-white/5 pt-2">
          <div className="mb-1.5 text-xs uppercase tracking-wider text-muted">Value Breakdown</div>
          {contributions.map((c) => (
            <div key={c.name} className="flex items-center gap-2 py-0.5">
              <span className="min-w-[60px] shrink-0 text-xs text-text">{getDisplay(c.name)}</span>
              <div className="h-[5px] flex-1 overflow-hidden rounded bg-white/5">
                <div
                  className="h-full rounded bg-gold opacity-70 transition-all"
                  style={{ width: `${(c.value / maxContrib) * 100}%` }}
                />
              </div>
              <span className="min-w-[44px] text-right text-xs font-semibold tabular-nums text-gold">
                {c.value.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xs uppercase tracking-wider text-muted">Echo Value</span>
          <span
            className="text-2xl font-bold leading-none"
            style={{ color: score > 0 ? 'var(--color-gold)' : 'var(--color-faint)' }}
          >
            {score.toFixed(2)}%
          </span>
        </div>
        <button className="btn btn-sm" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  )
}
