import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TimelineList } from '@/components/timeline/TimelineList'
import { useFilterStore } from '@/stores/filterStore'
import { HeadacheIntensity, WorkEnvironment } from '@/types/enums'
import type { DailyEntry } from '@/types/models'

const mockEntries: DailyEntry[] = [
  {
    dateKey: '2026-05-20',
    headacheIntensity: HeadacheIntensity.High,
    workEnvironment: WorkEnvironment.Office,
    notes: 'Bad day',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    dateKey: '2026-05-19',
    headacheIntensity: HeadacheIntensity.None,
    workEnvironment: WorkEnvironment.HomeOffice,
    notes: 'Good day',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    dateKey: '2026-05-18',
    headacheIntensity: HeadacheIntensity.Medium,
    workEnvironment: WorkEnvironment.Office,
    notes: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

let mockUseEntriesReturn: { entries: DailyEntry[]; isLoading: boolean; refetch: () => void }

vi.mock('@/hooks/useEntries', () => ({
  useEntries: () => mockUseEntriesReturn,
}))

describe('TimelineList', () => {
  beforeEach(() => {
    mockUseEntriesReturn = {
      entries: mockEntries,
      isLoading: false,
      refetch: vi.fn(),
    }
    useFilterStore.setState({
      headacheFilter: [],
      environmentFilter: [],
    })
  })

  it('shows skeleton cards while loading', () => {
    mockUseEntriesReturn = { entries: [], isLoading: true, refetch: vi.fn() }

    const { container } = render(<TimelineList onEdit={vi.fn()} />)

    // Skeleton elements should be rendered
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders N cards for N entries', () => {
    render(<TimelineList onEdit={vi.fn()} />)

    const cards = screen.getAllByRole('button', { name: /Entry for/ })
    expect(cards).toHaveLength(3)
  })

  it('shows empty-all state with zero entries', () => {
    mockUseEntriesReturn = { entries: [], isLoading: false, refetch: vi.fn() }

    render(<TimelineList onEdit={vi.fn()} />)

    expect(screen.getByText('No entries yet.')).toBeInTheDocument()
    expect(screen.getByText('Create your first entry')).toBeInTheDocument()
  })

  it('shows empty-filtered state when filters match nothing', () => {
    useFilterStore.setState({
      headacheFilter: [HeadacheIntensity.Low],
      environmentFilter: [WorkEnvironment.RemoteSpot],
    })

    render(<TimelineList onEdit={vi.fn()} />)

    expect(screen.getByText('No entries match these filters.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
  })

  it('filters correctly for headache and environment combination', () => {
    useFilterStore.setState({
      headacheFilter: [HeadacheIntensity.High],
      environmentFilter: [WorkEnvironment.Office],
    })

    render(<TimelineList onEdit={vi.fn()} />)

    const cards = screen.getAllByRole('button', { name: /Entry for/ })
    expect(cards).toHaveLength(1)
    expect(screen.getByText('May 20, 2026')).toBeInTheDocument()
  })

  it('filters by headache only', () => {
    useFilterStore.setState({
      headacheFilter: [HeadacheIntensity.High, HeadacheIntensity.Medium],
      environmentFilter: [],
    })

    render(<TimelineList onEdit={vi.fn()} />)

    const cards = screen.getAllByRole('button', { name: /Entry for/ })
    expect(cards).toHaveLength(2)
  })
})
