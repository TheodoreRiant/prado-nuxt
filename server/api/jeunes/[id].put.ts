import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'
import { validateBody, jeuneUpdateSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Non authentifie' })
  }

  const jeuneId = getRouterParam(event, 'id')
  if (!jeuneId) {
    throw createError({ statusCode: 400, message: 'id requis' })
  }

  const body = await validateBody(event, jeuneUpdateSchema)

  const config = useRuntimeConfig()
  const adminClient = createClient(
    config.public.supabase.url,
    config.supabaseServiceRoleKey,
  )

  // Verify ownership (by structure or admin)
  const { data: jeune } = await adminClient
    .from('jeunes')
    .select('prescripteur_id, structure_id')
    .eq('id', jeuneId)
    .single()

  if (!jeune) {
    throw createError({ statusCode: 404, message: 'Jeune introuvable' })
  }

  const { data: prescripteur } = await adminClient
    .from('prescripteurs')
    .select('role, structure_id')
    .eq('id', user.id)
    .single()

  const sameStructure = prescripteur?.structure_id && jeune.structure_id && prescripteur.structure_id === jeune.structure_id
  if (!sameStructure && prescripteur?.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Acces refuse' })
  }

  // Build safe update object (only known fields)
  const updates: Record<string, unknown> = {}
  if (body.firstName !== undefined) updates.first_name = body.firstName
  if (body.lastName !== undefined) updates.last_name = body.lastName
  if (body.dateOfBirth !== undefined) updates.date_of_birth = body.dateOfBirth
  if (body.situation !== undefined) updates.situation = body.situation
  if (body.notes !== undefined) updates.notes = body.notes
  if (body.sex !== undefined) updates.sex = body.sex
  if (body.isQpv !== undefined) updates.is_qpv = body.isQpv
  if (body.accompagnementType !== undefined) updates.accompagnement_type = body.accompagnementType

  const { data: row, error } = await adminClient
    .from('jeunes')
    .update(updates)
    .eq('id', jeuneId)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return row
})
