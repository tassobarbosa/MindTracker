import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { EntryForm } from '@/components/entry/EntryForm'
import { useEntryStore } from '@/stores/entryStore'
import { HeadacheIntensity, WorkEnvironment } from '@/types/enums'
import type { DailyEntry } from '@/types/models'

const { getEntryMock, upsertEntryMock } = vi.hoisted(() => ({
  getEntryMock: vi.fn<() => Promise<DailyEntry | undefined>>(),
  upsertEntryMock: vi.fn<(entry: DailyEntry) => Promise<void>>(),
}))

vi.mock('@/db/queries', () => ({
  getEntry: getEntryMock,
  upsertEntry: upsertEntryMock,
}))

describe('EntryForm', () => {
  beforeEach(() => {
    vi.useRealTimers()
    getEntryMock.mockReset()
    upsertEntryMock.mockReset()
  })

  afterEach(() => {
    useEntryStore.setState(useEntryStore.getInitialState(), true)
  })

  it('shows a skeleton while loading', async () => {
    let resolveEntry: (entry: DailyEntry | undefined) => void = () => undefined

    getEntryMock.mockReturnValue(
      new Promise((resolve) => {
        resolveEntry = resolve
      }),
    )

    render(<EntryForm selectedDate="2026-05-25" />)

    expect(screen.getByTestId('entry-form-skeleton')).toBeInTheDocument()

    resolveEntry(undefined)

    await waitFor(() => {
      expect(screen.queryByTestId('entry-form-skeleton')).not.toBeInTheDocument()
    })
  })

  it('pre-populates from an existing entry', async () => {
    getEntryMock.mockResolvedValue({
      dateKey: '2026-05-25',
      headacheIntensity: HeadacheIntensity.Medium,
      workEnvironment: WorkEnvironment.HomeOffice,
      notes: 'Prefilled note',
      createdAt: 10,
      updatedAt: 10,
    })

    render(<EntryForm selectedDate="2026-05-25" />)

    expect(await screen.findByDisplayValue('Prefilled note')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Medium' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Home Office' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('keeps save disabled until required fields are selected', async () => {
    const user = userEvent.setup()

    getEntryMock.mockResolvedValue(undefined)

    render(<EntryForm selectedDate="2026-05-25" />)

    const saveButton = await screen.findByRole('button', { name: 'Save entry' })

    expect(saveButton).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Low' }))
    expect(saveButton).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Office' }))
    expect(saveButton).toBeEnabled()
  })

  it('calls upsertEntry with the expected payload and shows a saved state', async () => {
    const user = userEvent.setup()

    getEntryMock.mockResolvedValue({
      dateKey: '2026-05-25',
      headacheIntensity: HeadacheIntensity.Low,
      workEnvironment: WorkEnvironment.Office,
      notes: 'Existing note',
      createdAt: 123,
      updatedAt: 456,
    })
    upsertEntryMock.mockResolvedValue(undefined)

    render(<EntryForm selectedDate="2026-05-25" />)

    await screen.findByDisplayValue('Existing note')

    await user.click(screen.getByRole('radio', { name: 'High' }))
    await user.click(screen.getByRole('button', { name: 'Save entry' }))

    await waitFor(() => {
      expect(upsertEntryMock).toHaveBeenCalledTimes(1)
    })

    expect(upsertEntryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        dateKey: '2026-05-25',
        headacheIntensity: HeadacheIntensity.High,
        workEnvironment: WorkEnvironment.Office,
        notes: 'Existing note',
        createdAt: 123,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- vitest asymmetric matcher
        updatedAt: expect.any(Number),
      }),
    )
    expect(await screen.findByRole('button', { name: 'Saved' })).toBeInTheDocument()
    expect(screen.getByText('All changes saved.')).toBeInTheDocument()
  })
})
