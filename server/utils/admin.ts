import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'

export async function requireAdmin(event: H3Event) {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const config = useRuntimeConfig()
  const adminClient = createClient(config.public.supabase.url, config.supabaseServiceRoleKey)

  const { data: prescripteur } = await adminClient
    .from('prescripteurs')
    .select('role')
    .eq('id', user.id)
    .single()

  if (prescripteur?.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Accès refusé' })
  }

  return adminClient
}
