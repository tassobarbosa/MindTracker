import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { headacheLabels, headacheOptions } from '@/lib/entryOptions'
import type { HeadacheIntensity } from '@/types/enums'

interface HeadacheSelectorProps {
  value?: HeadacheIntensity
  onChange: (value: HeadacheIntensity) => void
  error?: string
  disabled?: boolean
}

export function HeadacheSelector({ value, onChange, error, disabled = false }: HeadacheSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-primary">Headache intensity</p>
        <p className="text-sm text-text-muted">Choose the level that best matched the day.</p>
      </div>

      <div
        aria-label="Headache intensity"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        role="radiogroup"
      >
        {headacheOptions.map((option) => {
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
              {headacheLabels[option]}
            </Button>
          )
        })}
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}
