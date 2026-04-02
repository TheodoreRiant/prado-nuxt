import { describe, it, expect } from 'vitest'

/**
 * Unit tests for stats computation logic extracted from stats routes.
 */

describe('Stats — profils logic', () => {
  function computeAgeMedian(ages: number[]): number | null {
    if (ages.length === 0) return null
    const sorted = [...ages].sort((a, b) => a - b)
    if (sorted.length % 2 === 0) {
      return (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    }
    return sorted[Math.floor(sorted.length / 2)]
  }

  it('computes median for odd number of ages', () => {
    expect(computeAgeMedian([20, 18, 22])).toBe(20)
  })

  it('computes median for even number of ages', () => {
    expect(computeAgeMedian([18, 20, 22, 24])).toBe(21)
  })

  it('returns null for empty array', () => {
    expect(computeAgeMedian([])).toBeNull()
  })

  it('handles single age', () => {
    expect(computeAgeMedian([16])).toBe(16)
  })
})

describe('Stats — repartition logic', () => {
  function computeRepartition(items: string[]): Record<string, number> {
    const result: Record<string, number> = {}
    for (const item of items) {
      const key = item || 'non_renseigne'
      result[key] = (result[key] ?? 0) + 1
    }
    return result
  }

  it('counts occurrences', () => {
    const result = computeRepartition(['homme', 'femme', 'homme', 'homme'])
    expect(result).toEqual({ homme: 3, femme: 1 })
  })

  it('groups empty values as non_renseigne', () => {
    const result = computeRepartition(['homme', '', 'femme', ''])
    expect(result).toEqual({ homme: 1, femme: 1, non_renseigne: 2 })
  })

  it('returns empty object for empty array', () => {
    expect(computeRepartition([])).toEqual({})
  })
})

describe('Stats — taux de participation', () => {
  function computeTauxParticipation(totalInscrits: number, totalPresents: number): number {
    if (totalInscrits === 0) return 0
    return Math.round((totalPresents / totalInscrits) * 100)
  }

  it('computes correct percentage', () => {
    expect(computeTauxParticipation(10, 7)).toBe(70)
  })

  it('handles 100% participation', () => {
    expect(computeTauxParticipation(5, 5)).toBe(100)
  })

  it('handles 0 participants', () => {
    expect(computeTauxParticipation(10, 0)).toBe(0)
  })

  it('handles 0 inscrits', () => {
    expect(computeTauxParticipation(0, 0)).toBe(0)
  })

  it('rounds correctly', () => {
    expect(computeTauxParticipation(3, 1)).toBe(33)
  })
})

describe('Stats — taux de fidelisation', () => {
  function computeTauxFidelisation(inscriptionsByJeune: Map<string, number>): number {
    const total = inscriptionsByJeune.size
    if (total === 0) return 0
    const fideles = [...inscriptionsByJeune.values()].filter(c => c >= 2).length
    return Math.round((fideles / total) * 100)
  }

  it('computes fidelisation rate', () => {
    const map = new Map([
      ['j1', 3],
      ['j2', 1],
      ['j3', 2],
      ['j4', 1],
    ])
    // 2 out of 4 have >= 2 inscriptions = 50%
    expect(computeTauxFidelisation(map)).toBe(50)
  })

  it('handles all fideles', () => {
    const map = new Map([
      ['j1', 5],
      ['j2', 2],
    ])
    expect(computeTauxFidelisation(map)).toBe(100)
  })

  it('handles no fideles', () => {
    const map = new Map([
      ['j1', 1],
      ['j2', 1],
    ])
    expect(computeTauxFidelisation(map)).toBe(0)
  })

  it('handles empty map', () => {
    expect(computeTauxFidelisation(new Map())).toBe(0)
  })
})
