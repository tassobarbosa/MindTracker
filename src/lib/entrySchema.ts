import { z } from 'zod'

import { HeadacheIntensity, WorkEnvironment } from '@/types/enums'

const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/

export const dailyEntrySchema = z.object({
  dateKey: z.string().regex(dateKeyPattern, 'Date must use YYYY-MM-DD format'),
  headacheIntensity: z.enum(HeadacheIntensity),
  workEnvironment: z.enum(WorkEnvironment),
  notes: z.string().max(2000).nullable().optional(),
})

export type DailyEntryFormValues = z.infer<typeof dailyEntrySchema>