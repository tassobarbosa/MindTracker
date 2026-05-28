import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HeadacheFrequencyChart } from '@/components/analytics/HeadacheFrequencyChart'
import { HeadacheIntensity } from '@/types/enums'
import type { FrequencyPoint } from '@/lib/chartData'

// Recharts requires a valid DOM size context to render, but in jsdom
// ResponsiveContainer has zero width/height. We test that the component
// mounts without crashing and the testid wrapper is present.

const stubData: FrequencyPoint[] = Array.from({ length: 7 }, (_, i) => ({
  dateKey: `2026-05-${String(i + 1).padStart(2, '0')}`,
  intensity: [HeadacheIntensity.None, HeadacheIntensity.Low, HeadacheIntensity.Medium, HeadacheIntensity.High][
    i % 4
  ],
  ordinal: i % 4,
}))

describe('HeadacheFrequencyChart', () => {
  it('renders without crashing with stub data', () => {
    render(<HeadacheFrequencyChart data={stubData} />)

    expect(screen.getByTestId('headache-frequency-chart')).toBeInTheDocument()
    expect(screen.getByText('Headache Frequency Over Time')).toBeInTheDocument()
  })

  it('does not crash on empty array', () => {
    render(<HeadacheFrequencyChart data={[]} />)

    expect(screen.getByTestId('headache-frequency-chart')).toBeInTheDocument()
  })
})
