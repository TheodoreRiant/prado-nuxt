import { describe, it, expect } from 'vitest'
import { presenceBatchSchema } from '~/server/utils/validation'

/**
 * Tests for the emargement (presence tracking) batch update logic.
 * Tests schema validation and response shaping.
 */

describe('Presence batch — schema validation', () => {
  it('accepts single inscription with "present"', () => {
    const result = presenceBatchSchema.safeParse({
      inscriptionIds: ['550e8400-e29b-41d4-a716-446655440000'],
      presence: 'present',
    })
    expect(result.success).toBe(true)
  })

  it('accepts single inscription with "absent"', () => {
    const result = presenceBatchSchema.safeParse({
      inscriptionIds: ['550e8400-e29b-41d4-a716-446655440000'],
      presence: 'absent',
    })
    expect(result.success).toBe(true)
  })

  it('rejects "inscrit" as presence value (not allowed for batch update)', () => {
    const result = presenceBatchSchema.safeParse({
      inscriptionIds: ['550e8400-e29b-41d4-a716-446655440000'],
      presence: 'inscrit',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty inscriptionIds', () => {
    const result = presenceBatchSchema.safeParse({
      inscriptionIds: [],
      presence: 'present',
    })
    expect(result.success).toBe(false)
  })

  it('accepts up to 200 inscriptionIds', () => {
    const ids = Array.from({ length: 200 }, (_, i) =>
      `550e8400-e29b-41d4-a716-${String(i).padStart(12, '0')}`,
    )
    const result = presenceBatchSchema.safeParse({
      inscriptionIds: ids,
      presence: 'present',
    })
    expect(result.success).toBe(true)
  })

  it('rejects more than 200 inscriptionIds', () => {
    const ids = Array.from({ length: 201 }, (_, i) =>
      `550e8400-e29b-41d4-a716-${String(i).padStart(12, '0')}`,
    )
    const result = presenceBatchSchema.safeParse({
      inscriptionIds: ids,
      presence: 'present',
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-UUID inscriptionIds', () => {
    const result = presenceBatchSchema.safeParse({
      inscriptionIds: ['not-a-uuid'],
      presence: 'present',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing presence', () => {
    const result = presenceBatchSchema.safeParse({
      inscriptionIds: ['550e8400-e29b-41d4-a716-446655440000'],
    })
    expect(result.success).toBe(false)
  })

  it('rejects arbitrary presence value', () => {
    const result = presenceBatchSchema.safeParse({
      inscriptionIds: ['550e8400-e29b-41d4-a716-446655440000'],
      presence: 'maybe',
    })
    expect(result.success).toBe(false)
  })
})

describe('Presence batch — response shaping', () => {
  function buildPresenceResponse(
    updatedRows: Array<{ id: string; presence: string }>,
  ) {
    return {
      updated: updatedRows.length,
      inscriptions: updatedRows,
    }
  }

  it('counts updated rows', () => {
    const response = buildPresenceResponse([
      { id: 'i-1', presence: 'present' },
      { id: 'i-2', presence: 'present' },
    ])
    expect(response.updated).toBe(2)
  })

  it('returns empty when no rows updated', () => {
    const response = buildPresenceResponse([])
    expect(response.updated).toBe(0)
    expect(response.inscriptions).toEqual([])
  })

  it('includes updated inscription data', () => {
    const response = buildPresenceResponse([
      { id: 'i-1', presence: 'absent' },
    ])
    expect(response.inscriptions[0]).toEqual({ id: 'i-1', presence: 'absent' })
  })
})
