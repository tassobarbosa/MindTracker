import { format, isAfter, isValid, parseISO, subDays } from 'date-fns'

export type DateRangePreset = 'last7' | 'last30' | 'last90' | 'all' | 'custom'

const DATE_KEY_FORMAT = 'yyyy-MM-dd'
const DISPLAY_FORMAT = 'MMM d, yyyy'
const ALL_RANGE_START = '1970-01-01'

function toDateKey(value: Date): string {
  return format(value, DATE_KEY_FORMAT)
}

function parseDateKey(value: string | null | undefined): Date | null {
  if (!value) {
    return null
  }

  const parsed = parseISO(value)

  return isValid(parsed) ? parsed : null
}

export function todayKey(): string {
  return toDateKey(new Date())
}

export function formatDisplay(dateKey: string): string {
  const parsed = parseDateKey(dateKey)

  return parsed ? format(parsed, DISPLAY_FORMAT) : dateKey
}

export function parseRange(
  preset: DateRangePreset,
  customFrom?: string | null,
  customTo?: string | null,
): { from: string; to: string } {
  const today = new Date()
  const todayDateKey = toDateKey(today)

  switch (preset) {
    case 'last7':
      return { from: toDateKey(subDays(today, 6)), to: todayDateKey }
    case 'last30':
      return { from: toDateKey(subDays(today, 29)), to: todayDateKey }
    case 'last90':
      return { from: toDateKey(subDays(today, 89)), to: todayDateKey }
    case 'all':
      return { from: ALL_RANGE_START, to: todayDateKey }
    case 'custom': {
      const fromDate = parseDateKey(customFrom) ?? today
      const toDate = parseDateKey(customTo) ?? fromDate
      const [normalizedFrom, normalizedTo] = isAfter(fromDate, toDate)
        ? [toDate, fromDate]
        : [fromDate, toDate]

      return {
        from: toDateKey(normalizedFrom),
        to: toDateKey(normalizedTo),
      }
    }
  }
}