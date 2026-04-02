import { requireAdmin } from '~/server/utils/admin'
import { validateBody, etablissementCreateSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const body = await validateBody(event, etablissementCreateSchema)

  const { data, error } = await adminClient
    .from('etablissements')
    .insert({
      name: body.name,
      address: body.address ?? null,
      postal_code: body.postalCode ?? null,
      city: body.city ?? null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, message: 'Cet etablissement existe deja' })
    }
    throw createError({ statusCode: 500, message: error.message })
  }

  return {
    id: data.id,
    name: data.name,
    address: data.address ?? null,
    postalCode: data.postal_code ?? null,
    city: data.city ?? null,
    createdAt: data.created_at,
  }
})
