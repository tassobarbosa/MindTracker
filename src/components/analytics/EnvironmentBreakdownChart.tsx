import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { workEnvironmentLabels } from '@/lib/entryOptions'
import type { EnvironmentBreakdownRow } from '@/lib/chartData'
import type { WorkEnvironment } from '@/types/enums'

interface EnvironmentBreakdownChartProps {
  data: EnvironmentBreakdownRow[]
}

function formatXTick(environment: string): string {
  return workEnvironmentLabels[environment as WorkEnvironment]
}

export function EnvironmentBreakdownChart({ data }: EnvironmentBreakdownChartProps) {
  return (
    <div data-testid="environment-breakdown-chart">
      <h3 className="mb-3 text-sm font-medium text-text-secondary">Headache by Work Environment</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="environment"
            tickFormatter={formatXTick}
            tick={{ fontSize: 11 }}
          />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Legend />
          <Bar dataKey="none" fill="hsl(var(--chart-3))" name="None" stackId="stack" />
          <Bar dataKey="low" fill="hsl(var(--chart-1))" name="Low" stackId="stack" />
          <Bar dataKey="medium" fill="hsl(var(--chart-2))" name="Medium" stackId="stack" />
          <Bar dataKey="high" fill="hsl(var(--chart-4))" name="High" stackId="stack" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
