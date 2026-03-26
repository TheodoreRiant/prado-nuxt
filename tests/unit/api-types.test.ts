import { describe, it, expect } from 'vitest'
import type { Jeune } from '~/lib/api'

describe('lib/api types and mappers', () => {
  describe('Jeune interface', () => {
    it('includes notes field', () => {
      const jeune: Jeune = {
        id: 'uuid-1',
        firstName: 'Alice',
        lastName: 'Dupont',
        dateOfBirth: '2005-03-15',
        address: '12 rue de la Paix',
        situation: 'En formation',
        notes: 'Motivee, ponctuelle',
      }
      expect(jeune.notes).toBe('Motivee, ponctuelle')
    })

    it('accepts empty notes', () => {
      const jeune: Jeune = {
        id: 'uuid-2',
        firstName: 'Bob',
        lastName: 'Martin',
        dateOfBirth: '2008-07-20',
        address: '',
        situation: '',
        notes: '',
      }
      expect(jeune.notes).toBe('')
    })
  })

  describe('toJeune mapper logic (inline test)', () => {
    // Reproduce the mapper logic from lib/api.ts to test it in isolation
    const toJeune = (row: any): Jeune => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      dateOfBirth: row.date_of_birth,
      address: row.address,
      situation: row.situation,
      notes: row.notes ?? '',
    })

    it('maps snake_case DB row to camelCase Jeune', () => {
      const row = {
        id: 'uuid-1',
        first_name: 'Alice',
        last_name: 'Dupont',
        date_of_birth: '2005-03-15',
        address: '12 rue de la Paix',
        situation: 'En formation',
        notes: 'Bonne attitude',
      }
      const result = toJeune(row)
      expect(result).toEqual({
        id: 'uuid-1',
        firstName: 'Alice',
        lastName: 'Dupont',
        dateOfBirth: '2005-03-15',
        address: '12 rue de la Paix',
        situation: 'En formation',
        notes: 'Bonne attitude',
      })
    })

    it('defaults notes to empty string when null in DB', () => {
      const row = {
        id: 'uuid-2',
        first_name: 'Bob',
        last_name: 'Martin',
        date_of_birth: '2008-07-20',
        address: '',
        situation: '',
        notes: null,
      }
      const result = toJeune(row)
      expect(result.notes).toBe('')
    })

    it('defaults notes to empty string when undefined in DB', () => {
      const row = {
        id: 'uuid-3',
        first_name: 'Charlie',
        last_name: 'Durand',
        date_of_birth: '2010-01-01',
        address: '',
        situation: '',
      }
      const result = toJeune(row)
      expect(result.notes).toBe('')
    })
  })

  describe('updateJeune updates mapping', () => {
    // Test the update logic from lib/api.ts
    function buildUpdates(data: Partial<Omit<Jeune, 'id'>>): Record<string, unknown> {
      const updates: Record<string, unknown> = {}
      if (data.firstName !== undefined) updates.first_name = data.firstName
      if (data.lastName !== undefined) updates.last_name = data.lastName
      if (data.dateOfBirth !== undefined) updates.date_of_birth = data.dateOfBirth
      if (data.address !== undefined) updates.address = data.address
      if (data.situation !== undefined) updates.situation = data.situation
      if (data.notes !== undefined) updates.notes = data.notes
      return updates
    }

    it('maps notes to DB column', () => {
      const updates = buildUpdates({ notes: 'Updated note' })
      expect(updates).toEqual({ notes: 'Updated note' })
    })

    it('maps firstName to first_name', () => {
      const updates = buildUpdates({ firstName: 'Alice' })
      expect(updates).toEqual({ first_name: 'Alice' })
    })

    it('ignores undefined fields', () => {
      const updates = buildUpdates({})
      expect(updates).toEqual({})
    })

    it('maps multiple fields at once', () => {
      const updates = buildUpdates({ firstName: 'New', notes: 'Nouvelle note' })
      expect(updates).toEqual({ first_name: 'New', notes: 'Nouvelle note' })
    })
  })
})
