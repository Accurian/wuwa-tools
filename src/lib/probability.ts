export interface ProbSubstat {
  id: string
  name: string
  color: string
  values: number[]
  probs: number[]
}

const SV = [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6]
const SP = [6.7961, 7.767, 20.3883, 24.2718, 17.4757, 14.5631, 5.8252, 2.9126]

const DEF: { id: string; name: string; color: string }[] = [
  { id: 'critRate', name: 'Crit Rate', color: 'crit' },
  { id: 'critDmg', name: 'Crit Damage', color: 'critdmg' },
  { id: 'atk', name: 'ATK%', color: 'atk' },
  { id: 'basicAtkDmg', name: 'Basic', color: 'basic' },
  { id: 'heavyAtkDmg', name: 'Heavy', color: 'heavy' },
  { id: 'skillDmg', name: 'Skill', color: 'skill' },
  { id: 'liberationDmg', name: 'Liberation', color: 'liberation' },
  { id: 'energyRegen', name: 'Energy Regen', color: 'regen' },
  { id: 'hp', name: 'HP%', color: 'hp' },
  { id: 'def', name: 'DEF%', color: 'def' },
  { id: 'fixedAtk', name: 'Flat ATK', color: 'fixed' },
  { id: 'fixedHp', name: 'Flat HP', color: 'fixed' },
  { id: 'fixedDef', name: 'Flat DEF', color: 'fixed' },
]

const VALUES_BY_ID: Record<string, { values: number[]; probs: number[] }> = {
  fixedHp: { values: [320, 360, 390, 430, 470, 510, 540, 580], probs: SP },
  fixedAtk: { values: [30, 40, 50, 60], probs: [6.7961, 52.4272, 37.8641, 2.9126] },
  fixedDef: { values: [40, 50, 60, 70], probs: [14.5631, 44.6602, 32.0388, 8.7379] },
  critRate: { values: [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5], probs: [23.3333, 23.3333, 23.3333, 8, 8, 8, 3, 3] },
  critDmg: { values: [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21], probs: [23.3333, 23.3333, 23.3333, 8, 8, 8, 3, 3] },
  def: { values: [8.1, 9, 10, 10.9, 11.8, 12.8, 13.8, 14.7], probs: SP },
  energyRegen: { values: [6.8, 7.6, 8.4, 9.2, 10, 10.8, 11.6, 12.4], probs: SP },
  fallback: { values: SV, probs: SP },
}

export const PROB_SUBSTATS: ProbSubstat[] = DEF.map((d) => {
  const data = VALUES_BY_ID[d.id] ?? VALUES_BY_ID.fallback
  return { id: d.id, name: d.name, color: d.color, values: data.values, probs: data.probs }
})

export const POOL = 13
/** Maximum substats an Echo can reveal (at +5/+10/+15/+20/+25). */
export const SLOTS = 5
export const MIN_ROLLS = 1

export interface ValueRange {
  min: number
  max: number
}

export interface ProbResult {
  prob: number
  basicProb: number
  valueFactor: number
  wantIds: string[]
  /** Number of rolls (revealed substats) this result was computed for. */
  rolls: number
  indiv: Record<string, { indivProb: number; valueProb: number; range?: ValueRange }>
  impossible: boolean
}

export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0
  if (r === 0 || r === n) return 1
  r = Math.min(r, n - r)
  let res = 1
  for (let i = 1; i <= r; i++) res = (res * (n - r + i)) / i
  return res
}

/**
 * Probability that every desired substat shows up within `rolls` revealed substats.
 *
 * Each reveal pulls a distinct stat from a pool of `POOL`, so the revealed set is a
 * uniform `rolls`-subset of the pool. The chance a fixed set of `k` desired stats are
 * all contained in that subset is `C(rolls, k) / C(POOL, k)` (which equals the classic
 * `C(POOL-k, rolls-k) / C(POOL, rolls)` when `rolls === POOL`'s echo cap). Rolling fewer
 * substats simply tightens the odds.
 */
export function calcProbability(
  selected: Record<string, boolean>,
  valueRanges: Record<string, ValueRange>,
  rolls: number = SLOTS,
): ProbResult | null {
  const wantIds = Object.keys(selected).filter((k) => selected[k])
  const k = wantIds.length
  if (k === 0) return null

  const n = Math.max(MIN_ROLLS, Math.min(SLOTS, Math.floor(rolls) || SLOTS))

  if (k > n) {
    return {
      prob: 0,
      basicProb: 0,
      valueFactor: 0,
      wantIds,
      rolls: n,
      indiv: {},
      impossible: true,
    }
  }

  const basicProb = nCr(n, k) / nCr(POOL, k)
  let valueFactor = 1
  const indiv: ProbResult['indiv'] = {}

  for (const id of wantIds) {
    const s = PROB_SUBSTATS.find((x) => x.id === id)
    if (!s || !s.values) {
      indiv[id] = { indivProb: n / POOL, valueProb: 1 }
      continue
    }
    const r = valueRanges[id] || { min: 0, max: s.values.length - 1 }
    let sum = 0
    for (let i = r.min; i <= r.max; i++) sum += s.probs[i]
    const vp = sum / 100
    indiv[id] = { indivProb: n / POOL, valueProb: vp, range: r }
    valueFactor *= vp
  }

  return {
    prob: basicProb * valueFactor,
    basicProb,
    valueFactor,
    wantIds,
    rolls: n,
    indiv,
    impossible: false,
  }
}

export function formatPct(v: number): string {
  if (v === 0) return '0%'
  if (v < 0.0001) return '<0.0001%'
  if (v < 0.001) return `${(v * 100).toFixed(4)}%`
  if (v < 0.01) return `${(v * 100).toFixed(3)}%`
  if (v < 0.1) return `${(v * 100).toFixed(3)}%`
  if (v < 1) return `${(v * 100).toFixed(2)}%`
  return `${(v * 100).toFixed(2)}%`
}

export function format1inX(v: number): string {
  if (v === 0) return '\u221e'
  const x = 1 / v
  if (x >= 1000000) return `1 in ${(x / 1000000).toFixed(1)}M`
  if (x >= 1000) return `1 in ${Math.round(x).toLocaleString()}`
  if (x >= 100) return `1 in ${x.toFixed(1)}`
  if (x >= 10) return `1 in ${x.toFixed(1)}`
  return `1 in ${x.toFixed(2)}`
}

export function pctClass(v: number): string {
  if (v === 0) return 'extreme'
  if (v >= 0.5) return 'high'
  if (v >= 0.2) return 'mid'
  if (v >= 0.05) return 'low'
  if (v >= 0.01) return 'rare'
  return 'extreme'
}

export function substatById(id: string): ProbSubstat | undefined {
  return PROB_SUBSTATS.find((x) => x.id === id)
}

export function valueLabel(substat: ProbSubstat, value: number): string {
  const isFixed = substat.id.includes('fixed')
  return `${value % 1 === 0 ? value.toString() : value.toFixed(1)}${isFixed ? '' : '%'}`
}
