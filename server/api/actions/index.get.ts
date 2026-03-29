import { createClient } from '@supabase/supabase-js'
import { fetchActionDatesWithPlaces, isActionTermine, getNextDate, todayKey } from '~/server/utils/actionDates'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const client = createClient(config.public.supabase.url, config.supabaseServiceRoleKey)

  const { data: actions, error: actionsError } = await client
    .from('actions')
    .select('*')
    .eq('is_published', true)
    .is('archived_at', null)
    .order('id', { ascending: true })

  if (actionsError) throw createError({ statusCode: 500, message: actionsError.message })

  const actionIds = (actions ?? []).map(a => a.id)
  const datesMap = await fetchActionDatesWithPlaces(client, actionIds)
  const today = todayKey()

  // Also count all inscriptions per action (including legacy without action_date_id)
  const { data: inscData, error: inscError } = await client
    .from('inscriptions')
    .select('action_id')
    .is('canceled_at', null)

  if (inscError) throw createError({ statusCode: 500, message: inscError.message })

  const countsByAction = new Map<number, number>()
  for (const row of inscData ?? []) {
    const id = Number(row.action_id)
    countsByAction.set(id, (countsByAction.get(id) ?? 0) + 1)
  }

  return (actions ?? []).map(action => {
    const dates = datesMap.get(action.id) ?? []
    const placesMax = typeof action.places_max === 'number' ? action.places_max : null
    const inscriptionsCount = countsByAction.get(action.id) ?? 0
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
})
