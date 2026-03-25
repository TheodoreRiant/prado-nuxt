import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const body = await readBody(event)
  const { id, places_max } = body ?? {}

  if (!id) {
    throw createError({ statusCode: 400, message: 'id requis' })
  }

  if (places_max !== null && (typeof places_max !== 'number' || places_max < 0)) {
    throw createError({ statusCode: 400, message: 'places_max doit être un nombre positif ou null' })
  }

  const { error } = await adminClient
    .from('actions')
    .update({ places_max: places_max ?? null })
    .eq('id', id)

  if (error) throw createError({ statusCode: 500, message: error.message })
  return { success: true }
})
