import { requireAdmin } from '~/server/utils/admin'
import { validateBody, actionDuplicateSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const { sourceId } = await validateBody(event, actionDuplicateSchema)

  // Fetch the source action
  const { data: source, error: fetchError } = await adminClient
    .from('actions')
    .select('*')
    .eq('id', sourceId)
    .single()

  if (fetchError || !source) {
    throw createError({ statusCode: 404, message: 'Action source introuvable' })
  }

  // Clone the action with a new title, unpublished by default
  const { id: _id, created_at: _created, ...rest } = source
  const { data: cloned, error: insertError } = await adminClient
    .from('actions')
    .insert({
      ...rest,
      title: `${source.title} (copie)`,
      is_published: false,
    })
    .select()
    .single()

  if (insertError) throw createError({ statusCode: 500, message: insertError.message })

  // Duplicate action_dates from the source
  const { data: sourceDates } = await adminClient
    .from('action_dates')
    .select('date, time, places_max')
    .eq('action_id', sourceId)

  if (sourceDates && sourceDates.length > 0) {
    const newDates = sourceDates.map(d => ({
      action_id: cloned.id,
      date: d.date,
      time: d.time ?? '',
      places_max: d.places_max,
    }))
    await adminClient.from('action_dates').insert(newDates)
  }

  return cloned
})
