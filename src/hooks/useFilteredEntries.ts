import { useCallback, useEffect, useState } from 'react'

import { getEntriesInRange } from '@/db/queries'
import type { DailyEntry } from '@/types/models'

interface UseFilteredEntriesOptions {
  from: string
  to: string
}

interface UseFilteredEntriesResult {
  entries: DailyEntry[]
  isLoading: boolean
}

export function useFilteredEntries({ from, to }: UseFilteredEntriesOptions): UseFilteredEntriesResult {
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchEntries = useCallback(() => {
    setIsLoading(true)

    void getEntriesInRange(from, to).then((result) => {
      setEntries(result)
      setIsLoading(false)
    })
  }, [from, to])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetching on mount
    fetchEntries()
  }, [fetchEntries])

  return { entries, isLoading }
}
