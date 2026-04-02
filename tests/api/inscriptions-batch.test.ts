import { describe, it, expect } from 'vitest'
import { inscriptionBatchSchema, inscriptionCreateSchema } from '~/server/utils/validation'

/**
 * Tests for batch inscription logic.
 * Since we cannot call real Supabase, we test:
 * 1. Input validation (schemas)
 * 2. Business logic (capacity checks, insert data building)
 */

describe('Inscription batch — schema validation', () => {
  it('accepts valid batch with single jeune', () => {
    const result = inscriptionBatchSchema.safeParse({
      actionId: '42',
      jeuneIds: ['550e8400-e29b-41d4-a716-446655440000'],
    })
    expect(result.success).toBe(true)
  })

  it('accepts valid batch with multiple jeunes', () => {
    const ids = Array.from({ length: 10 }, (_, i) =>
      `550e8400-e29b-41d4-a716-${String(i).padStart(12, '0')}`,
    )
    const result = inscriptionBatchSchema.safeParse({
      actionId: '42',
      jeuneIds: ids,
    })
    expect(result.success).toBe(true)
  })

  it('accepts number actionId', () => {
    const result = inscriptionBatchSchema.safeParse({
      actionId: 42,
      jeuneIds: ['550e8400-e29b-41d4-a716-446655440000'],
    })
    expect(result.success).toBe(true)
  })

  it('rejects non-UUID jeuneIds', () => {
    const result = inscriptionBatchSchema.safeParse({
      actionId: '42',
      jeuneIds: ['not-a-uuid'],
    })
    expect(result.success).toBe(false)
  })

  it('defaults accompagnateurPresent to false', () => {
    const result = inscriptionBatchSchema.parse({
      actionId: '42',
      jeuneIds: ['550e8400-e29b-41d4-a716-446655440000'],
    })
    expect(result.accompagnateurPresent).toBe(false)
  })

  it('accepts accompagnateurPresent', () => {
    const result = inscriptionBatchSchema.parse({
      actionId: '42',
      jeuneIds: ['550e8400-e29b-41d4-a716-446655440000'],
      accompagnateurPresent: true,
      nomsAccompagnateurs: 'Jean',
    })
    expect(result.accompagnateurPresent).toBe(true)
    expect(result.nomsAccompagnateurs).toBe('Jean')
  })
})

describe('Inscription batch — capacity logic', () => {
  function checkCapacity(
    placesMax: number | null,
    currentCount: number,
    requestedCount: number,
  ): { allowed: boolean; available: number | null } {
    if (placesMax === null) {
      return { allowed: true, available: null }
    }
    const available = placesMax - currentCount
    return {
      allowed: requestedCount <= available,
      available,
    }
  }

  it('allows any count when places_max is null (unlimited)', () => {
    expect(checkCapacity(null, 0, 50).allowed).toBe(true)
    expect(checkCapacity(null, 0, 50).available).toBeNull()
  })

  it('allows when enough places available', () => {
    expect(checkCapacity(20, 5, 10).allowed).toBe(true)
  })

  it('allows exact fill', () => {
    expect(checkCapacity(20, 15, 5).allowed).toBe(true)
  })

  it('rejects when not enough places', () => {
    expect(checkCapacity(20, 18, 5).allowed).toBe(false)
  })

  it('rejects when completely full', () => {
    expect(checkCapacity(20, 20, 1).allowed).toBe(false)
  })

  it('reports correct available count', () => {
    expect(checkCapacity(20, 15, 3).available).toBe(5)
  })
})

describe('Inscription batch — insert data building', () => {
  function buildBatchInsertData(
    prescripteurId: string,
    actionId: string,
    jeuneIds: string[],
    accompagnateurPresent: boolean,
    nomsAccompagnateurs?: string,
  ) {
    return jeuneIds.map(jeuneId => ({
      prescripteur_id: prescripteurId,
      action_id: actionId,
      jeune_id: jeuneId,
      accompagnateur_present: accompagnateurPresent,
      noms_accompagnateurs: nomsAccompagnateurs ?? null,
    }))
  }

  it('creates one row per jeune', () => {
    const rows = buildBatchInsertData('p-1', '42', ['j-1', 'j-2', 'j-3'], false)
    expect(rows).toHaveLength(3)
  })

  it('includes prescripteur and action in every row', () => {
    const rows = buildBatchInsertData('p-1', '42', ['j-1'], true, 'Jean')
    expect(rows[0]).toEqual({
      prescripteur_id: 'p-1',
      action_id: '42',
      jeune_id: 'j-1',
      accompagnateur_present: true,
      noms_accompagnateurs: 'Jean',
    })
  })

  it('defaults noms_accompagnateurs to null', () => {
    const rows = buildBatchInsertData('p-1', '42', ['j-1'], false)
    expect(rows[0].noms_accompagnateurs).toBeNull()
  })
})
