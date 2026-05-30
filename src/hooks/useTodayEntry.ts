import { useEffect, useState } from 'react'

import { getEntry } from '@/db/queries'
import { todayKey } from '@/lib/dateUtils'
import type { DailyEntry } from '@/types/models'

interface UseTodayEntryResult {
  entry: DailyEntry | undefined
  isLoading: boolean
}

export function useTodayEntry(): UseTodayEntryResult {
  const [entry, setEntry] = useState<DailyEntry | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    void getEntry(todayKey()).then((result) => {
      if (!isCurrent) {
        return
      }

      setEntry(result)
      setIsLoading(false)
    })

    return () => {
      isCurrent = false
    }
  }, [])

  return { entry, isLoading }
}
