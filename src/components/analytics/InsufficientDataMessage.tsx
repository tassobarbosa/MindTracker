import { Card, CardContent } from '@/components/ui'

interface InsufficientDataMessageProps {
  currentCount: number
  required: number
}

export function InsufficientDataMessage({ currentCount, required }: InsufficientDataMessageProps) {
  const remaining = required - currentCount

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
        <p className="text-lg font-medium text-text-primary">Not enough data yet</p>
        <p className="text-sm text-text-muted">
          You need{' '}
          <span className="font-semibold text-text-secondary">
            {remaining} more {remaining === 1 ? 'entry' : 'entries'}
          </span>{' '}
          before charts unlock. Keep logging!
        </p>
        <p className="text-xs text-text-muted">
          {currentCount} of {required} entries recorded
        </p>
      </CardContent>
    </Card>
  )
}
