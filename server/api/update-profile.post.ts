import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const body = await readBody(event)
  const { name, structure_id, fonction, phone } = body

  if (!name || !structure_id) {
    throw createError({ statusCode: 400, message: 'Nom et structure requis' })
  }

  const config = useRuntimeConfig()
  const adminClient = createClient(
    config.public.supabase.url,
    config.supabaseServiceRoleKey,
  )

  // Resolve structure name for backwards compatibility
  const { data: structureRow } = await adminClient
    .from('structures')
    .select('name')
    .eq('id', structure_id)
    .single()

  const structureName = structureRow?.name ?? ''

  // Update prescripteurs table
  const { error } = await adminClient
    .from('prescripteurs')
    .update({ name, structure: structureName, structure_id, phone: phone ?? '' })
    .eq('id', user.id)

  if (error) {
    throw createError({ statusCode: 500, message: 'Erreur lors de la mise a jour du profil' })
  }

  // Update user metadata
  await adminClient.auth.admin.updateUserById(user.id, {
    user_metadata: { name, structure: structureName, fonction: fonction ?? '', phone: phone ?? '' },
  })

  return { success: true }
})
