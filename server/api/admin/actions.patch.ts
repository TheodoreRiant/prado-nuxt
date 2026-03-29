import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const body = await readBody(event)
  const { id, places_max, archived_at, dates } = body ?? {}

  if (!id) {
    throw createError({ statusCode: 400, message: 'id requis' })
  }

  const updates: Record<string, unknown> = {}

  // Handle places_max update (legacy, action-level)
  if (places_max !== undefined) {
    if (places_max !== null && (typeof places_max !== 'number' || places_max < 0)) {
      throw createError({ statusCode: 400, message: 'places_max doit être un nombre positif ou null' })
    }
    updates.places_max = places_max ?? null
  }

  // Handle archived_at update
  if (archived_at !== undefined) {
    updates.archived_at = archived_at
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await adminClient
      .from('actions')
      .update(updates)
      .eq('id', id)

    if (error) throw createError({ statusCode: 500, message: error.message })
  }

  // Handle action_dates management
  if (Array.isArray(dates)) {
    for (const d of dates) {
      if (d._delete && d.id) {
        // Delete a date
        const { error } = await adminClient.from('action_dates').delete().eq('id', d.id)
        if (error) throw createError({ statusCode: 500, message: error.message })
      } else if (d.id) {
        // Update existing date
        const dateUpdates: Record<string, unknown> = {}
        if (d.date !== undefined) dateUpdates.date = d.date
        if (d.time !== undefined) dateUpdates.time = d.time
        if (d.places_max !== undefined) dateUpdates.places_max = d.places_max ?? null
        if (Object.keys(dateUpdates).length > 0) {
          const { error } = await adminClient.from('action_dates').update(dateUpdates).eq('id', d.id)
          if (error) throw createError({ statusCode: 500, message: error.message })
        }
      } else {
        // Insert new date
        if (!d.date) throw createError({ statusCode: 400, message: 'date requise pour une nouvelle session' })
        const { error } = await adminClient.from('action_dates').insert({
          action_id: id,
          date: d.date,
          time: d.time ?? '',
          places_max: d.places_max ?? null,
        })
        if (error) throw createError({ statusCode: 500, message: error.message })
      }
    }
  }

  return { success: true }
})
