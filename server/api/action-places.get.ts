import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const adminClient = createClient(
    config.public.supabase.url,
    config.supabaseServiceRoleKey,
  )

  const [actionsRes, inscriptionsRes] = await Promise.all([
    adminClient.from('actions').select('id, places_max'),
    adminClient.from('inscriptions').select('action_id').is('canceled_at', null),
  ])

  if (actionsRes.error) {
    throw createError({ statusCode: 500, message: actionsRes.error.message })
  }
  if (inscriptionsRes.error) {
    throw createError({ statusCode: 500, message: inscriptionsRes.error.message })
  }

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
})
