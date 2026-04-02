import { describe, it, expect } from 'vitest'

/**
 * Tests for statistics computation logic used across admin stats routes.
 * Focuses on the pure computation functions without Supabase.
 */

describe('Stats — year filtering logic', () => {
  function parseYear(queryYear: unknown): string {
    return typeof queryYear === 'string' ? queryYear : String(new Date().getFullYear())
  }

  function buildYearRange(year: string) {
    return {
      yearStart: `${year}-01-01`,
      yearEnd: `${year}-12-31`,
    }
  }

  it('uses provided year string', () => {
    expect(parseYear('2025')).toBe('2025')
  })

  it('defaults to current year for non-string', () => {
    const result = parseYear(undefined)
    expect(result).toMatch(/^\d{4}$/)
  })

  it('builds correct year range', () => {
    const range = buildYearRange('2026')
    expect(range.yearStart).toBe('2026-01-01')
    expect(range.yearEnd).toBe('2026-12-31')
  })
})

describe('Stats — profils computation (from route)', () => {
  function computeAge(dateOfBirth: string, today: Date): number | null {
    if (!dateOfBirth) return null
    const birth = new Date(dateOfBirth)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  it('computes age for birthday already passed this year', () => {
    const today = new Date('2026-06-15')
    expect(computeAge('2006-01-01', today)).toBe(20)
  })

  it('computes age for birthday not yet this year', () => {
    const today = new Date('2026-03-15')
    expect(computeAge('2006-06-01', today)).toBe(19)
  })

  it('computes age for birthday today', () => {
    const today = new Date('2026-06-01')
    expect(computeAge('2006-06-01', today)).toBe(20)
  })

  it('returns null for empty date', () => {
    expect(computeAge('', new Date())).toBeNull()
  })
})

describe('Stats — actions repartition by category', () => {
  function computeRepartitionCategorie(actions: Array<{ category: string }>) {
    const result: Record<string, number> = {}
    for (const a of actions) {
      const key = a.category || 'non_categorise'
      result[key] = (result[key] ?? 0) + 1
    }
    return result
  }

  it('counts actions per category', () => {
    const result = computeRepartitionCategorie([
      { category: 'Cuisine' },
      { category: 'Sport' },
      { category: 'Cuisine' },
    ])
    expect(result).toEqual({ Cuisine: 2, Sport: 1 })
  })

  it('groups empty category as non_categorise', () => {
    const result = computeRepartitionCategorie([
      { category: '' },
      { category: 'Sport' },
    ])
    expect(result).toEqual({ non_categorise: 1, Sport: 1 })
  })

  it('returns empty for no actions', () => {
    expect(computeRepartitionCategorie([])).toEqual({})
  })
})

describe('Stats — unique jeune IDs extraction', () => {
  function extractUniqueJeuneIds(inscriptions: Array<{ jeune_id: string }>): string[] {
    return [...new Set(inscriptions.map(i => i.jeune_id))]
  }

  it('extracts unique IDs', () => {
    const ids = extractUniqueJeuneIds([
      { jeune_id: 'j-1' },
      { jeune_id: 'j-2' },
      { jeune_id: 'j-1' },
    ])
    expect(ids).toHaveLength(2)
    expect(ids).toContain('j-1')
    expect(ids).toContain('j-2')
  })

  it('returns empty for empty inscriptions', () => {
    expect(extractUniqueJeuneIds([])).toEqual([])
  })
})

describe('Stats — unique action IDs merge', () => {
  function mergeActionIds(
    actionIdsFromDates: number[],
    legacyActionIds: number[],
  ): number[] {
    return [...new Set([...actionIdsFromDates, ...legacyActionIds])]
  }

  it('merges two arrays deduplicating', () => {
    const result = mergeActionIds([1, 2, 3], [2, 3, 4])
    expect(result.sort()).toEqual([1, 2, 3, 4])
  })

  it('handles empty date-based IDs', () => {
    const result = mergeActionIds([], [1, 2])
    expect(result).toEqual([1, 2])
  })

  it('handles empty legacy IDs', () => {
    const result = mergeActionIds([1, 2], [])
    expect(result).toEqual([1, 2])
  })

  it('returns empty for both empty', () => {
    expect(mergeActionIds([], [])).toEqual([])
  })
})
