import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { DateRangePicker } from '@/components/analytics/DateRangePicker'
import { useFilterStore } from '@/stores/filterStore'

describe('DateRangePicker', () => {
  beforeEach(() => {
    useFilterStore.setState({
      dateRangePreset: 'last30',
      customFrom: null,
      customTo: null,
    })
  })

  it('renders all preset buttons', () => {
    render(<DateRangePicker />)

    expect(screen.getByRole('button', { name: 'Last 7' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Last 30' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Last 90' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Custom' })).toBeInTheDocument()
  })

  it('clicking a preset updates filterStore', async () => {
    const user = userEvent.setup()

    render(<DateRangePicker />)

    await user.click(screen.getByRole('button', { name: 'Last 7' }))

    expect(useFilterStore.getState().dateRangePreset).toBe('last7')
  })

  it('does not show custom date inputs when preset is not Custom', () => {
    render(<DateRangePicker />)

    expect(screen.queryByLabelText('From')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('To')).not.toBeInTheDocument()
  })

  it('shows custom date inputs when Custom is selected', async () => {
    const user = userEvent.setup()

    render(<DateRangePicker />)

    await user.click(screen.getByRole('button', { name: 'Custom' }))

    expect(screen.getByLabelText('From')).toBeInTheDocument()
    expect(screen.getByLabelText('To')).toBeInTheDocument()
  })

  it('custom from/to values update store', async () => {
    const user = userEvent.setup()

    useFilterStore.setState({ dateRangePreset: 'custom' })

    render(<DateRangePicker />)

    const fromInput = screen.getByLabelText('From')
    await user.clear(fromInput)
    await user.type(fromInput, '2026-01-01')

    expect(useFilterStore.getState().customFrom).toBe('2026-01-01')
    expect(useFilterStore.getState().dateRangePreset).toBe('custom')
  })
})
