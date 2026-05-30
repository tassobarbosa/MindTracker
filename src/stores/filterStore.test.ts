import { afterEach, describe, expect, it } from 'vitest'

import { useFilterStore } from '@/stores/filterStore'
import { HeadacheIntensity, WorkEnvironment } from '@/types/enums'

describe('filterStore', () => {
  afterEach(() => {
    useFilterStore.setState(useFilterStore.getInitialState(), true)
  })

  it('updates headache and environment filters', () => {
    useFilterStore.getState().setHeadacheFilter([HeadacheIntensity.High])
    useFilterStore.getState().setEnvironmentFilter([WorkEnvironment.HomeOffice])

    expect(useFilterStore.getState().headacheFilter).toEqual([HeadacheIntensity.High])
    expect(useFilterStore.getState().environmentFilter).toEqual([
      WorkEnvironment.HomeOffice,
    ])
  })

  it('setDateRangePreset clears custom fields when preset is not custom', () => {
    useFilterStore.getState().setCustomRange('2026-05-01', '2026-05-10')
    useFilterStore.getState().setDateRangePreset('last7')

    expect(useFilterStore.getState()).toMatchObject({
      dateRangePreset: 'last7',
      customFrom: null,
      customTo: null,
    })
  })

  it('setCustomRange switches the preset to custom', () => {
    useFilterStore.getState().setCustomRange('2026-05-01', '2026-05-10')

    expect(useFilterStore.getState()).toMatchObject({
      dateRangePreset: 'custom',
      customFrom: '2026-05-01',
      customTo: '2026-05-10',
    })
  })
})