import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, message } = body

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, message: 'Tous les champs sont requis' })
  }

  const config = useRuntimeConfig()
  const adminClient = createClient(
    config.public.supabase.url,
    config.supabaseServiceRoleKey,
  )

  const { error } = await adminClient.from('contact_messages').insert({
    name,
    email,
    message,
  })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
