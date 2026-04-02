import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const query = getQuery(event)
  const year = typeof query.year === 'string' ? query.year : String(new Date().getFullYear())

  const yearStart = `${year}-01-01`
  const yearEnd = `${year}-12-31`

  // Get all inscriptions in the year to identify active jeunes
  const { data: inscriptions, error: inscError } = await adminClient
    .from('inscriptions')
    .select('jeune_id, created_at')
    .is('canceled_at', null)
    .gte('created_at', yearStart)
    .lte('created_at', `${yearEnd}T23:59:59`)

  if (inscError) {
    throw createError({ statusCode: 500, message: inscError.message })
  }

  // Unique jeune IDs with at least one inscription in the year
  const jeuneIds = [...new Set((inscriptions ?? []).map(i => i.jeune_id))]

  if (jeuneIds.length === 0) {
    return {
      year,
      totalJeunes: 0,
      ageMedian: null,
      repartitionSexe: {},
      repartitionSituation: {},
    }
  }

  // Fetch jeune details for those active jeunes
  const { data: jeunes, error: jeunesError } = await adminClient
    .from('jeunes')
    .select('id, date_of_birth, sex, situation')
    .in('id', jeuneIds)

  if (jeunesError) {
    throw createError({ statusCode: 500, message: jeunesError.message })
  }

  const jeunesList = jeunes ?? []

  // Compute age median
  const today = new Date()
  const ages = jeunesList
    .map(j => {
      if (!j.date_of_birth) return null
      const birth = new Date(j.date_of_birth)
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      return age
    })
    .filter((a): a is number => a !== null)
    .sort((a, b) => a - b)

  const ageMedian = ages.length > 0
    ? ages.length % 2 === 0
      ? (ages[ages.length / 2 - 1] + ages[ages.length / 2]) / 2
      : ages[Math.floor(ages.length / 2)]
    : null

  // Repartition by sex
  const repartitionSexe: Record<string, number> = {}
  for (const j of jeunesList) {
    const key = j.sex || 'non_renseigne'
    repartitionSexe[key] = (repartitionSexe[key] ?? 0) + 1
  }

  // Repartition by situation
  const repartitionSituation: Record<string, number> = {}
  for (const j of jeunesList) {
    const key = j.situation || 'non_renseigne'
    repartitionSituation[key] = (repartitionSituation[key] ?? 0) + 1
  }

  return {
    year,
    totalJeunes: jeunesList.length,
    ageMedian,
    repartitionSexe,
    repartitionSituation,
  }
})
