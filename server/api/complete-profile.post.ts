import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Verify the user is authenticated
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const body = await readBody(event)
  const { name, structure_id, fonction, phone } = body

  if (!name || !structure_id) {
    throw createError({ statusCode: 400, message: 'Nom et structure requis' })
  }

  // Use service role to bypass RLS for insert/upsert
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

  // Check if user already exists to avoid overwriting role/status
  const { data: existing } = await adminClient
    .from('prescripteurs')
    .select('id')
    .eq('id', user.id)
    .single()

  const profileFields = {
    name,
    professional_email: user.email,
    structure: structureRow?.name ?? '',
    structure_id,
    phone: phone ?? '',
  }

  const { error } = existing
    ? await adminClient.from('prescripteurs').update(profileFields).eq('id', user.id)
    : await adminClient.from('prescripteurs').insert({
      ...profileFields,
      id: user.id,
      role: 'prescripteur',
      status: 'pending',
    })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
