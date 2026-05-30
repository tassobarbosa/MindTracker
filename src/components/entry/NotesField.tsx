import { Textarea } from '@/components/ui'

const MAX_NOTES_LENGTH = 2000

interface NotesFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}

export function NotesField({ value, onChange, error, disabled = false }: NotesFieldProps) {
  const noteLength = value.length

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-text-primary" htmlFor="daily-entry-notes">
          Notes
        </label>
        <p className="text-sm text-text-muted">Optional observations for the day.</p>
      </div>

      <Textarea
        className="min-h-32 resize-none"
        disabled={disabled}
        id="daily-entry-notes"
        maxLength={MAX_NOTES_LENGTH}
        onChange={(event) => { onChange(event.target.value) }}
        placeholder="Anything notable about the day?"
        value={value}
      />

      <div className="flex items-start justify-between gap-3 text-sm">
        {error ? <p className="text-danger">{error}</p> : <span className="text-text-muted">Optional</span>}
        <span aria-live="polite" className="ml-auto text-text-muted">
          {noteLength}/{MAX_NOTES_LENGTH}
        </span>
      </div>
    </div>
  )
}
