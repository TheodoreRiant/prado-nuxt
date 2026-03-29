import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const adminClient = createClient(
    config.public.supabase.url,
    config.supabaseServiceRoleKey,
  )

  // Try action_dates first (new schema)
  let datesData: any[] = []
  try {
    const datesRes = await adminClient.from('action_dates').select('id, action_id, places_max')
    if (!datesRes.error) {
      datesData = datesRes.data ?? []
    }
  } catch {
    // Table doesn't exist yet
  }

  if (datesData.length === 0) {
    // Fallback: use legacy actions.places_max
    const [actionsRes, inscriptionsRes] = await Promise.all([
      adminClient.from('actions').select('id, places_max'),
      adminClient.from('inscriptions').select('action_id').is('canceled_at', null),
    ])

    if (actionsRes.error) throw createError({ statusCode: 500, message: actionsRes.error.message })
    if (inscriptionsRes.error) throw createError({ statusCode: 500, message: inscriptionsRes.error.message })

    const counts = new Map<string, number>()
    for (const row of inscriptionsRes.data ?? []) {
      const key = String(row.action_id)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }

    return (actionsRes.data ?? []).map(action => {
      const placesMax = typeof action.places_max === 'number' ? action.places_max : null
      const inscriptionsCount = counts.get(String(action.id)) ?? 0
      const placesRemaining = placesMax === null ? null : Math.max(placesMax - inscriptionsCount, 0)
      return { actionId: action.id, placesMax, inscriptionsCount, placesRemaining }
    })
  }

  // New schema: per-date capacity
  const { data: inscriptionsData } = await adminClient
    .from('inscriptions')
    .select('action_date_id')
    .is('canceled_at', null)
    .not('action_date_id', 'is', null)

  const counts = new Map<string, number>()
  for (const row of inscriptionsData ?? []) {
    const key = row.action_date_id as string
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return datesData.map(d => {
    const placesMax = typeof d.places_max === 'number' ? d.places_max : null
    const inscriptionsCount = counts.get(d.id) ?? 0
    const placesRemaining = placesMax === null ? null : Math.max(placesMax - inscriptionsCount, 0)
    return { actionDateId: d.id, actionId: d.action_id, placesMax, inscriptionsCount, placesRemaining }
  })
})
