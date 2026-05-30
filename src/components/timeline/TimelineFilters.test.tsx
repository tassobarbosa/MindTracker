import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { TimelineFilters } from '@/components/timeline/TimelineFilters'
import { useFilterStore } from '@/stores/filterStore'
import { HeadacheIntensity, WorkEnvironment } from '@/types/enums'

describe('TimelineFilters', () => {
  beforeEach(() => {
    useFilterStore.setState({
      headacheFilter: [],
      environmentFilter: [],
    })
  })

  it('renders all headache and environment filter options', () => {
    render(<TimelineFilters />)

    expect(screen.getByRole('button', { name: 'None' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Low' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Medium' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'High' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Office' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Home Office' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remote Spot' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'No Work' })).toBeInTheDocument()
  })

  it('toggles headache filter and updates filterStore', async () => {
    const user = userEvent.setup()

    render(<TimelineFilters />)

    await user.click(screen.getByRole('button', { name: 'High' }))

    expect(useFilterStore.getState().headacheFilter).toContain('high')

    await user.click(screen.getByRole('button', { name: 'High' }))

    expect(useFilterStore.getState().headacheFilter).not.toContain('high')
  })

  it('toggles environment filter and updates filterStore', async () => {
    const user = userEvent.setup()

    render(<TimelineFilters />)

    await user.click(screen.getByRole('button', { name: 'Office' }))

    expect(useFilterStore.getState().environmentFilter).toContain('office')
  })

  it('shows active filter count badge when filters are active', async () => {
    const user = userEvent.setup()

    render(<TimelineFilters />)

    await user.click(screen.getByRole('button', { name: 'High' }))
    await user.click(screen.getByRole('button', { name: 'Office' }))

    expect(screen.getByLabelText('2 active filters')).toBeInTheDocument()
  })

  it('clears all filters when Clear all is clicked', async () => {
    const user = userEvent.setup()

    useFilterStore.setState({
      headacheFilter: [HeadacheIntensity.High],
      environmentFilter: [WorkEnvironment.Office],
    })

    render(<TimelineFilters />)

    await user.click(screen.getByRole('button', { name: 'Clear all' }))

    const state = useFilterStore.getState()
    expect(state.headacheFilter).toEqual([])
    expect(state.environmentFilter).toEqual([])
  })
})
