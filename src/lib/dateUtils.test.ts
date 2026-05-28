import { afterEach, describe, expect, it, vi } from 'vitest'

import { formatDisplay, parseRange, todayKey } from '@/lib/dateUtils'

describe('dateUtils', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('todayKey returns a YYYY-MM-DD date string', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-25T10:00:00Z'))

    expect(todayKey()).toBe('2026-05-25')
  })

  it('formatDisplay returns a readable label', () => {
    expect(formatDisplay('2026-05-25')).toBe('May 25, 2026')
  })

  it('parseRange resolves last7 bounds', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-25T10:00:00Z'))

    expect(parseRange('last7')).toEqual({
      from: '2026-05-19',
      to: '2026-05-25',
    })
  })

  it('parseRange resolves last30 bounds', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-25T10:00:00Z'))

    expect(parseRange('last30')).toEqual({
      from: '2026-04-26',
      to: '2026-05-25',
    })
  })

  it('parseRange resolves last90 bounds', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-25T10:00:00Z'))

    expect(parseRange('last90')).toEqual({
      from: '2026-02-25',
      to: '2026-05-25',
    })
  })

  it('parseRange resolves all bounds', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-25T10:00:00Z'))

    expect(parseRange('all')).toEqual({
      from: '1970-01-01',
      to: '2026-05-25',
    })
  })

  it('parseRange resolves custom bounds and normalizes reversed inputs', () => {
    expect(parseRange('custom', '2026-05-20', '2026-05-10')).toEqual({
      from: '2026-05-10',
      to: '2026-05-20',
    })
  })
})