import { createClient } from '@supabase/supabase-js'
import { syncToMailchimp } from '~/server/utils/mailchimp'

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event)
  if (!token || typeof token !== 'string') {
    throw createError({ statusCode: 400, message: 'Token manquant' })
  }

  const config = useRuntimeConfig()
  const adminClient = createClient(config.public.supabase.url, config.supabaseServiceRoleKey)

  const { data: subscriber, error } = await adminClient
    .from('newsletter_subscribers')
    .select('email, structure, confirmed_at')
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

    // Auto-sync to Mailchimp on confirmation (non-blocking)
    syncToMailchimp(
      subscriber.email,
      undefined,
      undefined,
      subscriber.structure ?? undefined,
    ).catch(() => {
      // Silent — Mailchimp sync is non-critical
    })
  }

  return sendRedirect(event, '/?newsletter=confirmed', 302)
})
