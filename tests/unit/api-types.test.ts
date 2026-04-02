import { describe, it, expect } from 'vitest'
import type { Jeune, Inscription, Etablissement } from '~/lib/api'
import { toJeune, toInscription, toEtablissement } from '~/lib/api'

describe('lib/api types and mappers', () => {
  describe('Jeune interface', () => {
    it('includes notes field', () => {
      const jeune: Jeune = {
        id: 'uuid-1',
        firstName: 'Alice',
        lastName: 'Dupont',
        dateOfBirth: '2005-03-15',
        situation: 'sans_emploi',
        notes: 'Motivee, ponctuelle',
        sex: 'femme',
        isQpv: false,
        accompagnementType: [],
      }
      expect(jeune.notes).toBe('Motivee, ponctuelle')
    })

    it('accepts empty notes', () => {
      const jeune: Jeune = {
        id: 'uuid-2',
        firstName: 'Bob',
        lastName: 'Martin',
        dateOfBirth: '2008-07-20',
        situation: '',
        notes: '',
        sex: 'homme',
        isQpv: false,
        accompagnementType: [],
      }
      expect(jeune.notes).toBe('')
    })

    it('includes sprint 1 fields (sex, isQpv, accompagnementType)', () => {
      const jeune: Jeune = {
        id: 'uuid-3',
        firstName: 'Charlie',
        lastName: 'Durand',
        dateOfBirth: '2010-01-01',
        situation: 'scolarise_ordinaire',
        notes: '',
        sex: 'homme',
        isQpv: true,
        accompagnementType: ['educatif', 'social'],
      }
      expect(jeune.sex).toBe('homme')
      expect(jeune.isQpv).toBe(true)
      expect(jeune.accompagnementType).toEqual(['educatif', 'social'])
    })
  })

  describe('toJeune mapper', () => {
    it('maps snake_case DB row to camelCase Jeune', () => {
      const row = {
        id: 'uuid-1',
        first_name: 'Alice',
        last_name: 'Dupont',
        date_of_birth: '2005-03-15',
        situation: 'sans_emploi',
        notes: 'Bonne attitude',
        sex: 'femme',
        is_qpv: true,
        accompagnement_type: ['educatif'],
      }
      const result = toJeune(row)
      expect(result).toEqual({
        id: 'uuid-1',
        firstName: 'Alice',
        lastName: 'Dupont',
        dateOfBirth: '2005-03-15',
        situation: 'sans_emploi',
        notes: 'Bonne attitude',
        sex: 'femme',
        isQpv: true,
        accompagnementType: ['educatif'],
      })
    })

    it('defaults notes to empty string when null in DB', () => {
      const row = {
        id: 'uuid-2',
        first_name: 'Bob',
        last_name: 'Martin',
        date_of_birth: '2008-07-20',
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
        situation: '',
      }
      const result = toJeune(row)
      expect(result.notes).toBe('')
    })

    it('defaults sex to empty string when missing', () => {
      const row = { id: 'uuid-4', first_name: 'D', last_name: 'E', date_of_birth: '2010-01-01', situation: '' }
      expect(toJeune(row).sex).toBe('')
    })

    it('defaults isQpv to false when missing', () => {
      const row = { id: 'uuid-5', first_name: 'F', last_name: 'G', date_of_birth: '2010-01-01', situation: '' }
      expect(toJeune(row).isQpv).toBe(false)
    })

    it('defaults accompagnementType to empty array when missing', () => {
      const row = { id: 'uuid-6', first_name: 'H', last_name: 'I', date_of_birth: '2010-01-01', situation: '' }
      expect(toJeune(row).accompagnementType).toEqual([])
    })
  })

  describe('toInscription mapper', () => {
    it('maps inscription row with new fields', () => {
      const row = {
        id: 'ins-1',
        action_id: '42',
        action_date_id: 'ad-1',
        jeune_id: 'j-1',
        date: '2026-04-01',
        accompagnateur_present: true,
        noms_accompagnateurs: 'Jean Dupont',
        personne_urgence_nom: 'Marie',
        personne_urgence_tel: '0600000000',
        attestation_responsabilite: true,
        presence: 'present',
      }
      const result = toInscription(row)
      expect(result.accompagnateurPresent).toBe(true)
      expect(result.nomsAccompagnateurs).toBe('Jean Dupont')
      expect(result.personneUrgenceNom).toBe('Marie')
      expect(result.personneUrgenceTel).toBe('0600000000')
      expect(result.attestationResponsabilite).toBe(true)
      expect(result.presence).toBe('present')
    })

    it('defaults new fields when missing', () => {
      const row = {
        id: 'ins-2',
        action_id: '42',
        jeune_id: 'j-2',
        date: '2026-04-01',
      }
      const result = toInscription(row)
      expect(result.accompagnateurPresent).toBe(false)
      expect(result.nomsAccompagnateurs).toBeNull()
      expect(result.personneUrgenceNom).toBeNull()
      expect(result.personneUrgenceTel).toBeNull()
      expect(result.attestationResponsabilite).toBe(false)
      expect(result.presence).toBe('inscrit')
    })
  })

  describe('toEtablissement mapper', () => {
    it('maps etablissement row', () => {
      const row = {
        id: 'etab-1',
        name: 'Centre Social',
        address: '12 rue de la Paix',
        postal_code: '13001',
        city: 'Marseille',
        created_at: '2026-01-01T00:00:00Z',
      }
      const result = toEtablissement(row)
      expect(result).toEqual({
        id: 'etab-1',
        name: 'Centre Social',
        address: '12 rue de la Paix',
        postalCode: '13001',
        city: 'Marseille',
        createdAt: '2026-01-01T00:00:00Z',
      })
    })

    it('defaults optional fields to null', () => {
      const row = {
        id: 'etab-2',
        name: 'Lieu X',
        created_at: '2026-01-01T00:00:00Z',
      }
      const result = toEtablissement(row)
      expect(result.address).toBeNull()
      expect(result.postalCode).toBeNull()
      expect(result.city).toBeNull()
    })
  })

  describe('updateJeune updates mapping', () => {
    function buildUpdates(data: Partial<Omit<Jeune, 'id'>>): Record<string, unknown> {
      const updates: Record<string, unknown> = {}
      if (data.firstName !== undefined) updates.first_name = data.firstName
      if (data.lastName !== undefined) updates.last_name = data.lastName
      if (data.dateOfBirth !== undefined) updates.date_of_birth = data.dateOfBirth
      if (data.situation !== undefined) updates.situation = data.situation
      if (data.notes !== undefined) updates.notes = data.notes
      if (data.sex !== undefined) updates.sex = data.sex
      if (data.isQpv !== undefined) updates.is_qpv = data.isQpv
      if (data.accompagnementType !== undefined) updates.accompagnement_type = data.accompagnementType
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
      const updates = buildUpdates({ firstName: 'New', notes: 'Nouvelle note', sex: 'homme' })
      expect(updates).toEqual({ first_name: 'New', notes: 'Nouvelle note', sex: 'homme' })
    })

    it('maps isQpv and accompagnementType', () => {
      const updates = buildUpdates({ isQpv: true, accompagnementType: ['educatif'] })
      expect(updates).toEqual({ is_qpv: true, accompagnement_type: ['educatif'] })
    })
  })
})
