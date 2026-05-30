import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { DateNavigator } from '@/components/entry/DateNavigator'
import { EntryForm } from '@/components/entry/EntryForm'
import { formatDisplay, todayKey } from '@/lib/dateUtils'
import { useEntryStore } from '@/stores/entryStore'

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function EntryPage() {
  const { dateKey } = useParams()
  const selectedDate = useMemo(() => {
    if (dateKey && DATE_KEY_PATTERN.test(dateKey)) {
      return dateKey
    }

    return todayKey()
  }, [dateKey])
  const storeSelectedDate = useEntryStore((state) => state.selectedDate)
  const setSelectedDate = useEntryStore((state) => state.setSelectedDate)
  const isEditingPastOrFuture = selectedDate !== todayKey()

  useEffect(() => {
    if (storeSelectedDate !== selectedDate) {
      setSelectedDate(selectedDate)
    }
  }, [selectedDate, setSelectedDate, storeSelectedDate])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-text-muted">MindTracker</p>
          <h1 className="text-2xl font-semibold text-text-primary">Daily symptom entry</h1>
        </div>
        {isEditingPastOrFuture ? (
          <p className="text-sm font-medium text-text-secondary">
            Editing {formatDisplay(selectedDate)}
          </p>
        ) : (
          <p className="text-sm text-text-muted">Today is selected by default.</p>
        )}
      </div>

      <DateNavigator selectedDate={selectedDate} />
      <EntryForm selectedDate={selectedDate} />
    </div>
  )
}
