import { HeadacheIntensity, WorkEnvironment } from '@/types/enums'
import type { DailyEntry } from '@/types/models'

export interface FrequencyPoint {
  dateKey: string
  intensity: HeadacheIntensity
  ordinal: number
}

export interface EnvironmentBreakdownRow {
  environment: WorkEnvironment
  none: number
  low: number
  medium: number
  high: number
}

const HEADACHE_ORDINAL: Record<HeadacheIntensity, number> = {
  [HeadacheIntensity.None]: 0,
  [HeadacheIntensity.Low]: 1,
  [HeadacheIntensity.Medium]: 2,
  [HeadacheIntensity.High]: 3,
}

export function toFrequencySeries(entries: DailyEntry[]): FrequencyPoint[] {
  return entries
    .slice()
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .map((entry) => ({
      dateKey: entry.dateKey,
      intensity: entry.headacheIntensity,
      ordinal: HEADACHE_ORDINAL[entry.headacheIntensity],
    }))
}

export function toEnvironmentBreakdown(entries: DailyEntry[]): EnvironmentBreakdownRow[] {
  const environmentValues = Object.values(WorkEnvironment)

  const counts = new Map<WorkEnvironment, EnvironmentBreakdownRow>()

  for (const env of environmentValues) {
    counts.set(env, {
      environment: env,
      none: 0,
      low: 0,
      medium: 0,
      high: 0,
    })
  }

  for (const entry of entries) {
    const row = counts.get(entry.workEnvironment)
    if (row) {
      row[entry.headacheIntensity] += 1
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Map is seeded with all environmentValues
  return environmentValues.map((env) => counts.get(env)!)
}
