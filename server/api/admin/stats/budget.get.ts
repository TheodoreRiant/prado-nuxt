import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const query = getQuery(event)
  const year = typeof query.year === 'string' ? query.year : String(new Date().getFullYear())

  const yearStart = `${year}-01-01`
  const yearEnd = `${year}-12-31`

  // Fetch action_dates in the year to identify relevant actions
  const { data: actionDates, error: datesError } = await adminClient
    .from('action_dates')
    .select('action_id')
    .gte('date', yearStart)
    .lte('date', yearEnd)

  if (datesError) {
    throw createError({ statusCode: 500, message: datesError.message })
  }

  const actionIdsFromDates = [...new Set((actionDates ?? []).map(d => d.action_id))]

  // Also get actions with legacy date in the year
  const { data: legacyActions, error: legacyError } = await adminClient
    .from('actions')
    .select('id')
    .gte('date', yearStart)
    .lte('date', yearEnd)

  if (legacyError) {
    throw createError({ statusCode: 500, message: legacyError.message })
  }

  const allActionIds = [...new Set([
    ...actionIdsFromDates,
    ...(legacyActions ?? []).map(a => a.id),
  ])]

  if (allActionIds.length === 0) {
    return {
      year,
      totalBudget: 0,
      coutMoyenParAction: 0,
      ventilationParStructure: {},
      totalActions: 0,
    }
  }

  // Fetch actions with cost and etablissement
  const { data: actions, error: actionsError } = await adminClient
    .from('actions')
    .select('id, cost, etablissement_id')
    .in('id', allActionIds)

  if (actionsError) {
    throw createError({ statusCode: 500, message: actionsError.message })
  }

  const actionsList = actions ?? []

  // Fetch etablissements for labeling
  const { data: etablissements } = await adminClient
    .from('etablissements')
    .select('id, name')

  const etabMap = new Map<string, string>()
  for (const e of etablissements ?? []) {
    etabMap.set(e.id, e.name)
  }

  // Compute budget
  let totalBudget = 0
  const ventilationParStructure: Record<string, number> = {}

  for (const a of actionsList) {
    const cost = typeof a.cost === 'number' ? a.cost : 0
    totalBudget += cost

    const etabName = a.etablissement_id ? (etabMap.get(a.etablissement_id) ?? 'inconnu') : 'non_rattache'
    ventilationParStructure[etabName] = (ventilationParStructure[etabName] ?? 0) + cost
  }

  const coutMoyenParAction = actionsList.length > 0
    ? Math.round((totalBudget / actionsList.length) * 100) / 100
    : 0

  return {
    year,
    totalBudget: Math.round(totalBudget * 100) / 100,
    coutMoyenParAction,
    ventilationParStructure,
    totalActions: actionsList.length,
  }
})
