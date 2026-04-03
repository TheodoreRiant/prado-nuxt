import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const supabase = await requireAdmin(event)

  // Fetch structures with counts
  const { data: structures, error } = await supabase
    .from('structures')
    .select('id, name, is_prado, type, postal_code, city, created_at')
    .order('name')

  if (error) throw createError({ statusCode: 500, message: error.message })

  // Get prescripteur and jeune counts per structure
  const [prescripteursResult, jeunesResult] = await Promise.all([
    supabase.from('prescripteurs').select('structure_id'),
    supabase.from('jeunes').select('structure_id'),
  ])

  const prescripteurCounts = new Map<string, number>()
  for (const row of prescripteursResult.data ?? []) {
    if (row.structure_id) {
      prescripteurCounts.set(row.structure_id, (prescripteurCounts.get(row.structure_id) ?? 0) + 1)
    }
  }

  const jeuneCounts = new Map<string, number>()
  for (const row of jeunesResult.data ?? []) {
    if (row.structure_id) {
      jeuneCounts.set(row.structure_id, (jeuneCounts.get(row.structure_id) ?? 0) + 1)
    }
  }

  return (structures ?? []).map(s => ({
    id: s.id,
    name: s.name,
    is_prado: s.is_prado ?? false,
    type: s.type ?? null,
    postal_code: s.postal_code ?? null,
    city: s.city ?? null,
    created_at: s.created_at,
    prescripteurs_count: prescripteurCounts.get(s.id) ?? 0,
    jeunes_count: jeuneCounts.get(s.id) ?? 0,
  }))
})
