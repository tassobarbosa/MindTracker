import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { formatDisplay } from '@/lib/dateUtils'
import type { FrequencyPoint } from '@/lib/chartData'

interface HeadacheFrequencyChartProps {
  data: FrequencyPoint[]
}

const ORDINAL_LABELS: Record<number, string> = {
  0: 'None',
  1: 'Low',
  2: 'Medium',
  3: 'High',
}

function formatYTick(value: number): string {
  return ORDINAL_LABELS[value] ?? ''
}

function formatXTick(dateKey: string): string {
  return formatDisplay(dateKey)
}

export function HeadacheFrequencyChart({ data }: HeadacheFrequencyChartProps) {
  return (
    <div data-testid="headache-frequency-chart">
      <h3 className="mb-3 text-sm font-medium text-text-secondary">Headache Frequency Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dateKey"
            tickFormatter={formatXTick}
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 3]}
            ticks={[0, 1, 2, 3]}
            tickFormatter={formatYTick}
            tick={{ fontSize: 11 }}
            width={55}
          />
          <Bar
            dataKey="ordinal"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
            name="Headache Level"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
