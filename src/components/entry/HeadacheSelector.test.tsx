import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { HeadacheSelector } from '@/components/entry/HeadacheSelector'
import { HeadacheIntensity } from '@/types/enums'

describe('HeadacheSelector', () => {
  it('renders all options', () => {
    render(<HeadacheSelector onChange={vi.fn()} value={undefined} />)

    expect(screen.getByRole('radio', { name: 'None' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Low' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Medium' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'High' })).toBeInTheDocument()
  })

  it('fires onChange when an option is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<HeadacheSelector onChange={onChange} value={undefined} />)

    await user.click(screen.getByRole('radio', { name: 'Medium' }))

    expect(onChange).toHaveBeenCalledWith(HeadacheIntensity.Medium)
  })

  it('applies the active style to the selected option', () => {
    render(<HeadacheSelector onChange={vi.fn()} value={HeadacheIntensity.High} />)

    expect(screen.getByRole('radio', { name: 'High' })).toHaveClass('bg-primary')
    expect(screen.getByRole('radio', { name: 'High' })).toHaveAttribute('aria-checked', 'true')
  })
})
