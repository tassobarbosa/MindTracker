import { DateRangePicker } from '@/components/analytics/DateRangePicker'
import { EnvironmentBreakdownChart } from '@/components/analytics/EnvironmentBreakdownChart'
import { HeadacheFrequencyChart } from '@/components/analytics/HeadacheFrequencyChart'
import { InsufficientDataMessage } from '@/components/analytics/InsufficientDataMessage'
import { Skeleton } from '@/components/ui'
import { useFilteredEntries } from '@/hooks/useFilteredEntries'
import { toEnvironmentBreakdown, toFrequencySeries } from '@/lib/chartData'
import { parseRange } from '@/lib/dateUtils'
import { useFilterStore } from '@/stores/filterStore'

const MIN_ENTRIES = 7

export function AnalyticsPage() {
  const dateRangePreset = useFilterStore((s) => s.dateRangePreset)
  const customFrom = useFilterStore((s) => s.customFrom)
  const customTo = useFilterStore((s) => s.customTo)

  const { from, to } = parseRange(dateRangePreset, customFrom, customTo)
  const { entries, isLoading } = useFilteredEntries({ from, to })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-text-primary">Analytics</h1>
      <DateRangePicker />

      {isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      )}

      {!isLoading && entries.length < MIN_ENTRIES && (
        <InsufficientDataMessage currentCount={entries.length} required={MIN_ENTRIES} />
      )}

      {!isLoading && entries.length >= MIN_ENTRIES && (
        <div className="flex flex-col gap-6">
          <HeadacheFrequencyChart data={toFrequencySeries(entries)} />
          <EnvironmentBreakdownChart data={toEnvironmentBreakdown(entries)} />
        </div>
      )}
    </div>
  )
}
