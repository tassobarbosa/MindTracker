import { afterEach, describe, expect, it } from 'vitest'

import { useEntryStore } from '@/stores/entryStore'
import { HeadacheIntensity } from '@/types/enums'

describe('entryStore', () => {
  afterEach(() => {
    useEntryStore.setState(useEntryStore.getInitialState(), true)
  })

  it('setSelectedDate updates the selected date', () => {
    useEntryStore.getState().setSelectedDate('2026-05-25')

    expect(useEntryStore.getState().selectedDate).toBe('2026-05-25')
  })

  it('setDraft merges patches and resetDraft clears the draft', () => {
    useEntryStore.getState().setDraft({ headacheIntensity: HeadacheIntensity.Medium })
    useEntryStore.getState().setDraft({ notes: 'Draft note' })

    expect(useEntryStore.getState().draft).toMatchObject({
      headacheIntensity: HeadacheIntensity.Medium,
      notes: 'Draft note',
    })

    useEntryStore.getState().resetDraft()

    expect(useEntryStore.getState().draft).toEqual({})
  })
})