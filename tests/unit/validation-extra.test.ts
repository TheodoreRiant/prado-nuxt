import { describe, it, expect } from 'vitest'
import {
  inscriptionCreateSchema,
  actionDuplicateSchema,
  sendConfirmationSchema,
  updateProfileSchema,
  contactPatchSchema,
  statsQuerySchema,
} from '~/server/utils/validation'

/**
 * Additional validation schema tests covering schemas not tested in validation.test.ts.
 */

describe('inscriptionCreateSchema', () => {
  const validData = {
    actionId: '42',
    jeuneId: '550e8400-e29b-41d4-a716-446655440000',
  }

  it('accepts valid inscription with string actionId', () => {
    const result = inscriptionCreateSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepts valid inscription with number actionId', () => {
    const result = inscriptionCreateSchema.safeParse({ ...validData, actionId: 42 })
    expect(result.success).toBe(true)
  })

  it('rejects missing jeuneId', () => {
    const result = inscriptionCreateSchema.safeParse({ actionId: '42' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid UUID for jeuneId', () => {
    const result = inscriptionCreateSchema.safeParse({ actionId: '42', jeuneId: 'not-uuid' })
    expect(result.success).toBe(false)
  })

  it('accepts optional actionDateId as UUID', () => {
    const result = inscriptionCreateSchema.safeParse({
      ...validData,
      actionDateId: '550e8400-e29b-41d4-a716-446655440001',
    })
    expect(result.success).toBe(true)
  })

  it('accepts null actionDateId', () => {
    const result = inscriptionCreateSchema.safeParse({
      ...validData,
      actionDateId: null,
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid UUID for actionDateId', () => {
    const result = inscriptionCreateSchema.safeParse({
      ...validData,
      actionDateId: 'bad-uuid',
    })
    expect(result.success).toBe(false)
  })

  it('defaults accompagnateurPresent to false', () => {
    const result = inscriptionCreateSchema.parse(validData)
    expect(result.accompagnateurPresent).toBe(false)
  })

  it('defaults attestationResponsabilite to false', () => {
    const result = inscriptionCreateSchema.parse(validData)
    expect(result.attestationResponsabilite).toBe(false)
  })

  it('accepts full inscription data with all optional fields', () => {
    const full = {
      ...validData,
      accompagnateurPresent: true,
      nomsAccompagnateurs: 'Jean Dupont',
      personneUrgenceNom: 'Marie',
      personneUrgenceTel: '0600000000',
      attestationResponsabilite: true,
    }
    const result = inscriptionCreateSchema.safeParse(full)
    expect(result.success).toBe(true)
  })

  it('rejects nomsAccompagnateurs exceeding 500 chars', () => {
    const result = inscriptionCreateSchema.safeParse({
      ...validData,
      nomsAccompagnateurs: 'x'.repeat(501),
    })
    expect(result.success).toBe(false)
  })
})

describe('actionDuplicateSchema', () => {
  it('accepts valid sourceId', () => {
    const result = actionDuplicateSchema.safeParse({ sourceId: 1 })
    expect(result.success).toBe(true)
  })

  it('rejects missing sourceId', () => {
    const result = actionDuplicateSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects string sourceId', () => {
    const result = actionDuplicateSchema.safeParse({ sourceId: '1' })
    expect(result.success).toBe(false)
  })
})

describe('sendConfirmationSchema', () => {
  it('accepts string inscriptionId', () => {
    const result = sendConfirmationSchema.safeParse({ inscriptionId: 'abc' })
    expect(result.success).toBe(true)
  })

  it('accepts number inscriptionId', () => {
    const result = sendConfirmationSchema.safeParse({ inscriptionId: 42 })
    expect(result.success).toBe(true)
  })

  it('rejects missing inscriptionId', () => {
    const result = sendConfirmationSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('updateProfileSchema', () => {
  const validProfile = {
    name: 'Jean Dupont',
    structure_id: '550e8400-e29b-41d4-a716-446655440000',
  }

  it('accepts valid profile', () => {
    const result = updateProfileSchema.safeParse(validProfile)
    expect(result.success).toBe(true)
  })

  it('rejects missing name', () => {
    const result = updateProfileSchema.safeParse({ structure_id: validProfile.structure_id })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = updateProfileSchema.safeParse({ ...validProfile, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid structure_id UUID', () => {
    const result = updateProfileSchema.safeParse({ ...validProfile, structure_id: 'not-uuid' })
    expect(result.success).toBe(false)
  })

  it('accepts optional fonction and phone', () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      fonction: 'Educateur',
      phone: '0600000000',
    })
    expect(result.success).toBe(true)
  })
})

describe('contactPatchSchema', () => {
  it('accepts valid patch with string id', () => {
    const result = contactPatchSchema.safeParse({ id: '1', is_read: true })
    expect(result.success).toBe(true)
  })

  it('accepts valid patch with number id', () => {
    const result = contactPatchSchema.safeParse({ id: 1, is_read: false })
    expect(result.success).toBe(true)
  })

  it('rejects missing is_read', () => {
    const result = contactPatchSchema.safeParse({ id: 1 })
    expect(result.success).toBe(false)
  })

  it('rejects missing id', () => {
    const result = contactPatchSchema.safeParse({ is_read: true })
    expect(result.success).toBe(false)
  })
})

describe('statsQuerySchema', () => {
  it('accepts valid 4-digit year', () => {
    const result = statsQuerySchema.safeParse({ year: '2026' })
    expect(result.success).toBe(true)
  })

  it('accepts missing year (optional)', () => {
    const result = statsQuerySchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('rejects non-4-digit year', () => {
    const result = statsQuerySchema.safeParse({ year: '26' })
    expect(result.success).toBe(false)
  })

  it('rejects year with letters', () => {
    const result = statsQuerySchema.safeParse({ year: 'abcd' })
    expect(result.success).toBe(false)
  })
})
