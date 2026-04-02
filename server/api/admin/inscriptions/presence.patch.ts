import { requireAdmin } from '~/server/utils/admin'
import { validateBody, presenceBatchSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const body = await validateBody(event, presenceBatchSchema)

  const { inscriptionIds, presence } = body

  const { data, error } = await adminClient
    .from('inscriptions')
    .update({ presence })
    .in('id', inscriptionIds)
    .select('id, presence')

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return {
    updated: data?.length ?? 0,
    inscriptions: data ?? [],
  }
})
