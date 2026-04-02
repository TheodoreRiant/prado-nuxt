import { describe, it, expect } from 'vitest'

/**
 * Tests for rapport (action report) logic extracted from
 * server/api/admin/actions/[id]/rapport.get.ts.
 * Pure function tests — no Supabase dependency.
 */

describe('Rapport — presence stats computation', () => {
  function computePresenceStats(inscriptions: Array<{ presence: string }>) {
    const totalInscrits = inscriptions.length
    const totalPresents = inscriptions.filter(i => i.presence === 'present').length
    const totalAbsents = inscriptions.filter(i => i.presence === 'absent').length
    const totalEnAttente = inscriptions.filter(i => i.presence === 'inscrit').length

    return {
      totalInscrits,
      totalPresents,
      totalAbsents,
      totalEnAttente,
      tauxPresence: totalInscrits > 0
        ? Math.round((totalPresents / totalInscrits) * 100)
        : 0,
    }
  }

  it('computes stats for mixed presence values', () => {
    const inscriptions = [
      { presence: 'present' },
      { presence: 'present' },
      { presence: 'absent' },
      { presence: 'inscrit' },
    ]
    const stats = computePresenceStats(inscriptions)
    expect(stats).toEqual({
      totalInscrits: 4,
      totalPresents: 2,
      totalAbsents: 1,
      totalEnAttente: 1,
      tauxPresence: 50,
    })
  })

  it('handles all present', () => {
    const inscriptions = [
      { presence: 'present' },
      { presence: 'present' },
    ]
    const stats = computePresenceStats(inscriptions)
    expect(stats.tauxPresence).toBe(100)
    expect(stats.totalAbsents).toBe(0)
    expect(stats.totalEnAttente).toBe(0)
  })

  it('handles all absent', () => {
    const inscriptions = [
      { presence: 'absent' },
      { presence: 'absent' },
    ]
    const stats = computePresenceStats(inscriptions)
    expect(stats.tauxPresence).toBe(0)
    expect(stats.totalPresents).toBe(0)
  })

  it('handles empty inscriptions', () => {
    const stats = computePresenceStats([])
    expect(stats).toEqual({
      totalInscrits: 0,
      totalPresents: 0,
      totalAbsents: 0,
      totalEnAttente: 0,
      tauxPresence: 0,
    })
  })

  it('rounds taux correctly', () => {
    const inscriptions = [
      { presence: 'present' },
      { presence: 'absent' },
      { presence: 'inscrit' },
    ]
    const stats = computePresenceStats(inscriptions)
    expect(stats.tauxPresence).toBe(33)
  })
})

describe('Rapport — inscription mapping', () => {
  function mapInscription(row: Record<string, any>) {
    return {
      id: row.id,
      jeuneId: row.jeune_id,
      actionDateId: row.action_date_id,
      jeuneFirstName: row.jeunes?.first_name ?? '',
      jeuneLastName: row.jeunes?.last_name ?? '',
      jeuneSex: row.jeunes?.sex ?? '',
      jeuneSituation: row.jeunes?.situation ?? '',
      prescripteurName: row.prescripteurs?.name ?? '',
      presence: row.presence ?? 'inscrit',
      accompagnateurPresent: row.accompagnateur_present ?? false,
      nomsAccompagnateurs: row.noms_accompagnateurs ?? null,
      personneUrgenceNom: row.personne_urgence_nom ?? null,
      personneUrgenceTel: row.personne_urgence_tel ?? null,
      attestationResponsabilite: row.attestation_responsabilite ?? false,
      createdAt: row.created_at,
    }
  }

  it('maps full row correctly', () => {
    const row = {
      id: 'ins-1',
      jeune_id: 'j-1',
      action_date_id: 'ad-1',
      jeunes: { first_name: 'Alice', last_name: 'Dupont', sex: 'femme', situation: 'sans_emploi' },
      prescripteurs: { name: 'Jean Prescripteur' },
      presence: 'present',
      accompagnateur_present: true,
      noms_accompagnateurs: 'Marie',
      personne_urgence_nom: 'Paul',
      personne_urgence_tel: '0600000000',
      attestation_responsabilite: true,
      created_at: '2026-04-01T10:00:00Z',
    }

    const mapped = mapInscription(row)
    expect(mapped.jeuneFirstName).toBe('Alice')
    expect(mapped.jeuneLastName).toBe('Dupont')
    expect(mapped.jeuneSex).toBe('femme')
    expect(mapped.prescripteurName).toBe('Jean Prescripteur')
    expect(mapped.presence).toBe('present')
    expect(mapped.accompagnateurPresent).toBe(true)
    expect(mapped.attestationResponsabilite).toBe(true)
  })

  it('defaults missing jeune fields to empty strings', () => {
    const row = {
      id: 'ins-2',
      jeune_id: 'j-2',
      action_date_id: null,
      jeunes: null,
      prescripteurs: null,
      created_at: '2026-04-01T10:00:00Z',
    }

    const mapped = mapInscription(row)
    expect(mapped.jeuneFirstName).toBe('')
    expect(mapped.jeuneLastName).toBe('')
    expect(mapped.jeuneSex).toBe('')
    expect(mapped.jeuneSituation).toBe('')
    expect(mapped.prescripteurName).toBe('')
  })

  it('defaults missing presence to inscrit', () => {
    const row = {
      id: 'ins-3',
      jeune_id: 'j-3',
      action_date_id: null,
      created_at: '2026-04-01',
    }
    const mapped = mapInscription(row)
    expect(mapped.presence).toBe('inscrit')
  })

  it('defaults boolean fields to false', () => {
    const row = {
      id: 'ins-4',
      jeune_id: 'j-4',
      action_date_id: null,
      created_at: '2026-04-01',
    }
    const mapped = mapInscription(row)
    expect(mapped.accompagnateurPresent).toBe(false)
    expect(mapped.attestationResponsabilite).toBe(false)
  })

  it('defaults text fields to null', () => {
    const row = {
      id: 'ins-5',
      jeune_id: 'j-5',
      action_date_id: null,
      created_at: '2026-04-01',
    }
    const mapped = mapInscription(row)
    expect(mapped.nomsAccompagnateurs).toBeNull()
    expect(mapped.personneUrgenceNom).toBeNull()
    expect(mapped.personneUrgenceTel).toBeNull()
  })
})

describe('Rapport — action response shaping', () => {
  function buildActionResponse(action: Record<string, any>, etablissement: Record<string, any> | null) {
    return {
      id: action.id,
      title: action.title,
      category: action.category,
      date: action.date,
      time: action.time,
      summary: action.summary,
      description: action.description,
      cost: action.cost,
      isRecurring: action.is_recurring ?? false,
      etablissement,
    }
  }

  it('builds action with etablissement', () => {
    const action = {
      id: 1,
      title: 'Foodtruck',
      category: 'Cuisine',
      date: '2026-04-01',
      time: '14:00',
      summary: 'Un atelier cuisine',
      description: 'Description...',
      cost: 150.50,
      is_recurring: true,
    }
    const etab = { id: 'e-1', name: 'Centre', address: '1 rue', postalCode: '13001', city: 'Marseille' }
    const result = buildActionResponse(action, etab)

    expect(result.title).toBe('Foodtruck')
    expect(result.cost).toBe(150.50)
    expect(result.isRecurring).toBe(true)
    expect(result.etablissement).toEqual(etab)
  })

  it('builds action without etablissement', () => {
    const action = {
      id: 2,
      title: 'Fresque',
      category: 'Art',
      date: '2026-05-01',
      time: '10:00',
      summary: '',
      description: '',
      cost: null,
    }
    const result = buildActionResponse(action, null)
    expect(result.cost).toBeNull()
    expect(result.isRecurring).toBe(false)
    expect(result.etablissement).toBeNull()
  })
})

describe('Rapport — dates mapping', () => {
  function mapDates(actionDates: Array<Record<string, any>>) {
    return actionDates.map(d => ({
      id: d.id,
      date: d.date,
      time: d.time,
      placesMax: d.places_max,
    }))
  }

  it('maps action dates correctly', () => {
    const dates = [
      { id: 'ad-1', date: '2026-04-01', time: '14:00', places_max: 20 },
      { id: 'ad-2', date: '2026-04-08', time: '14:00', places_max: null },
    ]
    const result = mapDates(dates)
    expect(result).toHaveLength(2)
    expect(result[0].placesMax).toBe(20)
    expect(result[1].placesMax).toBeNull()
  })

  it('handles empty dates', () => {
    expect(mapDates([])).toEqual([])
  })
})
