import { requireAdmin } from '~/server/utils/admin'
import { validateBody, prescripteurPatchSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const { id, status, role } = await validateBody(event, prescripteurPatchSchema)

  const updates: Record<string, unknown> = {}
  if (status !== undefined) updates.status = status
  if (role !== undefined) updates.role = role

  const { error } = await adminClient
    .from('prescripteurs')
    .update(updates)
    .eq('id', id)

  if (error) throw createError({ statusCode: 500, message: error.message })
  return { success: true }
})
