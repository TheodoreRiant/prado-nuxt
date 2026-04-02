import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const query = getQuery(event)
  const year = typeof query.year === 'string' ? query.year : String(new Date().getFullYear())

  const yearStart = `${year}-01-01`
  const yearEnd = `${year}-12-31`

  // Fetch all action_dates in the year
  const { data: actionDates, error: datesError } = await adminClient
    .from('action_dates')
    .select('action_id, date')
    .gte('date', yearStart)
    .lte('date', yearEnd)

  if (datesError) {
    throw createError({ statusCode: 500, message: datesError.message })
  }

  // Unique action IDs that have dates in the year
  const actionIdsFromDates = [...new Set((actionDates ?? []).map(d => d.action_id))]

  // Also fetch actions with a legacy date field in the year
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

  // Fetch action details for categories
  let actionDetails: Array<{ id: number; category: string }> = []
  if (allActionIds.length > 0) {
    const { data, error } = await adminClient
      .from('actions')
      .select('id, category')
      .in('id', allActionIds)
    if (error) throw createError({ statusCode: 500, message: error.message })
    actionDetails = data ?? []
  }

  // Repartition by category
  const repartitionCategorie: Record<string, number> = {}
  for (const a of actionDetails) {
    const key = a.category || 'non_categorise'
    repartitionCategorie[key] = (repartitionCategorie[key] ?? 0) + 1
  }

  // Fetch inscriptions for these actions in the year
  const { data: inscriptions, error: inscError } = await adminClient
    .from('inscriptions')
    .select('id, jeune_id, action_id, presence, created_at')
    .is('canceled_at', null)
    .gte('created_at', yearStart)
    .lte('created_at', `${yearEnd}T23:59:59`)

  if (inscError) {
    throw createError({ statusCode: 500, message: inscError.message })
  }

  const inscList = inscriptions ?? []
  const totalInscrits = inscList.length
  const totalPresents = inscList.filter(i => i.presence === 'present').length
  const tauxParticipation = totalInscrits > 0
    ? Math.round((totalPresents / totalInscrits) * 100)
    : 0

  // Taux de fidelisation: jeunes with 2+ inscriptions in the year
  const inscriptionsByJeune = new Map<string, number>()
  for (const i of inscList) {
    inscriptionsByJeune.set(i.jeune_id, (inscriptionsByJeune.get(i.jeune_id) ?? 0) + 1)
  }
  const jeunesAvecInscription = inscriptionsByJeune.size
  const jeunesFideles = [...inscriptionsByJeune.values()].filter(c => c >= 2).length
  const tauxFidelisation = jeunesAvecInscription > 0
    ? Math.round((jeunesFideles / jeunesAvecInscription) * 100)
    : 0

  return {
    year,
    totalActions: allActionIds.length,
    repartitionCategorie,
    totalInscrits,
    totalPresents,
    tauxParticipation,
    jeunesAvecInscription,
    jeunesFideles,
    tauxFidelisation,
  }
})
