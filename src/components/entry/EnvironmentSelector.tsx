import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { workEnvironmentLabels, workEnvironmentOptions } from '@/lib/entryOptions'
import type { WorkEnvironment } from '@/types/enums'

interface EnvironmentSelectorProps {
  value?: WorkEnvironment
  onChange: (value: WorkEnvironment) => void
  error?: string
  disabled?: boolean
}

export function EnvironmentSelector({
  value,
  onChange,
  error,
  disabled = false,
}: EnvironmentSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-primary">Work environment</p>
        <p className="text-sm text-text-muted">Capture where you worked or spent the day.</p>
      </div>

      <div
        aria-label="Work environment"
        className="grid grid-cols-2 gap-2"
        role="radiogroup"
      >
        {workEnvironmentOptions.map((option) => {
          const isSelected = option === value

          return (
            <Button
              key={option}
              aria-checked={isSelected}
              className={cn(
                'min-h-12 rounded-lg border',
                isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
              )}
              disabled={disabled}
              onClick={() => { onChange(option) }}
              role="radio"
              type="button"
              variant={isSelected ? 'default' : 'outline'}
            >
              {workEnvironmentLabels[option]}
            </Button>
          )
        })}
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}
