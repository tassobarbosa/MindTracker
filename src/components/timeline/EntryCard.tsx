import { Badge, Card, CardContent } from '@/components/ui'
import { formatDisplay } from '@/lib/dateUtils'
import { headacheLabels, workEnvironmentLabels } from '@/lib/entryOptions'
import type { HeadacheIntensity } from '@/types/enums'
import type { DailyEntry } from '@/types/models'

interface EntryCardProps {
  entry: DailyEntry
  onEdit: (dateKey: string) => void
}

const NOTE_PREVIEW_LENGTH = 80

const headacheBadgeVariant: Record<HeadacheIntensity, 'default' | 'secondary' | 'outline' | 'danger'> = {
  none: 'secondary',
  low: 'outline',
  medium: 'default',
  high: 'danger',
}

function truncateNote(note: string | null): string | null {
  if (!note) return null
  if (note.length <= NOTE_PREVIEW_LENGTH) return note
  return note.slice(0, NOTE_PREVIEW_LENGTH) + '…'
}

export function EntryCard({ entry, onEdit }: EntryCardProps) {
  const handleClick = () => {
    onEdit(entry.dateKey)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onEdit(entry.dateKey)
    }
  }

  const notePreview = truncateNote(entry.notes)

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Entry for ${formatDisplay(entry.dateKey)}`}
    >
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">
            {formatDisplay(entry.dateKey)}
          </span>
          <div className="flex gap-1.5">
            <Badge variant={headacheBadgeVariant[entry.headacheIntensity]}>
              {headacheLabels[entry.headacheIntensity]}
            </Badge>
            <Badge variant="secondary">
              {workEnvironmentLabels[entry.workEnvironment]}
            </Badge>
          </div>
        </div>
        {notePreview && (
          <p className="text-sm text-text-muted">{notePreview}</p>
        )}
      </CardContent>
    </Card>
  )
}
