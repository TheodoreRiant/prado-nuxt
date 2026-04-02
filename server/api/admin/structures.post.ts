import { requireAdmin } from '~/server/utils/admin'
import { validateBody, structureCreateSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const supabase = await requireAdmin(event)
  const body = await validateBody(event, structureCreateSchema)

  const insertData: Record<string, unknown> = { name: body.name }
  if (body.is_prado !== undefined) insertData.is_prado = body.is_prado
  if (body.type !== undefined) insertData.type = body.type
  if (body.postal_code !== undefined) insertData.postal_code = body.postal_code
  if (body.city !== undefined) insertData.city = body.city

  const { data, error } = await supabase
    .from('structures')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, message: 'Cette structure existe deja' })
    }
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
