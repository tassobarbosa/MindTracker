import Dexie, { type Table } from 'dexie'

import type { DailyEntry } from '@/types/models'

export class MindTrackerDB extends Dexie {
  dailyEntries!: Table<DailyEntry, string>

  public constructor() {
    super('MindTrackerDB')

    this.version(1).stores({
      dailyEntries: 'dateKey, headacheIntensity, workEnvironment, updatedAt',
    })
  }
}

export const db = new MindTrackerDB()