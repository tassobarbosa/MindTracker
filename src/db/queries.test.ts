import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { db } from '@/db/database'
import { getAllEntries, getEntriesInRange, getEntry, upsertEntry } from '@/db/queries'
import { HeadacheIntensity, WorkEnvironment } from '@/types/enums'
import type { DailyEntry } from '@/types/models'

function makeEntry(overrides: Partial<DailyEntry> = {}): DailyEntry {
  return {
    dateKey: '2026-05-25',
    headacheIntensity: HeadacheIntensity.Low,
    workEnvironment: WorkEnvironment.Office,
    notes: 'Baseline entry',
    createdAt: 100,
    updatedAt: 100,
    ...overrides,
  }
}

describe('db queries', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  afterAll(async () => {
    await db.delete()
  })

  it('upsertEntry creates a new row and getEntry returns it', async () => {
    const entry = makeEntry()

    await upsertEntry(entry)

    await expect(getEntry(entry.dateKey)).resolves.toEqual(entry)
  })

  it('upsertEntry updates an existing row without duplicating it and preserves createdAt', async () => {
    await upsertEntry(makeEntry())

    await upsertEntry(
      makeEntry({
        headacheIntensity: HeadacheIntensity.High,
        notes: 'Updated note',
        createdAt: 999,
        updatedAt: 200,
      }),
    )

    const entries = await getAllEntries()

    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({
      dateKey: '2026-05-25',
      headacheIntensity: HeadacheIntensity.High,
      notes: 'Updated note',
      createdAt: 100,
      updatedAt: 200,
    })
  })

  it('getEntriesInRange returns only entries inside the requested bounds', async () => {
    await upsertEntry(makeEntry({ dateKey: '2026-05-01' }))
    await upsertEntry(makeEntry({ dateKey: '2026-05-10' }))
    await upsertEntry(makeEntry({ dateKey: '2026-05-20' }))

    await expect(getEntriesInRange('2026-05-05', '2026-05-15')).resolves.toEqual([
      expect.objectContaining({ dateKey: '2026-05-10' }),
    ])
  })
})