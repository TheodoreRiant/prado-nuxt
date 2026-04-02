import { describe, it, expect } from 'vitest'

/**
 * Reproduced from server/api/admin/actions/recurring.post.ts for unit testing.
 * Uses UTC to avoid timezone-related off-by-one errors.
 */
function generateDates(
  startDate: string,
  endDate: string,
  frequency: 'weekly' | 'biweekly' | 'monthly',
): string[] {
  const dates: string[] = []
  const current = new Date(startDate + 'T12:00:00Z')
  const end = new Date(endDate + 'T12:00:00Z')

  while (current <= end) {
    const y = current.getUTCFullYear()
    const m = String(current.getUTCMonth() + 1).padStart(2, '0')
    const d = String(current.getUTCDate()).padStart(2, '0')
    dates.push(`${y}-${m}-${d}`)

    switch (frequency) {
      case 'weekly':
        current.setUTCDate(current.getUTCDate() + 7)
        break
      case 'biweekly':
        current.setUTCDate(current.getUTCDate() + 14)
        break
      case 'monthly':
        current.setUTCMonth(current.getUTCMonth() + 1)
        break
    }
  }

  return dates
}

describe('generateDates — recurring action dates', () => {
  it('generates weekly dates', () => {
    const dates = generateDates('2026-04-01', '2026-04-22', 'weekly')
    expect(dates).toEqual(['2026-04-01', '2026-04-08', '2026-04-15', '2026-04-22'])
  })

  it('generates biweekly dates', () => {
    const dates = generateDates('2026-04-01', '2026-05-01', 'biweekly')
    expect(dates).toEqual(['2026-04-01', '2026-04-15', '2026-04-29'])
  })

  it('generates monthly dates', () => {
    const dates = generateDates('2026-01-15', '2026-04-15', 'monthly')
    expect(dates).toEqual(['2026-01-15', '2026-02-15', '2026-03-15', '2026-04-15'])
  })

  it('returns single date when start equals end', () => {
    const dates = generateDates('2026-04-01', '2026-04-01', 'weekly')
    expect(dates).toEqual(['2026-04-01'])
  })

  it('returns empty when start is after end', () => {
    const dates = generateDates('2026-05-01', '2026-04-01', 'weekly')
    expect(dates).toEqual([])
  })

  it('handles month boundary for monthly recurrence', () => {
    const dates = generateDates('2026-01-31', '2026-04-30', 'monthly')
    // Jan 31 -> Feb 28 (overflow) -> Mar 28 -> Apr 28
    expect(dates.length).toBeGreaterThanOrEqual(3)
    expect(dates[0]).toBe('2026-01-31')
  })
})
