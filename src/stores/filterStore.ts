import { create } from 'zustand'

import type { DateRangePreset } from '@/lib/dateUtils'
import type { HeadacheIntensity, WorkEnvironment } from '@/types/enums'

export interface FilterStore {
  headacheFilter: HeadacheIntensity[]
  environmentFilter: WorkEnvironment[]
  dateRangePreset: DateRangePreset
  customFrom: string | null
  customTo: string | null
  setHeadacheFilter: (value: HeadacheIntensity[]) => void
  setEnvironmentFilter: (value: WorkEnvironment[]) => void
  setDateRangePreset: (preset: DateRangePreset) => void
  setCustomRange: (from: string, to: string) => void
}

const initialState = {
  headacheFilter: [] as HeadacheIntensity[],
  environmentFilter: [] as WorkEnvironment[],
  dateRangePreset: 'last30' as DateRangePreset,
  customFrom: null,
  customTo: null,
}

export const useFilterStore = create<FilterStore>()((set) => ({
  ...initialState,
  setHeadacheFilter: (headacheFilter) => { set({ headacheFilter }) },
  setEnvironmentFilter: (environmentFilter) => { set({ environmentFilter }) },
  setDateRangePreset: (dateRangePreset) => {
    set((state) => ({
      dateRangePreset,
      customFrom: dateRangePreset === 'custom' ? state.customFrom : null,
      customTo: dateRangePreset === 'custom' ? state.customTo : null,
    }))
  },
  setCustomRange: (customFrom, customTo) => {
    set({
      dateRangePreset: 'custom',
      customFrom,
      customTo,
    })
  },
}))