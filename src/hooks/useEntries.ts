import { useCallback, useEffect, useState } from 'react'

import { getAllEntries } from '@/db/queries'
import type { DailyEntry } from '@/types/models'

interface UseEntriesResult {
  entries: DailyEntry[]
  isLoading: boolean
  refetch: () => void
}

export function useEntries(): UseEntriesResult {
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetch = useCallback(() => {
    setIsLoading(true)

    void getAllEntries().then((result) => {
      setEntries(result)
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetching on mount
    fetch()
  }, [fetch])

  return { entries, isLoading, refetch: fetch }
}
