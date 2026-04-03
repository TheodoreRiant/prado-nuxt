import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'
import type { User } from '@supabase/supabase-js'

/**
 * Safely get the authenticated Supabase user, returning 401 instead of 500
 * when no session exists. Use this instead of serverSupabaseUser directly.
 */
export async function requireUser(event: H3Event): Promise<User> {
  let user
  try {
    user = await serverSupabaseUser(event)
  } catch {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })
  return user
}

export async function requireAdmin(event: H3Event) {
  const user = await requireUser(event)

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
