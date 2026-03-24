import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Verify the user is authenticated
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const body = await readBody(event)
  const { name, structure, fonction, phone } = body

  if (!name || !structure) {
    throw createError({ statusCode: 400, message: 'Nom et structure requis' })
  }

  // Use service role to bypass RLS for insert/upsert
  const config = useRuntimeConfig()
  const adminClient = createClient(
    config.public.supabase.url,
    config.supabaseServiceRoleKey,
  )

  const { error } = await adminClient.from('prescripteurs').upsert({
    id: user.id,
    name,
    professional_email: user.email,
    structure,
    phone: phone ?? '',
    role: 'prescripteur',
    status: 'pending',
  }, { onConflict: 'id' })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
