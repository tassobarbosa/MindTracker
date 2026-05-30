import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { EntryForm } from '@/components/entry/EntryForm'
import { db } from '@/db/database'
import { getEntry, upsertEntry } from '@/db/queries'
import { useEntryStore } from '@/stores/entryStore'
import { HeadacheIntensity, WorkEnvironment } from '@/types/enums'

describe('EntryForm edit flow', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  afterEach(() => {
    useEntryStore.setState(useEntryStore.getInitialState(), true)
  })

  afterAll(async () => {
    await db.delete()
  })

  it('updates an existing entry and persists the change', async () => {
    const user = userEvent.setup()

    await upsertEntry({
      dateKey: '2026-05-20',
      headacheIntensity: HeadacheIntensity.Low,
      workEnvironment: WorkEnvironment.Office,
      notes: 'Seeded note',
      createdAt: 100,
      updatedAt: 100,
    })

    render(<EntryForm selectedDate="2026-05-20" />)

    await screen.findByDisplayValue('Seeded note')

    await user.click(screen.getByRole('radio', { name: 'High' }))
    await user.click(screen.getByRole('button', { name: 'Save entry' }))

    await waitFor(async () => {
      const entry = await getEntry('2026-05-20')

      expect(entry).toMatchObject({
        headacheIntensity: HeadacheIntensity.High,
        workEnvironment: WorkEnvironment.Office,
        createdAt: 100,
      })
      expect(entry?.updatedAt).toBeGreaterThanOrEqual(100)
    })
  })
})
