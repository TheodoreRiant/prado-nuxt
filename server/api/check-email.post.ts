import { createClient } from '@supabase/supabase-js'
import { validateBody, checkEmailSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const { email } = await validateBody(event, checkEmailSchema)

  const config = useRuntimeConfig()
  const adminClient = createClient(config.public.supabase.url, config.supabaseServiceRoleKey)

  // Query prescripteurs table (linked to auth.users) by email
  const { data } = await adminClient
    .from('prescripteurs')
    .select('id')
    .eq('professional_email', email.toLowerCase())
    .limit(1)
    .maybeSingle()

  return { exists: !!data }
})
