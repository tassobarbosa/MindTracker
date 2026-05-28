import { Badge, Button } from '@/components/ui'
import { headacheLabels, headacheOptions, workEnvironmentLabels, workEnvironmentOptions } from '@/lib/entryOptions'
import { useFilterStore } from '@/stores/filterStore'
import type { HeadacheIntensity, WorkEnvironment } from '@/types/enums'

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

export function TimelineFilters() {
  const headacheFilter = useFilterStore((s) => s.headacheFilter)
  const environmentFilter = useFilterStore((s) => s.environmentFilter)
  const setHeadacheFilter = useFilterStore((s) => s.setHeadacheFilter)
  const setEnvironmentFilter = useFilterStore((s) => s.setEnvironmentFilter)

  const activeCount = headacheFilter.length + environmentFilter.length

  const toggleHeadache = (value: HeadacheIntensity) => {
    setHeadacheFilter(toggleInArray(headacheFilter, value))
  }

  const toggleEnvironment = (value: WorkEnvironment) => {
    setEnvironmentFilter(toggleInArray(environmentFilter, value))
  }

  const clearAll = () => {
    setHeadacheFilter([])
    setEnvironmentFilter([])
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-secondary">Filters</span>
          {activeCount > 0 && (
            <Badge variant="default" aria-label={`${String(activeCount)} active filters`}>
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {headacheOptions.map((value) => (
            <Button
              key={value}
              variant={headacheFilter.includes(value) ? 'default' : 'outline'}
              size="sm"
              onClick={() => { toggleHeadache(value) }}
              aria-pressed={headacheFilter.includes(value)}
            >
              {headacheLabels[value]}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {workEnvironmentOptions.map((value) => (
            <Button
              key={value}
              variant={environmentFilter.includes(value) ? 'default' : 'outline'}
              size="sm"
              onClick={() => { toggleEnvironment(value) }}
              aria-pressed={environmentFilter.includes(value)}
            >
              {workEnvironmentLabels[value]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
