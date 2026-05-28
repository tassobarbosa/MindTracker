import { addDays, format, parseISO, subDays } from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import { formatDisplay } from '@/lib/dateUtils'

interface DateNavigatorProps {
  selectedDate: string
}

function toRoute(dateKey: string): string {
  return `/entry/${dateKey}`
}

export function DateNavigator({ selectedDate }: DateNavigatorProps) {
  const navigate = useNavigate()
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const parsedSelectedDate = parseISO(selectedDate)

  const navigateToDate = (dateKey: string) => {
    if (!dateKey) {
      return
    }

    void navigate(toRoute(dateKey))
    setIsPickerOpen(false)
  }

  return (
    <section aria-label="Date navigation" className="rounded-xl border bg-surface p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <Button
          aria-label="Go to previous day"
          onClick={() => { navigateToDate(format(subDays(parsedSelectedDate, 1), 'yyyy-MM-dd')) }}
          size="icon"
          type="button"
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover onOpenChange={setIsPickerOpen} open={isPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              className="min-h-12 flex-1 justify-center gap-2 rounded-lg px-4 text-sm"
              type="button"
              variant="outline"
            >
              <CalendarDays className="h-4 w-4" />
              <span>{formatDisplay(selectedDate)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="center" className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-primary">Jump to a date</p>
              <p className="text-sm text-text-muted">Pick any day to create or edit an entry.</p>
            </div>
            <input
              aria-label="Select date"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              onChange={(event) => { navigateToDate(event.target.value) }}
              type="date"
              value={selectedDate}
            />
          </PopoverContent>
        </Popover>

        <Button
          aria-label="Go to next day"
          onClick={() => { navigateToDate(format(addDays(parsedSelectedDate, 1), 'yyyy-MM-dd')) }}
          size="icon"
          type="button"
          variant="outline"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
