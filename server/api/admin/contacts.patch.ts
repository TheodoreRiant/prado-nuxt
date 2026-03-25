import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const body = await readBody(event)
  const { id, is_read } = body ?? {}

  if (!id || typeof is_read !== 'boolean') {
    throw createError({ statusCode: 400, message: 'id et is_read requis' })
  }

  const { error } = await adminClient
    .from('contact_messages')
    .update({ is_read })
    .eq('id', id)

  if (error) throw createError({ statusCode: 500, message: error.message })
  return { success: true }
})
