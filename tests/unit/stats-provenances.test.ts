import { describe, it, expect } from 'vitest'

/**
 * Tests for provenance/repartition logic from server/api/admin/stats/provenances.get.ts.
 * Pure function tests — no Supabase dependency.
 */

interface JeuneProvenance {
  id: string
  structure_id: string | null
  accompagnement_type: string[] | null
}

interface StructureInfo {
  name: string
  postalCode: string | null
}

function computeProvenances(
  jeunes: JeuneProvenance[],
  structureMap: Map<string, StructureInfo>,
) {
  const repartitionCodePostal: Record<string, number> = {}
  const repartitionStructure: Record<string, number> = {}
  const repartitionAccompagnement: Record<string, number> = {}

  for (const j of jeunes) {
    const structure = j.structure_id ? structureMap.get(j.structure_id) ?? null : null

    // Postal code
    const cpKey = structure?.postalCode || 'non_renseigne'
    repartitionCodePostal[cpKey] = (repartitionCodePostal[cpKey] ?? 0) + 1

    // Structure
    const structKey = structure?.name || 'non_rattache'
    repartitionStructure[structKey] = (repartitionStructure[structKey] ?? 0) + 1

    // Accompagnement type
    const types = Array.isArray(j.accompagnement_type) ? j.accompagnement_type : []
    if (types.length === 0) {
      repartitionAccompagnement['non_renseigne'] = (repartitionAccompagnement['non_renseigne'] ?? 0) + 1
    } else {
      for (const t of types) {
        repartitionAccompagnement[t] = (repartitionAccompagnement[t] ?? 0) + 1
      }
    }
  }

  return {
    repartitionCodePostal,
    repartitionStructure,
    repartitionAccompagnement,
  }
}

describe('computeProvenances', () => {
  const structureMap = new Map<string, StructureInfo>([
    ['s-1', { name: 'Centre Nord', postalCode: '13001' }],
    ['s-2', { name: 'Centre Sud', postalCode: '13008' }],
    ['s-3', { name: 'Centre Est', postalCode: null }],
  ])

  it('returns empty objects for empty jeunes list', () => {
    const result = computeProvenances([], structureMap)
    expect(result.repartitionCodePostal).toEqual({})
    expect(result.repartitionStructure).toEqual({})
    expect(result.repartitionAccompagnement).toEqual({})
  })

  it('groups by postal code from structure', () => {
    const jeunes: JeuneProvenance[] = [
      { id: 'j1', structure_id: 's-1', accompagnement_type: [] },
      { id: 'j2', structure_id: 's-1', accompagnement_type: [] },
      { id: 'j3', structure_id: 's-2', accompagnement_type: [] },
    ]
    const result = computeProvenances(jeunes, structureMap)
    expect(result.repartitionCodePostal).toEqual({
      '13001': 2,
      '13008': 1,
    })
  })

  it('uses "non_renseigne" when structure has no postal code', () => {
    const jeunes: JeuneProvenance[] = [
      { id: 'j1', structure_id: 's-3', accompagnement_type: [] },
    ]
    const result = computeProvenances(jeunes, structureMap)
    expect(result.repartitionCodePostal).toEqual({ non_renseigne: 1 })
  })

  it('uses "non_renseigne" when jeune has no structure', () => {
    const jeunes: JeuneProvenance[] = [
      { id: 'j1', structure_id: null, accompagnement_type: [] },
    ]
    const result = computeProvenances(jeunes, structureMap)
    expect(result.repartitionCodePostal).toEqual({ non_renseigne: 1 })
  })

  it('groups by structure name', () => {
    const jeunes: JeuneProvenance[] = [
      { id: 'j1', structure_id: 's-1', accompagnement_type: [] },
      { id: 'j2', structure_id: 's-2', accompagnement_type: [] },
      { id: 'j3', structure_id: 's-2', accompagnement_type: [] },
    ]
    const result = computeProvenances(jeunes, structureMap)
    expect(result.repartitionStructure).toEqual({
      'Centre Nord': 1,
      'Centre Sud': 2,
    })
  })

  it('uses "non_rattache" for jeunes without structure', () => {
    const jeunes: JeuneProvenance[] = [
      { id: 'j1', structure_id: null, accompagnement_type: [] },
    ]
    const result = computeProvenances(jeunes, structureMap)
    expect(result.repartitionStructure).toEqual({ non_rattache: 1 })
  })

  it('uses "non_rattache" for unknown structure_id', () => {
    const jeunes: JeuneProvenance[] = [
      { id: 'j1', structure_id: 's-unknown', accompagnement_type: [] },
    ]
    const result = computeProvenances(jeunes, structureMap)
    expect(result.repartitionStructure).toEqual({ non_rattache: 1 })
  })

  it('counts accompagnement types', () => {
    const jeunes: JeuneProvenance[] = [
      { id: 'j1', structure_id: null, accompagnement_type: ['educatif', 'social'] },
      { id: 'j2', structure_id: null, accompagnement_type: ['educatif'] },
    ]
    const result = computeProvenances(jeunes, structureMap)
    expect(result.repartitionAccompagnement).toEqual({
      educatif: 2,
      social: 1,
    })
  })

  it('uses "non_renseigne" for empty accompagnement_type', () => {
    const jeunes: JeuneProvenance[] = [
      { id: 'j1', structure_id: null, accompagnement_type: [] },
    ]
    const result = computeProvenances(jeunes, structureMap)
    expect(result.repartitionAccompagnement).toEqual({ non_renseigne: 1 })
  })

  it('uses "non_renseigne" for null accompagnement_type', () => {
    const jeunes: JeuneProvenance[] = [
      { id: 'j1', structure_id: null, accompagnement_type: null },
    ]
    const result = computeProvenances(jeunes, structureMap)
    expect(result.repartitionAccompagnement).toEqual({ non_renseigne: 1 })
  })

  it('handles mixed scenario', () => {
    const jeunes: JeuneProvenance[] = [
      { id: 'j1', structure_id: 's-1', accompagnement_type: ['educatif'] },
      { id: 'j2', structure_id: 's-1', accompagnement_type: null },
      { id: 'j3', structure_id: null, accompagnement_type: ['social', 'educatif'] },
      { id: 'j4', structure_id: 's-2', accompagnement_type: [] },
    ]
    const result = computeProvenances(jeunes, structureMap)

    expect(result.repartitionCodePostal).toEqual({
      '13001': 2,
      non_renseigne: 1,
      '13008': 1,
    })
    expect(result.repartitionStructure).toEqual({
      'Centre Nord': 2,
      non_rattache: 1,
      'Centre Sud': 1,
    })
    expect(result.repartitionAccompagnement).toEqual({
      educatif: 2,
      non_renseigne: 2,
      social: 1,
    })
  })
})
