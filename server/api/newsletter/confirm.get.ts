import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event)
  if (!token || typeof token !== 'string') {
    throw createError({ statusCode: 400, message: 'Token manquant' })
  }

  const config = useRuntimeConfig()
  const adminClient = createClient(config.public.supabase.url, config.supabaseServiceRoleKey)

  const { data: subscriber, error } = await adminClient
    .from('newsletter_subscribers')
    .select('confirmed_at')
    .eq('confirmation_token', token)
    .single()

  if (error || !subscriber) {
    throw createError({ statusCode: 404, message: 'Token invalide' })
  }

  if (!subscriber.confirmed_at) {
    await adminClient
      .from('newsletter_subscribers')
      .update({ confirmed_at: new Date().toISOString() })
      .eq('confirmation_token', token)
  }

  return sendRedirect(event, '/?newsletter=confirmed', 302)
})
