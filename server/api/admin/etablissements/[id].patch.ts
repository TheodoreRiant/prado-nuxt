import { requireAdmin } from '~/server/utils/admin'
import { validateBody, etablissementUpdateSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'id requis' })
  }

  const body = await validateBody(event, etablissementUpdateSchema)

  const updates: Record<string, unknown> = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.address !== undefined) updates.address = body.address
  if (body.postalCode !== undefined) updates.postal_code = body.postalCode
  if (body.city !== undefined) updates.city = body.city

  const { data, error } = await adminClient
    .from('etablissements')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, message: 'Ce nom d\'etablissement existe deja' })
    }
    if (error.code === 'PGRST116') {
      throw createError({ statusCode: 404, message: 'Etablissement introuvable' })
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
