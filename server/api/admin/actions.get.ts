import { requireAdmin } from '~/server/utils/admin'
import { fetchActionDatesWithPlaces, isActionTermine, getNextDate, todayKey } from '~/server/utils/actionDates'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const query = getQuery(event)
  const showArchived = query.archived === 'true'

  let actionsQuery = adminClient.from('actions').select('*').order('id', { ascending: true })

  if (!showArchived) {
    actionsQuery = actionsQuery.is('archived_at', null)
  }

  const [actionsRes, inscriptionsRes] = await Promise.all([
    actionsQuery,
    adminClient.from('inscriptions').select('action_id').is('canceled_at', null),
  ])

  if (actionsRes.error) throw createError({ statusCode: 500, message: actionsRes.error.message })
  if (inscriptionsRes.error) throw createError({ statusCode: 500, message: inscriptionsRes.error.message })

  const counts = new Map<number, number>()
  for (const row of inscriptionsRes.data ?? []) {
    const id = Number(row.action_id)
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }

  const actionIds = (actionsRes.data ?? []).map(a => a.id)
  const datesMap = await fetchActionDatesWithPlaces(adminClient, actionIds)
  const today = todayKey()

  return (actionsRes.data ?? []).map(action => {
    const dates = datesMap.get(action.id) ?? []
    const placesMax = typeof action.places_max === 'number' ? action.places_max : null
    const inscriptionsCount = counts.get(action.id) ?? 0
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
