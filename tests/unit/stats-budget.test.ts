import { describe, it, expect } from 'vitest'

/**
 * Tests for budget computation logic extracted from server/api/admin/stats/budget.get.ts.
 * Pure function tests — no Supabase dependency.
 */

interface ActionCost {
  id: number
  cost: number | null
  etablissement_id: string | null
}

function computeBudgetStats(
  actions: ActionCost[],
  etabMap: Map<string, string>,
) {
  let totalBudget = 0
  const ventilationParStructure: Record<string, number> = {}

  for (const a of actions) {
    const cost = typeof a.cost === 'number' ? a.cost : 0
    totalBudget += cost

    const etabName = a.etablissement_id ? (etabMap.get(a.etablissement_id) ?? 'inconnu') : 'non_rattache'
    ventilationParStructure[etabName] = (ventilationParStructure[etabName] ?? 0) + cost
  }

  const coutMoyenParAction = actions.length > 0
    ? Math.round((totalBudget / actions.length) * 100) / 100
    : 0

  return {
    totalBudget: Math.round(totalBudget * 100) / 100,
    coutMoyenParAction,
    ventilationParStructure,
    totalActions: actions.length,
  }
}

describe('computeBudgetStats', () => {
  const etabMap = new Map<string, string>([
    ['etab-1', 'Centre Social Nord'],
    ['etab-2', 'Centre Social Sud'],
  ])

  it('returns zeros for empty actions list', () => {
    const result = computeBudgetStats([], etabMap)
    expect(result).toEqual({
      totalBudget: 0,
      coutMoyenParAction: 0,
      ventilationParStructure: {},
      totalActions: 0,
    })
  })

  it('computes total budget from action costs', () => {
    const actions: ActionCost[] = [
      { id: 1, cost: 100, etablissement_id: null },
      { id: 2, cost: 200, etablissement_id: null },
    ]
    const result = computeBudgetStats(actions, etabMap)
    expect(result.totalBudget).toBe(300)
  })

  it('treats null cost as 0', () => {
    const actions: ActionCost[] = [
      { id: 1, cost: null, etablissement_id: null },
      { id: 2, cost: 150, etablissement_id: null },
    ]
    const result = computeBudgetStats(actions, etabMap)
    expect(result.totalBudget).toBe(150)
  })

  it('computes average cost per action', () => {
    const actions: ActionCost[] = [
      { id: 1, cost: 100, etablissement_id: null },
      { id: 2, cost: 200, etablissement_id: null },
      { id: 3, cost: 300, etablissement_id: null },
    ]
    const result = computeBudgetStats(actions, etabMap)
    expect(result.coutMoyenParAction).toBe(200)
  })

  it('rounds average cost to 2 decimal places', () => {
    const actions: ActionCost[] = [
      { id: 1, cost: 100, etablissement_id: null },
      { id: 2, cost: 50, etablissement_id: null },
      { id: 3, cost: 33, etablissement_id: null },
    ]
    const result = computeBudgetStats(actions, etabMap)
    // (183 / 3) = 61
    expect(result.coutMoyenParAction).toBe(61)
  })

  it('groups costs by etablissement name', () => {
    const actions: ActionCost[] = [
      { id: 1, cost: 100, etablissement_id: 'etab-1' },
      { id: 2, cost: 200, etablissement_id: 'etab-1' },
      { id: 3, cost: 150, etablissement_id: 'etab-2' },
    ]
    const result = computeBudgetStats(actions, etabMap)
    expect(result.ventilationParStructure).toEqual({
      'Centre Social Nord': 300,
      'Centre Social Sud': 150,
    })
  })

  it('uses "non_rattache" for actions without etablissement', () => {
    const actions: ActionCost[] = [
      { id: 1, cost: 100, etablissement_id: null },
    ]
    const result = computeBudgetStats(actions, etabMap)
    expect(result.ventilationParStructure).toEqual({
      non_rattache: 100,
    })
  })

  it('uses "inconnu" for unknown etablissement_id', () => {
    const actions: ActionCost[] = [
      { id: 1, cost: 100, etablissement_id: 'etab-unknown' },
    ]
    const result = computeBudgetStats(actions, etabMap)
    expect(result.ventilationParStructure).toEqual({
      inconnu: 100,
    })
  })

  it('handles mixed rattache and non_rattache', () => {
    const actions: ActionCost[] = [
      { id: 1, cost: 100, etablissement_id: 'etab-1' },
      { id: 2, cost: 50, etablissement_id: null },
      { id: 3, cost: 75, etablissement_id: 'etab-2' },
    ]
    const result = computeBudgetStats(actions, etabMap)
    expect(result.ventilationParStructure).toEqual({
      'Centre Social Nord': 100,
      non_rattache: 50,
      'Centre Social Sud': 75,
    })
    expect(result.totalBudget).toBe(225)
    expect(result.totalActions).toBe(3)
  })

  it('handles decimal costs with precision', () => {
    const actions: ActionCost[] = [
      { id: 1, cost: 10.55, etablissement_id: null },
      { id: 2, cost: 20.30, etablissement_id: null },
    ]
    const result = computeBudgetStats(actions, etabMap)
    expect(result.totalBudget).toBe(30.85)
  })
})
