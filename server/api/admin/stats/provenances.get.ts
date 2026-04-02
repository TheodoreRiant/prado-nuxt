import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const query = getQuery(event)
  const year = typeof query.year === 'string' ? query.year : String(new Date().getFullYear())

  const yearStart = `${year}-01-01`
  const yearEnd = `${year}-12-31`

  // Get jeune IDs with inscriptions in the year
  const { data: inscriptions, error: inscError } = await adminClient
    .from('inscriptions')
    .select('jeune_id')
    .is('canceled_at', null)
    .gte('created_at', yearStart)
    .lte('created_at', `${yearEnd}T23:59:59`)

  if (inscError) {
    throw createError({ statusCode: 500, message: inscError.message })
  }

  const jeuneIds = [...new Set((inscriptions ?? []).map(i => i.jeune_id))]

  if (jeuneIds.length === 0) {
    return {
      year,
      repartitionCodePostal: {},
      repartitionStructure: {},
      repartitionAccompagnement: {},
    }
  }

  // Fetch jeunes with structure info
  const { data: jeunes, error: jeunesError } = await adminClient
    .from('jeunes')
    .select('id, structure_id, accompagnement_type')
    .in('id', jeuneIds)

  if (jeunesError) {
    throw createError({ statusCode: 500, message: jeunesError.message })
  }

  // Fetch structures
  const { data: structures } = await adminClient
    .from('structures')
    .select('id, name, postal_code')

  const structureMap = new Map<string, { name: string; postalCode: string | null }>()
  for (const s of structures ?? []) {
    structureMap.set(s.id, { name: s.name, postalCode: s.postal_code ?? null })
  }

  const jeunesList = jeunes ?? []

  // Repartition by postal code (from structure)
  const repartitionCodePostal: Record<string, number> = {}
  for (const j of jeunesList) {
    const structure = j.structure_id ? structureMap.get(j.structure_id) : null
    const key = structure?.postalCode || 'non_renseigne'
    repartitionCodePostal[key] = (repartitionCodePostal[key] ?? 0) + 1
  }

  // Repartition by structure
  const repartitionStructure: Record<string, number> = {}
  for (const j of jeunesList) {
    const structure = j.structure_id ? structureMap.get(j.structure_id) : null
    const key = structure?.name || 'non_rattache'
    repartitionStructure[key] = (repartitionStructure[key] ?? 0) + 1
  }

  // Repartition by accompagnement type
  const repartitionAccompagnement: Record<string, number> = {}
  for (const j of jeunesList) {
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
    year,
    repartitionCodePostal,
    repartitionStructure,
    repartitionAccompagnement,
  }
})
