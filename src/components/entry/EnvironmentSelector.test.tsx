import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { EnvironmentSelector } from '@/components/entry/EnvironmentSelector'
import { WorkEnvironment } from '@/types/enums'

describe('EnvironmentSelector', () => {
  it('renders all options', () => {
    render(<EnvironmentSelector onChange={vi.fn()} value={undefined} />)

    expect(screen.getByRole('radio', { name: 'Office' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Home Office' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Remote Spot' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'No Work' })).toBeInTheDocument()
  })

  it('fires onChange when an option is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<EnvironmentSelector onChange={onChange} value={undefined} />)

    await user.click(screen.getByRole('radio', { name: 'Home Office' }))

    expect(onChange).toHaveBeenCalledWith(WorkEnvironment.HomeOffice)
  })

  it('applies the active style to the selected option', () => {
    render(<EnvironmentSelector onChange={vi.fn()} value={WorkEnvironment.NoWork} />)

    expect(screen.getByRole('radio', { name: 'No Work' })).toHaveClass('bg-primary')
    expect(screen.getByRole('radio', { name: 'No Work' })).toHaveAttribute('aria-checked', 'true')
  })
})
