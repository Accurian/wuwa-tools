export interface Resources {
  xp: number
  tuners: number
  sc: number
}

export interface Checkpoint {
  xp: number
  tuners: number
  sc: number
  label: string
  substats: string
  /** index of next checkpoint, or -1 if maxed */
  next: number
}

// Tuner counts are cumulative and assume 10 Tuners per tune
// (5 tunes at +5/+10/+15/+20/+25 = 50 Tuners to max an Echo).
export const CHECKPOINTS: Checkpoint[] = [
  { xp: 4400, tuners: 10, sc: 2440, label: '+5', substats: '1 substat', next: -1 },
  { xp: 16500, tuners: 20, sc: 5650, label: '+10', substats: '2 substats', next: -1 },
  { xp: 39600, tuners: 30, sc: 9960, label: '+15', substats: '3 substats', next: 1 },
  { xp: 79100, tuners: 40, sc: 15910, label: '+20', substats: '4 substats', next: 2 },
  { xp: 142600, tuners: 50, sc: 24260, label: '+25', substats: '5 substats', next: 3 },
]

export const TUBE_XP = {
  basic: 500,
  medium: 1000,
  advanced: 2000,
  premium: 5000,
} as const

export interface TubeInputs {
  basic: number
  medium: number
  advanced: number
  premium: number
}

export function totalXp(tubes: TubeInputs): number {
  return tubes.basic * TUBE_XP.basic + tubes.medium * TUBE_XP.medium + tubes.advanced * TUBE_XP.advanced + tubes.premium * TUBE_XP.premium
}

export function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return String(n)
}

export function fmtRatio(n: number): string {
  if (n >= 10000) return `${Math.round(n / 1000)}k`
  return Math.round(n).toLocaleString()
}

export interface BalanceText {
  text: string
  cls: 'red' | 'yellow' | 'green'
}

export function getBalanceText(ratio: number, checkpointRatio: number): BalanceText {
  const pct = ratio / checkpointRatio
  if (pct > 2) return { text: 'Tuner-starved', cls: 'red' }
  if (pct > 1.3) return { text: 'Tuner-low', cls: 'yellow' }
  if (pct > 0.7) return { text: 'Balanced', cls: 'green' }
  if (pct > 0.3) return { text: 'XP-low', cls: 'yellow' }
  return { text: 'XP-starved', cls: 'red' }
}

export function getBalanceIndicator(ratio: number, checkpointRatio: number): number {
  const pct = ratio / checkpointRatio
  let pos = 50
  if (pct > 2) pos = 92
  else if (pct > 1.3) pos = 65 + ((pct - 1.3) / 0.7) * 27
  else if (pct > 0.7) pos = 35 + ((pct - 0.7) / 0.6) * 30
  else if (pct > 0.3) pos = 8 + ((pct - 0.3) / 0.4) * 27
  else pos = 8
  return pos
}
