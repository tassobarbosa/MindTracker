import { describe, expect, it } from 'vitest'

import { dailyEntrySchema } from '@/lib/entrySchema'
import { HeadacheIntensity, WorkEnvironment } from '@/types/enums'

describe('dailyEntrySchema', () => {
  it('accepts a valid daily entry payload', () => {
    const result = dailyEntrySchema.safeParse({
      dateKey: '2026-05-25',
      headacheIntensity: HeadacheIntensity.Medium,
      workEnvironment: WorkEnvironment.HomeOffice,
      notes: 'Tracked after a focused afternoon.',
    })

    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const result = dailyEntrySchema.safeParse({
      dateKey: '2026-05-25',
      notes: 'Missing required fields.',
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid enum values', () => {
    const result = dailyEntrySchema.safeParse({
      dateKey: '2026-05-25',
      headacheIntensity: 'extreme',
      workEnvironment: 'moon_base',
    })

    expect(result.success).toBe(false)
  })
})