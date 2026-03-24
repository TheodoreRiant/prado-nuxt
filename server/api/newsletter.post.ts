import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, structure, source } = body

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email requis' })
  }

  const config = useRuntimeConfig()
  const adminClient = createClient(
    config.public.supabase.url,
    config.supabaseServiceRoleKey,
  )

  const { error } = await adminClient.from('newsletter_subscribers').upsert(
    { email, structure: structure ?? null, source: source ?? 'website' },
    { onConflict: 'email' },
  )

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
