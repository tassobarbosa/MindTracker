import { Button, Card, CardContent, Skeleton } from '@/components/ui'
import { useEntries } from '@/hooks/useEntries'
import { useFilterStore } from '@/stores/filterStore'
import type { DailyEntry } from '@/types/models'

import { EntryCard } from './EntryCard'

interface TimelineListProps {
  onEdit: (dateKey: string) => void
}

function applyFilters(
  entries: DailyEntry[],
  headacheFilter: string[],
  environmentFilter: string[],
): DailyEntry[] {
  return entries.filter((entry) => {
    const matchesHeadache =
      headacheFilter.length === 0 || headacheFilter.includes(entry.headacheIntensity)
    const matchesEnvironment =
      environmentFilter.length === 0 || environmentFilter.includes(entry.workEnvironment)
    return matchesHeadache && matchesEnvironment
  })
}

function SkeletonCards() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TimelineList({ onEdit }: TimelineListProps) {
  const { entries, isLoading } = useEntries()
  const headacheFilter = useFilterStore((s) => s.headacheFilter)
  const environmentFilter = useFilterStore((s) => s.environmentFilter)
  const setHeadacheFilter = useFilterStore((s) => s.setHeadacheFilter)
  const setEnvironmentFilter = useFilterStore((s) => s.setEnvironmentFilter)

  if (isLoading) {
    return <SkeletonCards />
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <p className="text-text-muted">No entries yet.</p>
          <Button variant="default" asChild>
            <a href="/">Create your first entry</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const filtered = applyFilters(entries, headacheFilter, environmentFilter)

  if (filtered.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <p className="text-text-muted">No entries match these filters.</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setHeadacheFilter([])
              setEnvironmentFilter([])
            }}
          >
            Clear filters
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {filtered.map((entry) => (
        <EntryCard key={entry.dateKey} entry={entry} onEdit={onEdit} />
      ))}
    </div>
  )
}
