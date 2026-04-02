import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'id requis' })
  }

  // Check if actions reference this etablissement
  const { count } = await adminClient
    .from('actions')
    .select('*', { count: 'exact', head: true })
    .eq('etablissement_id', id)

  if ((count ?? 0) > 0) {
    throw createError({
      statusCode: 409,
      message: 'Impossible de supprimer : des actions sont rattachees a cet etablissement',
    })
  }

  const { error } = await adminClient
    .from('etablissements')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
