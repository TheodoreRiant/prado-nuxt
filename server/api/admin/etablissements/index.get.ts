import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)

  const { data, error } = await adminClient
    .from('etablissements')
    .select('*')
    .order('name')

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return (data ?? []).map(row => ({
    id: row.id,
    name: row.name,
    address: row.address ?? null,
    postalCode: row.postal_code ?? null,
    city: row.city ?? null,
    createdAt: row.created_at,
  }))
})
