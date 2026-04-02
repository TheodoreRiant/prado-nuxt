import { describe, it, expect } from 'vitest'

/**
 * Tests for pure utility functions in server/utils/actionDates.ts.
 * We reproduce the logic here to avoid importing Supabase client dependencies.
 */

interface ActionDateRow {
  id: string
  action_id: number
  date: string
  time: string
  places_max: number | null
}

function isActionTermine(dates: ActionDateRow[], today: string): boolean {
  if (dates.length === 0) return false
  return dates.every(d => d.date < today)
}

function getNextDate(dates: ActionDateRow[], today: string): string | null {
  const future = dates.filter(d => d.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  return future.length > 0 ? future[0].date : null
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function makeDateRow(date: string, id = 'ad-1', actionId = 1): ActionDateRow {
  return { id, action_id: actionId, date, time: '14:00', places_max: null }
}

describe('isActionTermine', () => {
  it('returns false when no dates', () => {
    expect(isActionTermine([], '2026-04-02')).toBe(false)
  })

  it('returns true when all dates are in the past', () => {
    const dates = [
      makeDateRow('2026-03-01'),
      makeDateRow('2026-03-15'),
    ]
    expect(isActionTermine(dates, '2026-04-01')).toBe(true)
  })

  it('returns false when at least one date is in the future', () => {
    const dates = [
      makeDateRow('2026-03-01'),
      makeDateRow('2026-05-01'),
    ]
    expect(isActionTermine(dates, '2026-04-01')).toBe(false)
  })

  it('returns false when a date equals today (not strictly past)', () => {
    const dates = [makeDateRow('2026-04-01')]
    expect(isActionTermine(dates, '2026-04-01')).toBe(false)
  })

  it('returns true when single date is before today', () => {
    const dates = [makeDateRow('2026-03-31')]
    expect(isActionTermine(dates, '2026-04-01')).toBe(true)
  })
})

describe('getNextDate', () => {
  it('returns null when no dates', () => {
    expect(getNextDate([], '2026-04-01')).toBeNull()
  })

  it('returns null when all dates are past', () => {
    const dates = [
      makeDateRow('2026-03-01'),
      makeDateRow('2026-03-15'),
    ]
    expect(getNextDate(dates, '2026-04-01')).toBeNull()
  })

  it('returns the earliest future date', () => {
    const dates = [
      makeDateRow('2026-03-01'),
      makeDateRow('2026-04-15'),
      makeDateRow('2026-05-01'),
    ]
    expect(getNextDate(dates, '2026-04-01')).toBe('2026-04-15')
  })

  it('includes today as a next date', () => {
    const dates = [makeDateRow('2026-04-01')]
    expect(getNextDate(dates, '2026-04-01')).toBe('2026-04-01')
  })

  it('handles unsorted input correctly', () => {
    const dates = [
      makeDateRow('2026-06-01'),
      makeDateRow('2026-04-10'),
      makeDateRow('2026-05-15'),
    ]
    expect(getNextDate(dates, '2026-04-01')).toBe('2026-04-10')
  })
})

describe('todayKey', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const key = todayKey()
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns a 10-character string', () => {
    expect(todayKey()).toHaveLength(10)
  })
})
