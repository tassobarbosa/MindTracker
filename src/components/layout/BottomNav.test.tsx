import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import { BottomNav } from '@/components/layout/BottomNav'

describe('BottomNav', () => {
  it('renders the three navigation items', () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Today' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Timeline' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Analytics' })).toBeInTheDocument()
  })

  it('marks the active route with aria-current', () => {
    render(
      <MemoryRouter initialEntries={['/timeline']}>
        <BottomNav />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Timeline' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Today' })).not.toHaveAttribute('aria-current')
  })
})
