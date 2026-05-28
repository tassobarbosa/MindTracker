import { Button } from '@/components/ui'
import type { DateRangePreset } from '@/lib/dateUtils'
import { useFilterStore } from '@/stores/filterStore'

const presets: { label: string; value: DateRangePreset }[] = [
  { label: 'Last 7', value: 'last7' },
  { label: 'Last 30', value: 'last30' },
  { label: 'Last 90', value: 'last90' },
  { label: 'All', value: 'all' },
  { label: 'Custom', value: 'custom' },
]

export function DateRangePicker() {
  const dateRangePreset = useFilterStore((s) => s.dateRangePreset)
  const customFrom = useFilterStore((s) => s.customFrom)
  const customTo = useFilterStore((s) => s.customTo)
  const setDateRangePreset = useFilterStore((s) => s.setDateRangePreset)
  const setCustomRange = useFilterStore((s) => s.setCustomRange)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <Button
            key={preset.value}
            variant={dateRangePreset === preset.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setDateRangePreset(preset.value) }}
            aria-pressed={dateRangePreset === preset.value}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {dateRangePreset === 'custom' && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-text-secondary" htmlFor="custom-from">
            From
          </label>
          <input
            id="custom-from"
            type="date"
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            value={customFrom ?? ''}
            onChange={(e) => { setCustomRange(e.target.value, customTo ?? '') }}
          />
          <label className="text-sm text-text-secondary" htmlFor="custom-to">
            To
          </label>
          <input
            id="custom-to"
            type="date"
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            value={customTo ?? ''}
            onChange={(e) => { setCustomRange(customFrom ?? '', e.target.value) }}
          />
        </div>
      )}
    </div>
  )
}
