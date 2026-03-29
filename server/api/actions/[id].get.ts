import { createClient } from '@supabase/supabase-js'
import { fetchActionDatesWithPlaces, isActionTermine, getNextDate, todayKey } from '~/server/utils/actionDates'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'id requis' })

  const config = useRuntimeConfig()
  const client = createClient(config.public.supabase.url, config.supabaseServiceRoleKey)

  const { data: action, error } = await client
    .from('actions')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (error || !action) throw createError({ statusCode: 404, message: 'Action introuvable' })

  // Fetch action_dates with per-date inscription counts
  const datesMap = await fetchActionDatesWithPlaces(client, [action.id])
  const dates = datesMap.get(action.id) ?? []

  const today = todayKey()

  // Total inscriptions across all dates (for backward compat)
  const totalInscriptions = dates.reduce((sum, d) => sum + d.inscriptionsCount, 0)
  // Also count inscriptions without action_date_id (legacy)
  const { count: legacyCount } = await client
    .from('inscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('action_id', id)
    .is('canceled_at', null)
  const inscriptionsCount = legacyCount ?? totalInscriptions

  const placesMax = typeof action.places_max === 'number' ? action.places_max : null
  const placesRemaining = placesMax === null ? null : Math.max(placesMax - inscriptionsCount, 0)

  return {
    ...action,
    inscriptionsCount,
    placesRemaining,
    dates: dates.map(d => ({
      id: d.id,
      actionId: d.action_id,
      date: d.date,
      time: d.time,
      placesMax: d.places_max,
      inscriptionsCount: d.inscriptionsCount,
      placesRemaining: d.placesRemaining,
    })),
    isTermine: isActionTermine(dates, today),
    nextDate: getNextDate(dates, today),
  }
})
