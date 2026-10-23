export interface SubstatDef {
  /** Canonical stat key, e.g. "Crit. DMG". */
  key: string
  /** Short display label, e.g. "Crit DMG". */
  display: string
  /** Possible roll values. */
  values: number[]
  /** Median roll value used for normalisation. */
  median: number
  /** Formats a raw value (adds trailing % for percent stats). */
  format: (v: number) => string
  /** Per-roll probability percentages, aligned to `values`. */
  chance: number[]
  /** Tier labels for each roll index. */
  tierLabels: string[]
}

export const SUBSTATS: Record<string, SubstatDef> = {
  ATK: {
    key: 'ATK',
    display: 'Flat ATK',
    values: [30, 40, 50, 60],
    median: 50,
    format: (v) => String(v),
    chance: [9.36, 50.06, 37.83, 2.75],
    tierLabels: ['Low', 'Mid', 'High', 'Max'],
  },
  HP: {
    key: 'HP',
    display: 'Flat HP',
    values: [320, 360, 390, 430, 470, 510, 540, 580],
    median: 450,
    format: (v) => String(v),
    chance: [7.23, 7.55, 19.73, 25.05, 17.81, 14.92, 6.17, 2.84],
    tierLabels: ['Very Low', 'Low', 'Below Avg', 'Average', 'Above Avg', 'High', 'Very High', 'Max'],
  },
  DEF: {
    key: 'DEF',
    display: 'Flat DEF',
    values: [40, 50, 60, 70],
    median: 50,
    format: (v) => String(v),
    chance: [9.36, 50.06, 37.83, 2.75],
    tierLabels: ['Low', 'Mid', 'High', 'Max'],
  },
  'ATK%': {
    key: 'ATK%',
    display: 'ATK%',
    values: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
    median: 9.0,
    format: (v) => v + '%',
    chance: [7.23, 7.55, 19.73, 25.05, 17.81, 14.92, 6.17, 2.84],
    tierLabels: ['Very Low', 'Low', 'Below Avg', 'Average', 'Above Avg', 'High', 'Very High', 'Max'],
  },
  'HP%': {
    key: 'HP%',
    display: 'HP%',
    values: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
    median: 9.0,
    format: (v) => v + '%',
    chance: [7.23, 7.55, 19.73, 25.05, 17.81, 14.92, 6.17, 2.84],
    tierLabels: ['Very Low', 'Low', 'Below Avg', 'Average', 'Above Avg', 'High', 'Very High', 'Max'],
  },
  'DEF%': {
    key: 'DEF%',
    display: 'DEF%',
    values: [8.1, 9.0, 10.0, 10.9, 11.8, 12.8, 13.8, 14.7],
    median: 11.39,
    format: (v) => v + '%',
    chance: [7.23, 7.55, 19.73, 25.05, 17.81, 14.92, 6.17, 2.84],
    tierLabels: ['Very Low', 'Low', 'Below Avg', 'Average', 'Above Avg', 'High', 'Very High', 'Max'],
  },
  'Energy Regen': {
    key: 'Energy Regen',
    display: 'ER',
    values: [6.8, 7.6, 8.4, 9.2, 10.0, 10.8, 11.6, 12.4],
    median: 10.25,
    format: (v) => v + '%',
    chance: [7.23, 7.55, 19.73, 25.05, 17.81, 14.92, 6.17, 2.84],
    tierLabels: ['Very Low', 'Low', 'Below Avg', 'Average', 'Above Avg', 'High', 'Very High', 'Max'],
  },
  'Crit. Rate': {
    key: 'Crit. Rate',
    display: 'Crit Rate',
    values: [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5],
    median: 8.4,
    format: (v) => v + '%',
    chance: [22.58, 22.05, 23.97, 9.02, 7.24, 7.72, 3.74, 3.69],
    tierLabels: ['Very Low', 'Low', 'Below Avg', 'Average', 'Above Avg', 'High', 'Very High', 'Max'],
  },
  'Crit. DMG': {
    key: 'Crit. DMG',
    display: 'Crit DMG',
    values: [12.6, 13.8, 15.0, 16.2, 17.4, 18.6, 19.8, 21.0],
    median: 16.8,
    format: (v) => v + '%',
    chance: [22.58, 22.05, 23.97, 9.02, 7.24, 7.72, 3.74, 3.69],
    tierLabels: ['Very Low', 'Low', 'Below Avg', 'Average', 'Above Avg', 'High', 'Very High', 'Max'],
  },
  'Basic ATK DMG Bonus': {
    key: 'Basic ATK DMG Bonus',
    display: 'Basic',
    values: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
    median: 9.0,
    format: (v) => v + '%',
    chance: [7.23, 7.55, 19.73, 25.05, 17.81, 14.92, 6.17, 2.84],
    tierLabels: ['Very Low', 'Low', 'Below Avg', 'Average', 'Above Avg', 'High', 'Very High', 'Max'],
  },
  'Heavy ATK DMG Bonus': {
    key: 'Heavy ATK DMG Bonus',
    display: 'Heavy',
    values: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
    median: 9.0,
    format: (v) => v + '%',
    chance: [7.23, 7.55, 19.73, 25.05, 17.81, 14.92, 6.17, 2.84],
    tierLabels: ['Very Low', 'Low', 'Below Avg', 'Average', 'Above Avg', 'High', 'Very High', 'Max'],
  },
  'Res. Skill DMG Bonus': {
    key: 'Res. Skill DMG Bonus',
    display: 'Res Skill',
    values: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
    median: 9.0,
    format: (v) => v + '%',
    chance: [7.23, 7.55, 19.73, 25.05, 17.81, 14.92, 6.17, 2.84],
    tierLabels: ['Very Low', 'Low', 'Below Avg', 'Average', 'Above Avg', 'High', 'Very High', 'Max'],
  },
  'Res. Liberation DMG Bonus': {
    key: 'Res. Liberation DMG Bonus',
    display: 'Res Lib',
    values: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
    median: 9.0,
    format: (v) => v + '%',
    chance: [7.23, 7.55, 19.73, 25.05, 17.81, 14.92, 6.17, 2.84],
    tierLabels: ['Very Low', 'Low', 'Below Avg', 'Average', 'Above Avg', 'High', 'Very High', 'Max'],
  },
}

/** Order + display for the weighted scoring stat list. */
export const STAT_CONFIG: { key: string; display: string }[] = [
  { key: 'Crit. DMG', display: 'Crit DMG' },
  { key: 'Crit. Rate', display: 'Crit Rate' },
  { key: 'ATK%', display: 'ATK%' },
  { key: 'ATK', display: 'Flat ATK' },
  { key: 'Energy Regen', display: 'ER' },
  { key: 'Basic ATK DMG Bonus', display: 'Basic' },
  { key: 'Heavy ATK DMG Bonus', display: 'Heavy' },
  { key: 'Res. Skill DMG Bonus', display: 'Res Skill' },
  { key: 'Res. Liberation DMG Bonus', display: 'Res Lib' },
  { key: 'DEF%', display: 'DEF%' },
  { key: 'DEF', display: 'Flat DEF' },
  { key: 'HP%', display: 'HP%' },
  { key: 'HP', display: 'Flat HP' },
]

export const STAT_NAMES = STAT_CONFIG.map((c) => c.key)

const DISPLAY_MAP: Record<string, string> = {}
for (const c of STAT_CONFIG) DISPLAY_MAP[c.key] = c.display

export function getDisplay(key: string): string {
  return DISPLAY_MAP[key] || key
}

export function isPercentStat(key: string): boolean {
  return key !== 'ATK' && key !== 'HP' && key !== 'DEF'
}

export function findClosestValueIndex(substatName: string, inputValue: number): number {
  const s = SUBSTATS[substatName]
  if (!s) return -1
  let bestIdx = 0
  let bestDiff = Infinity
  for (let i = 0; i < s.values.length; i++) {
    const diff = Math.abs(s.values[i] - inputValue)
    if (diff < bestDiff) {
      bestDiff = diff
      bestIdx = i
    }
  }
  return bestIdx
}

export function calcQuality(substatName: string, valueIndex: number): number {
  const s = SUBSTATS[substatName]
  if (!s || valueIndex < 0) return 0
  const maxIdx = s.values.length - 1
  return maxIdx > 0 ? (valueIndex / maxIdx) * 100 : 0
}

export function getQualityColor(pct: number): string {
  if (pct >= 85) return '#22c55e'
  if (pct >= 65) return '#4fc3c4'
  if (pct >= 40) return '#eab308'
  if (pct >= 20) return '#f59e0b'
  return '#ef4444'
}

export function getTierLabel(substatName: string, valueIndex: number): string {
  const s = SUBSTATS[substatName]
  if (!s || valueIndex < 0) return ''
  const labels = s.tierLabels
  if (valueIndex < labels.length) return labels[valueIndex]
  return ''
}

export function getTierColor(label: string): string {
  const map: Record<string, string> = {
    Low: '#ef4444',
    'Very Low': '#ef4444',
    'Below Avg': '#f59e0b',
    Mid: '#eab308',
    Average: '#eab308',
    'Above Avg': '#4fc3c4',
    High: '#4fc3c4',
    'Very High': '#22c55e',
    Max: '#22c55e',
  }
  return map[label] || '#8892a0'
}

export interface Preset {
  label: string
  weights: Record<string, number>
}

export const PRESETS: Record<string, Preset> = {
  '': { label: 'Custom (no preset)', weights: {} },
  suisui: {
    label: 'Suisui',
    weights: { 'Crit. DMG': 2.39, 'Crit. Rate': 1.41, 'Basic ATK DMG Bonus': 1.1, 'Res. Skill DMG Bonus': 0.29, HP: 0.42, 'HP%': 1.33, 'ATK%': 0.63, ATK: 0.45 },
  },
  xuanling: {
    label: 'Xuanling',
    weights: { 'Crit. DMG': 4.07, 'Crit. Rate': 5.09, 'ATK%': 2.4, ATK: 1.17, 'Basic ATK DMG Bonus': 0.09, 'Heavy ATK DMG Bonus': 2.48 },
  },
  qingxiao: {
    label: 'Qingxiao',
    weights: { 'Crit. DMG': 5.77, 'Crit. Rate': 5.26, 'ATK%': 2.54, ATK: 1.29, 'Basic ATK DMG Bonus': 0.46, 'Res. Skill DMG Bonus': 0.06, 'Res. Liberation DMG Bonus': 0.56, 'Heavy ATK DMG Bonus': 0.67 },
  },
  jingran: {
    label: 'Jingran',
    weights: { 'Crit. DMG': 6.39, 'Crit. Rate': 7.29, 'ATK%': 1.56, ATK: 1.07, 'Basic ATK DMG Bonus': 0.02, 'Res. Skill DMG Bonus': 0.1, 'Res. Liberation DMG Bonus': 0.04, 'Heavy ATK DMG Bonus': 1.82, HP: 0.02, 'HP%': 0.66, 'Energy Regen': 0.04 },
  },
  lucilla: {
    label: 'Lucilla',
    weights: { 'Crit. DMG': 4.97, 'Crit. Rate': 4.58, 'ATK%': 2.41, ATK: 1.23, 'Basic ATK DMG Bonus': 1.96, 'Res. Skill DMG Bonus': 0.42 },
  },
  hiyuki: {
    label: 'Hiyuki',
    weights: { 'Crit. DMG': 4.79, 'Crit. Rate': 4.42, 'ATK%': 2.38, ATK: 1.11, 'Basic ATK DMG Bonus': 0.03, 'Res. Skill DMG Bonus': 0.11, 'Res. Liberation DMG Bonus': 2.08 },
  },
  'hsin-unison': {
    label: 'Hsin (Unison)',
    weights: { 'Crit. DMG': 6.2, 'Crit. Rate': 5.06, 'ATK%': 2.51, ATK: 1.16, 'Res. Skill DMG Bonus': 2.26, 'Res. Liberation DMG Bonus': 0.04, 'Basic ATK DMG Bonus': 0.16 },
  },
  'hsin-flare': {
    label: 'Hsin (Flare)',
    weights: { 'Crit. DMG': 5.91, 'Crit. Rate': 5.05, 'ATK%': 2.3, ATK: 1.07, 'Res. Skill DMG Bonus': 1.67, 'Res. Liberation DMG Bonus': 0.03, 'Basic ATK DMG Bonus': 0.22 },
  },
  buling: {
    label: 'Buling',
    weights: { 'Crit. DMG': 2.27, 'Crit. Rate': 1.77, 'ATK%': 1.28, ATK: 0.9, 'Basic ATK DMG Bonus': 0.46, 'Res. Skill DMG Bonus': 0.16, 'Res. Liberation DMG Bonus': 1.17, 'Heavy ATK DMG Bonus': 0.12 },
  },
  jinhsi: {
    label: 'Jinhsi',
    weights: { 'Crit. DMG': 3.57, 'Crit. Rate': 5.67, 'ATK%': 3.11, ATK: 1.54, 'Basic ATK DMG Bonus': 0.17, 'Res. Skill DMG Bonus': 2.05, 'Res. Liberation DMG Bonus': 0.46, 'Heavy ATK DMG Bonus': 0.04 },
  },
  'aemeath-rupture': {
    label: 'Aemeath (Rupture)',
    weights: { 'Crit. DMG': 4.87, 'Crit. Rate': 4.45, 'ATK%': 2.01, ATK: 1.0, 'Basic ATK DMG Bonus': 0.2, 'Res. Skill DMG Bonus': 0.06, 'Res. Liberation DMG Bonus': 1.62 },
  },
  'aemeath-fusion': {
    label: 'Aemeath (Fusion Burst)',
    weights: { 'Crit. DMG': 4.48, 'Crit. Rate': 4.43, 'ATK%': 2.31, ATK: 1.12, 'Basic ATK DMG Bonus': 0.26, 'Res. Liberation DMG Bonus': 1.88 },
  },
  lucy: {
    label: 'Lucy',
    weights: { 'Crit. DMG': 4.88, 'Crit. Rate': 5.77, 'ATK%': 2.38, ATK: 1.15, 'Basic ATK DMG Bonus': 0.05, 'Res. Skill DMG Bonus': 0.12, 'Heavy ATK DMG Bonus': 1.93 },
  },
  rebecca: {
    label: 'Rebecca',
    weights: { 'Crit. DMG': 3.8, 'Crit. Rate': 5.48, 'ATK%': 2.05, ATK: 1.12, 'Basic ATK DMG Bonus': 1.78, 'Res. Skill DMG Bonus': 0.16 },
  },
  denia: {
    label: 'Denia',
    weights: { 'Crit. DMG': 5.64, 'Crit. Rate': 5.37, 'ATK%': 2.74, ATK: 1.42, 'Basic ATK DMG Bonus': 0.16, 'Res. Liberation DMG Bonus': 2.61, 'Res. Skill DMG Bonus': 0.01 },
  },
  sigrika: {
    label: 'Sigrika',
    weights: { 'Crit. DMG': 4.57, 'Crit. Rate': 5.42, 'ATK%': 2.46, ATK: 1.17, 'Basic ATK DMG Bonus': 0.14, 'Res. Skill DMG Bonus': 0.03, 'Energy Regen': 2.23 },
  },
  luuk: {
    label: 'Luuk',
    weights: { 'Crit. DMG': 5.71, 'Crit. Rate': 6.13, 'ATK%': 2.73, ATK: 1.31, 'Basic ATK DMG Bonus': 2.21 },
  },
  lynae: {
    label: 'Lynae',
    weights: { 'Crit. DMG': 4.1, 'Crit. Rate': 4.04, 'ATK%': 2.11, ATK: 1.08, 'Basic ATK DMG Bonus': 1.31, 'Res. Skill DMG Bonus': 0.15, 'Res. Liberation DMG Bonus': 0.49 },
  },
  mornye: {
    label: 'Mornye',
    weights: { 'Crit. DMG': 3.79, 'Crit. Rate': 1.75, 'ATK%': 1.4, ATK: 0.9, 'DEF%': 2.78, DEF: 1.16, 'Basic ATK DMG Bonus': 0.33, 'Res. Skill DMG Bonus': 0.2, 'Res. Liberation DMG Bonus': 3.88, 'Heavy ATK DMG Bonus': 0.32, 'Energy Regen': 3.52 },
  },
  chisa: {
    label: 'Chisa',
    weights: { 'Crit. DMG': 5.24, 'Crit. Rate': 5.06, 'ATK%': 3.44, ATK: 1.86, 'Basic ATK DMG Bonus': 0.08, 'Res. Skill DMG Bonus': 0.14, 'Res. Liberation DMG Bonus': 2.34 },
  },
  qiuyuan: {
    label: 'Qiuyuan',
    weights: { 'Crit. DMG': 6.91, 'Crit. Rate': 6.42, 'ATK%': 3.62, ATK: 1.9, 'Heavy ATK DMG Bonus': 1.93 },
  },
  phrolova: {
    label: 'Phrolova',
    weights: { 'Crit. DMG': 5.02, 'Crit. Rate': 5.1, 'ATK%': 2.64, ATK: 1.25, 'Basic ATK DMG Bonus': 0.15, 'Res. Skill DMG Bonus': 1.45 },
  },
  galbrena: {
    label: 'Galbrena',
    weights: { 'Crit. DMG': 4.93, 'Crit. Rate': 5.7, 'ATK%': 2.45, ATK: 1.18, 'Heavy ATK DMG Bonus': 2.45 },
  },
  'iuno-mdps': {
    label: 'Iuno (Main DPS)',
    weights: { 'Crit. DMG': 4.41, 'Crit. Rate': 6.23, 'ATK%': 3.04, ATK: 1.62, 'Basic ATK DMG Bonus': 0.17, 'Res. Skill DMG Bonus': 0.55, 'Res. Liberation DMG Bonus': 2.3 },
  },
  carlotta: {
    label: 'Carlotta',
    weights: { 'Crit. DMG': 4.36, 'Crit. Rate': 6.43, 'ATK%': 2.93, ATK: 1.54, 'Basic ATK DMG Bonus': 0.03, 'Res. Skill DMG Bonus': 2.1 },
  },
  camellya: {
    label: 'Camellya',
    weights: { 'Crit. DMG': 6.14, 'Crit. Rate': 4.47, 'ATK%': 2.78, ATK: 1.36, 'Basic ATK DMG Bonus': 1.84, 'Res. Liberation DMG Bonus': 0.36 },
  },
  zani: {
    label: 'Zani',
    weights: { 'Crit. DMG': 4.04, 'Crit. Rate': 6.95, 'ATK%': 3.23, ATK: 1.59, 'Basic ATK DMG Bonus': 0.08, 'Res. Skill DMG Bonus': 0.22, 'Res. Liberation DMG Bonus': 0.42, 'Heavy ATK DMG Bonus': 2.47 },
  },
  xly: {
    label: 'XLY',
    weights: { 'Crit. DMG': 6.09, 'Crit. Rate': 4.51, 'ATK%': 3.1, ATK: 1.55, 'Basic ATK DMG Bonus': 0.23, 'Res. Skill DMG Bonus': 0.48, 'Res. Liberation DMG Bonus': 1.67 },
  },
  ciaconna: {
    label: 'Ciaconna',
    weights: { 'Crit. DMG': 3.47, 'Crit. Rate': 5.49, 'ATK%': 3.14, ATK: 1.82, 'Basic ATK DMG Bonus': 0.99, 'Res. Skill DMG Bonus': 0.17, 'Res. Liberation DMG Bonus': 1.31, 'Heavy ATK DMG Bonus': 0.74 },
  },
  cartethiya: {
    label: 'Cartethiya',
    weights: { 'Crit. DMG': 1.51, 'Crit. Rate': 5.2, 'ATK%': 0.07, ATK: 0.05, 'HP%': 2.42, HP: 0.89, 'Basic ATK DMG Bonus': 1.7, 'Res. Skill DMG Bonus': 0.34, 'Res. Liberation DMG Bonus': 0.84 },
  },
  augusta: {
    label: 'Augusta',
    weights: { 'Crit. DMG': 6.69, 'Crit. Rate': 5.63, 'ATK%': 2.72, ATK: 1.16, 'Res. Skill DMG Bonus': 0.4, 'Heavy ATK DMG Bonus': 2.67 },
  },
  lupa: {
    label: 'Lupa',
    weights: { 'Crit. DMG': 4.3, 'Crit. Rate': 5.75, 'ATK%': 3.21, ATK: 1.66, 'Basic ATK DMG Bonus': 0.16, 'Res. Skill DMG Bonus': 0.35, 'Res. Liberation DMG Bonus': 2.15, 'Heavy ATK DMG Bonus': 0.22 },
  },
  iuno: {
    label: 'Iuno',
    weights: { 'Crit. DMG': 6.29, 'Crit. Rate': 5.4, 'ATK%': 2.99, ATK: 1.68, 'Res. Skill DMG Bonus': 0.3, 'Res. Liberation DMG Bonus': 2.8 },
  },
  'suoming-sub-dps': {
    label: 'Suoming (Sub-DPS)',
    weights: { 'Crit. DMG': 6.19, 'Crit. Rate': 5.05, 'ATK%': 2.66, ATK: 1.23, 'Basic ATK DMG Bonus': 1.91, 'Res. Skill DMG Bonus': 0.06, 'Res. Liberation DMG Bonus': 0.58 },
  },
  'suoming-main-dps': {
    label: 'Suoming (Main DPS)',
    weights: { 'Crit. DMG': 4.76, 'Crit. Rate': 4.59, 'ATK%': 2.33, ATK: 1.09, 'Basic ATK DMG Bonus': 2.0, 'Res. Skill DMG Bonus': 0.03, 'Res. Liberation DMG Bonus': 0.27 },
  },
}
