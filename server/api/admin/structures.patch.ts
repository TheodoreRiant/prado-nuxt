import { requireAdmin } from '~/server/utils/admin'
import { validateBody, structurePatchSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const supabase = await requireAdmin(event)
  const body = await validateBody(event, structurePatchSchema)

  const updates: Record<string, unknown> = { name: body.name }
  if (body.is_prado !== undefined) updates.is_prado = body.is_prado
  if (body.type !== undefined) updates.type = body.type
  if (body.postal_code !== undefined) updates.postal_code = body.postal_code
  if (body.city !== undefined) updates.city = body.city

  const { data, error } = await supabase
    .from('structures')
    .update(updates)
    .eq('id', body.id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, message: 'Ce nom de structure existe deja' })
    }
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
