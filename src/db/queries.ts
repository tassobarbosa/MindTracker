import { db } from '@/db/database'
import type { DailyEntry } from '@/types/models'

export async function getEntry(dateKey: string): Promise<DailyEntry | undefined> {
  return db.dailyEntries.get(dateKey)
}

export async function upsertEntry(entry: DailyEntry): Promise<void> {
  await db.transaction('rw', db.dailyEntries, async () => {
    const existing = await db.dailyEntries.get(entry.dateKey)
    const nextEntry: DailyEntry = {
      ...entry,
      createdAt: existing?.createdAt ?? entry.createdAt,
    }

    await db.dailyEntries.put(nextEntry)
  })
}

export async function getAllEntries(): Promise<DailyEntry[]> {
  return db.dailyEntries.orderBy('dateKey').reverse().toArray()
}

export async function getEntriesInRange(
  from: string,
  to: string,
): Promise<DailyEntry[]> {
  return db.dailyEntries.where('dateKey').between(from, to, true, true).sortBy('dateKey')
}