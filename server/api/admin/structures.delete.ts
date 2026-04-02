import { requireAdmin } from '~/server/utils/admin'
import { validateBody, structureDeleteSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const supabase = await requireAdmin(event)
  const { id } = await validateBody(event, structureDeleteSchema)

  // Check if any prescripteurs are attached
  const { count } = await supabase
    .from('prescripteurs')
    .select('*', { count: 'exact', head: true })
    .eq('structure_id', id)

  if ((count ?? 0) > 0) {
    throw createError({ statusCode: 409, message: 'Impossible de supprimer : des prescripteurs sont rattaches a cette structure' })
  }

  const { error } = await supabase
    .from('structures')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
