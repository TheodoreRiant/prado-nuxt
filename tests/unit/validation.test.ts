import { describe, it, expect } from 'vitest'
import {
  jeuneCreateSchema,
  jeuneUpdateSchema,
  inscriptionBatchSchema,
  presenceBatchSchema,
  etablissementCreateSchema,
  etablissementUpdateSchema,
  contactSchema,
  newsletterSchema,
  checkEmailSchema,
  actionRecurringSchema,
  actionPatchSchema,
  completeProfileSchema,
  deleteAccountSchema,
  structureCreateSchema,
  structurePatchSchema,
  structureDeleteSchema,
  prescripteurPatchSchema,
  settingsPatchSchema,
} from '~/server/utils/validation'

describe('Zod validation schemas', () => {
  // ─── Jeune ───

  describe('jeuneCreateSchema', () => {
    it('accepts valid jeune data', () => {
      const data = {
        firstName: 'Alice',
        lastName: 'Dupont',
        dateOfBirth: '2005-03-15',
        situation: 'sans_emploi',
        sex: 'femme',
      }
      const result = jeuneCreateSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('rejects missing firstName', () => {
      const data = {
        lastName: 'Dupont',
        dateOfBirth: '2005-03-15',
        situation: 'sans_emploi',
        sex: 'femme',
      }
      const result = jeuneCreateSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects invalid date format', () => {
      const data = {
        firstName: 'Alice',
        lastName: 'Dupont',
        dateOfBirth: '15/03/2005',
        situation: 'sans_emploi',
        sex: 'femme',
      }
      const result = jeuneCreateSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects invalid situation', () => {
      const data = {
        firstName: 'Alice',
        lastName: 'Dupont',
        dateOfBirth: '2005-03-15',
        situation: 'invalid_value',
        sex: 'femme',
      }
      const result = jeuneCreateSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects invalid sex', () => {
      const data = {
        firstName: 'Alice',
        lastName: 'Dupont',
        dateOfBirth: '2005-03-15',
        situation: 'sans_emploi',
        sex: 'other',
      }
      const result = jeuneCreateSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('defaults optional fields', () => {
      const data = {
        firstName: 'Alice',
        lastName: 'Dupont',
        dateOfBirth: '2005-03-15',
        situation: 'sans_emploi',
        sex: 'femme',
      }
      const result = jeuneCreateSchema.parse(data)
      expect(result.notes).toBe('')
      expect(result.isQpv).toBe(false)
      expect(result.accompagnementType).toEqual([])
    })
  })

  describe('jeuneUpdateSchema', () => {
    it('accepts partial update', () => {
      const result = jeuneUpdateSchema.safeParse({ firstName: 'Bob' })
      expect(result.success).toBe(true)
    })

    it('rejects empty update', () => {
      const result = jeuneUpdateSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  // ─── Inscription batch ───

  describe('inscriptionBatchSchema', () => {
    it('accepts valid batch', () => {
      const data = {
        actionId: '42',
        jeuneIds: ['550e8400-e29b-41d4-a716-446655440000'],
      }
      const result = inscriptionBatchSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('rejects empty jeuneIds', () => {
      const data = { actionId: '42', jeuneIds: [] }
      const result = inscriptionBatchSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects more than 50 jeuneIds', () => {
      const ids = Array.from({ length: 51 }, (_, i) =>
        `550e8400-e29b-41d4-a716-${String(i).padStart(12, '0')}`,
      )
      const data = { actionId: '42', jeuneIds: ids }
      const result = inscriptionBatchSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  // ─── Presence batch ───

  describe('presenceBatchSchema', () => {
    it('accepts valid presence update', () => {
      const data = {
        inscriptionIds: ['550e8400-e29b-41d4-a716-446655440000'],
        presence: 'present',
      }
      const result = presenceBatchSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('rejects invalid presence value', () => {
      const data = {
        inscriptionIds: ['550e8400-e29b-41d4-a716-446655440000'],
        presence: 'inscrit',
      }
      const result = presenceBatchSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  // ─── Etablissement ───

  describe('etablissementCreateSchema', () => {
    it('accepts valid data', () => {
      const result = etablissementCreateSchema.safeParse({ name: 'Centre' })
      expect(result.success).toBe(true)
    })

    it('rejects empty name', () => {
      const result = etablissementCreateSchema.safeParse({ name: '' })
      expect(result.success).toBe(false)
    })

    it('accepts optional address fields', () => {
      const data = { name: 'Centre', address: '1 rue X', postalCode: '13001', city: 'Marseille' }
      const result = etablissementCreateSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('etablissementUpdateSchema', () => {
    it('accepts partial update', () => {
      const result = etablissementUpdateSchema.safeParse({ name: 'Nouveau nom' })
      expect(result.success).toBe(true)
    })

    it('rejects empty update', () => {
      const result = etablissementUpdateSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  // ─── Contact ───

  describe('contactSchema', () => {
    it('accepts valid contact', () => {
      const data = { name: 'Test', email: 'test@example.com', message: 'Hello' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const data = { name: 'Test', email: 'not-an-email', message: 'Hello' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects empty message', () => {
      const data = { name: 'Test', email: 'test@example.com', message: '' }
      const result = contactSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  // ─── Newsletter ───

  describe('newsletterSchema', () => {
    it('accepts valid email', () => {
      const result = newsletterSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = newsletterSchema.safeParse({ email: 'invalid' })
      expect(result.success).toBe(false)
    })
  })

  // ─── Check email ───

  describe('checkEmailSchema', () => {
    it('accepts valid email', () => {
      const result = checkEmailSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('rejects missing email', () => {
      const result = checkEmailSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  // ─── Action recurring ───

  describe('actionRecurringSchema', () => {
    it('accepts valid recurring action', () => {
      const data = {
        baseAction: { title: 'Atelier' },
        frequency: 'weekly',
        startDate: '2026-04-01',
        endDate: '2026-06-30',
      }
      const result = actionRecurringSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('rejects startDate after endDate', () => {
      const data = {
        baseAction: { title: 'Atelier' },
        frequency: 'weekly',
        startDate: '2026-07-01',
        endDate: '2026-06-30',
      }
      const result = actionRecurringSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('rejects invalid frequency', () => {
      const data = {
        baseAction: { title: 'Atelier' },
        frequency: 'daily',
        startDate: '2026-04-01',
        endDate: '2026-06-30',
      }
      const result = actionRecurringSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  // ─── Action patch ───

  describe('actionPatchSchema', () => {
    it('accepts valid patch with id', () => {
      const result = actionPatchSchema.safeParse({ id: 1, places_max: 20 })
      expect(result.success).toBe(true)
    })

    it('rejects missing id', () => {
      const result = actionPatchSchema.safeParse({ places_max: 20 })
      expect(result.success).toBe(false)
    })

    it('accepts new fields (cost, is_recurring, etablissement_id)', () => {
      const data = { id: 1, cost: 150.50, is_recurring: true, etablissement_id: '550e8400-e29b-41d4-a716-446655440000' }
      const result = actionPatchSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  // ─── Complete profile ───

  describe('completeProfileSchema', () => {
    it('accepts valid profile', () => {
      const data = { name: 'Jean', structure_id: '550e8400-e29b-41d4-a716-446655440000' }
      const result = completeProfileSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('rejects invalid UUID for structure_id', () => {
      const data = { name: 'Jean', structure_id: 'not-a-uuid' }
      const result = completeProfileSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  // ─── Delete account ───

  describe('deleteAccountSchema', () => {
    it('accepts valid email', () => {
      const result = deleteAccountSchema.safeParse({ confirmEmail: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = deleteAccountSchema.safeParse({ confirmEmail: 'not-email' })
      expect(result.success).toBe(false)
    })
  })

  // ─── Structure ───

  describe('structureCreateSchema', () => {
    it('accepts valid name', () => {
      const result = structureCreateSchema.safeParse({ name: 'Centre Social' })
      expect(result.success).toBe(true)
    })

    it('trims whitespace', () => {
      const result = structureCreateSchema.parse({ name: '  Centre Social  ' })
      expect(result.name).toBe('Centre Social')
    })

    it('rejects empty name', () => {
      const result = structureCreateSchema.safeParse({ name: '' })
      expect(result.success).toBe(false)
    })
  })

  describe('structurePatchSchema', () => {
    it('accepts valid patch', () => {
      const data = { id: '550e8400-e29b-41d4-a716-446655440000', name: 'New Name' }
      const result = structurePatchSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('structureDeleteSchema', () => {
    it('accepts valid UUID', () => {
      const result = structureDeleteSchema.safeParse({ id: '550e8400-e29b-41d4-a716-446655440000' })
      expect(result.success).toBe(true)
    })

    it('rejects non-UUID', () => {
      const result = structureDeleteSchema.safeParse({ id: 'abc' })
      expect(result.success).toBe(false)
    })
  })

  // ─── Prescripteur ───

  describe('prescripteurPatchSchema', () => {
    it('accepts status update', () => {
      const data = { id: '550e8400-e29b-41d4-a716-446655440000', status: 'approved' }
      const result = prescripteurPatchSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('accepts role update', () => {
      const data = { id: '550e8400-e29b-41d4-a716-446655440000', role: 'admin' }
      const result = prescripteurPatchSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('rejects without status or role', () => {
      const data = { id: '550e8400-e29b-41d4-a716-446655440000' }
      const result = prescripteurPatchSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  // ─── Settings ───

  describe('settingsPatchSchema', () => {
    it('accepts valid settings', () => {
      const data = { key: 'email', value: { senderName: 'Prado' } }
      const result = settingsPatchSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('rejects unknown key', () => {
      const data = { key: 'unknown', value: {} }
      const result = settingsPatchSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })
})
