import { requireAdmin } from '~/server/utils/admin'
import { validateBody, contactPatchSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const { id, is_read } = await validateBody(event, contactPatchSchema)

  const { error } = await adminClient
    .from('contact_messages')
    .update({ is_read })
    .eq('id', id)

  if (error) throw createError({ statusCode: 500, message: error.message })
  return { success: true }
})
