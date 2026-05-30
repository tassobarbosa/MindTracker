import { useNavigate } from 'react-router-dom'

import { TimelineFilters } from '@/components/timeline/TimelineFilters'
import { TimelineList } from '@/components/timeline/TimelineList'

export function TimelinePage() {
  const navigate = useNavigate()

  const handleEdit = (dateKey: string) => {
    void navigate(`/entry/${dateKey}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-text-primary">Timeline</h1>
      <TimelineFilters />
      <TimelineList onEdit={handleEdit} />
    </div>
  )
}
