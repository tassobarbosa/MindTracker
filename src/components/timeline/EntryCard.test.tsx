import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { EntryCard } from '@/components/timeline/EntryCard'
import { HeadacheIntensity, WorkEnvironment } from '@/types/enums'
import type { DailyEntry } from '@/types/models'

const baseEntry: DailyEntry = {
  dateKey: '2026-05-20',
  headacheIntensity: HeadacheIntensity.Medium,
  workEnvironment: WorkEnvironment.HomeOffice,
  notes: 'Felt a bit off today',
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

describe('EntryCard', () => {
  it('renders all fields', () => {
    render(<EntryCard entry={baseEntry} onEdit={vi.fn()} />)

    expect(screen.getByText('May 20, 2026')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Home Office')).toBeInTheDocument()
    expect(screen.getByText('Felt a bit off today')).toBeInTheDocument()
  })

  it('truncates notes longer than 80 characters', () => {
    const longNote = 'A'.repeat(100)
    const entry = { ...baseEntry, notes: longNote }

    render(<EntryCard entry={entry} onEdit={vi.fn()} />)

    const displayed = screen.getByText(/^A+…$/)
    expect(displayed.textContent).toHaveLength(81) // 80 chars + ellipsis
  })

  it('does not render note preview when notes is null', () => {
    const entry = { ...baseEntry, notes: null }

    const { container } = render(<EntryCard entry={entry} onEdit={vi.fn()} />)

    // Date and badges should still render
    expect(screen.getByText('May 20, 2026')).toBeInTheDocument()
    // No note paragraph should be present
    const noteParagraphs = container.querySelectorAll('p.text-text-muted')
    expect(noteParagraphs).toHaveLength(0)
  })

  it('fires onEdit on click', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    render(<EntryCard entry={baseEntry} onEdit={onEdit} />)

    await user.click(screen.getByRole('button', { name: /Entry for/ }))

    expect(onEdit).toHaveBeenCalledWith('2026-05-20')
  })

  it('fires onEdit on Enter key', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    render(<EntryCard entry={baseEntry} onEdit={onEdit} />)

    const card = screen.getByRole('button', { name: /Entry for/ })
    card.focus()
    await user.keyboard('{Enter}')

    expect(onEdit).toHaveBeenCalledWith('2026-05-20')
  })
})
