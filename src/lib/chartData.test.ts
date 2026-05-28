import { describe, expect, it } from 'vitest'

import { toEnvironmentBreakdown, toFrequencySeries } from '@/lib/chartData'
import { HeadacheIntensity, WorkEnvironment } from '@/types/enums'
import type { DailyEntry } from '@/types/models'

const makeEntry = (
  dateKey: string,
  headacheIntensity: HeadacheIntensity,
  workEnvironment: WorkEnvironment,
): DailyEntry => ({
  dateKey,
  headacheIntensity,
  workEnvironment,
  notes: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
})

const sampleEntries: DailyEntry[] = [
  makeEntry('2026-05-20', HeadacheIntensity.High, WorkEnvironment.Office),
  makeEntry('2026-05-19', HeadacheIntensity.None, WorkEnvironment.HomeOffice),
  makeEntry('2026-05-18', HeadacheIntensity.Medium, WorkEnvironment.Office),
  makeEntry('2026-05-17', HeadacheIntensity.Low, WorkEnvironment.RemoteSpot),
  makeEntry('2026-05-16', HeadacheIntensity.High, WorkEnvironment.Office),
]

describe('toFrequencySeries', () => {
  it('maps headache levels to correct ordinals', () => {
    const result = toFrequencySeries(sampleEntries)

    expect(result).toHaveLength(5)

    // Should be sorted ascending by dateKey
    expect(result[0].dateKey).toBe('2026-05-16')
    expect(result[0].ordinal).toBe(3) // High

    const none = result.find((p) => p.intensity === HeadacheIntensity.None)
    expect(none?.ordinal).toBe(0)

    const low = result.find((p) => p.intensity === HeadacheIntensity.Low)
    expect(low?.ordinal).toBe(1)

    const medium = result.find((p) => p.intensity === HeadacheIntensity.Medium)
    expect(medium?.ordinal).toBe(2)
  })

  it('handles empty array', () => {
    const result = toFrequencySeries([])
    expect(result).toEqual([])
  })

  it('preserves dateKey and intensity in output', () => {
    const result = toFrequencySeries([sampleEntries[0]])
    expect(result[0]).toEqual({
      dateKey: '2026-05-20',
      intensity: HeadacheIntensity.High,
      ordinal: 3,
    })
  })
})

describe('toEnvironmentBreakdown', () => {
  it('groups counts correctly for mixed data', () => {
    const result = toEnvironmentBreakdown(sampleEntries)

    expect(result).toHaveLength(4) // One row per environment

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- test assertion
    const office = result.find((r) => r.environment === WorkEnvironment.Office)!
    expect(office.high).toBe(2)
    expect(office.medium).toBe(1)
    expect(office.none).toBe(0)
    expect(office.low).toBe(0)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- test assertion
    const homeOffice = result.find((r) => r.environment === WorkEnvironment.HomeOffice)!
    expect(homeOffice.none).toBe(1)
    expect(homeOffice.high).toBe(0)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- test assertion
    const remoteSpot = result.find((r) => r.environment === WorkEnvironment.RemoteSpot)!
    expect(remoteSpot.low).toBe(1)
  })

  it('returns all environments even with no matching entries', () => {
    const result = toEnvironmentBreakdown([])

    expect(result).toHaveLength(4)
    for (const row of result) {
      expect(row.none).toBe(0)
      expect(row.low).toBe(0)
      expect(row.medium).toBe(0)
      expect(row.high).toBe(0)
    }
  })

  it('includes NoWork environment', () => {
    const entries = [makeEntry('2026-05-01', HeadacheIntensity.Low, WorkEnvironment.NoWork)]
    const result = toEnvironmentBreakdown(entries)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- test assertion
    const noWork = result.find((r) => r.environment === WorkEnvironment.NoWork)!
    expect(noWork.low).toBe(1)
  })
})
