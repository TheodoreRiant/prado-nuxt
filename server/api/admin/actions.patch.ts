import { requireAdmin } from '~/server/utils/admin'
import { validateBody, actionPatchSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const { id, places_max, archived_at, dates, cost, is_recurring, etablissement_id } = await validateBody(event, actionPatchSchema)

  const updates: Record<string, unknown> = {}

  // Handle places_max update (legacy, action-level)
  if (places_max !== undefined) {
    updates.places_max = places_max ?? null
  }

  // Handle archived_at update
  if (archived_at !== undefined) {
    updates.archived_at = archived_at
  }

  // Handle new Sprint 2 fields
  if (cost !== undefined) {
    updates.cost = cost
  }
  if (is_recurring !== undefined) {
    updates.is_recurring = is_recurring
  }
  if (etablissement_id !== undefined) {
    updates.etablissement_id = etablissement_id
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
