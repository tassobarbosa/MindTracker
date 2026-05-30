import type { HeadacheIntensity, WorkEnvironment } from '@/types/enums'

export interface DailyEntry {
  dateKey: string
  headacheIntensity: HeadacheIntensity
  workEnvironment: WorkEnvironment
  notes: string | null
  createdAt: number
  updatedAt: number
}