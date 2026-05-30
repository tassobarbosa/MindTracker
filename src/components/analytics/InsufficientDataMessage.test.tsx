import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { InsufficientDataMessage } from '@/components/analytics/InsufficientDataMessage'

describe('InsufficientDataMessage', () => {
  it('renders correct "N more entries needed" text', () => {
    render(<InsufficientDataMessage currentCount={3} required={7} />)

    expect(screen.getByText(/4 more entries/)).toBeInTheDocument()
    expect(screen.getByText(/3 of 7 entries recorded/)).toBeInTheDocument()
  })

  it('renders singular "entry" when only 1 more needed', () => {
    render(<InsufficientDataMessage currentCount={6} required={7} />)

    expect(screen.getByText(/1 more entry/)).toBeInTheDocument()
  })

  it('shows zero remaining when currentCount equals required', () => {
    render(<InsufficientDataMessage currentCount={7} required={7} />)

    expect(screen.getByText(/0 more entries/)).toBeInTheDocument()
  })

  it('renders the "Not enough data yet" heading', () => {
    render(<InsufficientDataMessage currentCount={2} required={7} />)

    expect(screen.getByText('Not enough data yet')).toBeInTheDocument()
  })
})
