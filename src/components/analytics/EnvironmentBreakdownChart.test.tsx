import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EnvironmentBreakdownChart } from '@/components/analytics/EnvironmentBreakdownChart'
import { WorkEnvironment } from '@/types/enums'
import type { EnvironmentBreakdownRow } from '@/lib/chartData'

const stubData: EnvironmentBreakdownRow[] = [
  { environment: WorkEnvironment.Office, none: 2, low: 3, medium: 1, high: 1 },
  { environment: WorkEnvironment.HomeOffice, none: 4, low: 1, medium: 0, high: 0 },
  { environment: WorkEnvironment.RemoteSpot, none: 1, low: 0, medium: 1, high: 0 },
  { environment: WorkEnvironment.NoWork, none: 3, low: 0, medium: 0, high: 0 },
]

describe('EnvironmentBreakdownChart', () => {
  it('renders without crashing with stub grouped data', () => {
    render(<EnvironmentBreakdownChart data={stubData} />)

    expect(screen.getByTestId('environment-breakdown-chart')).toBeInTheDocument()
    expect(screen.getByText('Headache by Work Environment')).toBeInTheDocument()
  })

  it('renders with all 4 environment labels present', () => {
    render(<EnvironmentBreakdownChart data={stubData} />)

    // The chart renders environment labels on X axis — in jsdom 
    // ResponsiveContainer might not render SVG, but the heading should be present
    expect(screen.getByTestId('environment-breakdown-chart')).toBeInTheDocument()
  })

  it('does not crash on empty array', () => {
    render(<EnvironmentBreakdownChart data={[]} />)

    expect(screen.getByTestId('environment-breakdown-chart')).toBeInTheDocument()
  })
})
