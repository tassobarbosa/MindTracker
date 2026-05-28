import { create } from 'zustand'

import { todayKey } from '@/lib/dateUtils'
import type { DailyEntry } from '@/types/models'

export interface EntryStore {
  selectedDate: string
  draft: Partial<DailyEntry>
  isSaving: boolean
  setSelectedDate: (date: string) => void
  setDraft: (patch: Partial<DailyEntry>) => void
  resetDraft: () => void
}

const createInitialState = () => ({
  selectedDate: todayKey(),
  draft: {} as Partial<DailyEntry>,
  isSaving: false,
})

export const useEntryStore = create<EntryStore>()((set) => ({
  ...createInitialState(),
  setSelectedDate: (selectedDate) => { set({ selectedDate }) },
  setDraft: (patch) => {
    set((state) => ({
      draft: {
        ...state.draft,
        ...patch,
      },
    }))
  },
  resetDraft: () => { set({ draft: {} }) },
}))