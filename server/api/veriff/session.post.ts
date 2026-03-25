import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const config = useRuntimeConfig()
  const apiKey = config.veriffApiKey
  const baseUrl = config.veriffBaseUrl || 'https://stationapi.veriff.com'

  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'Veriff API key not configured' })
  }

  const body = await readBody(event)
  const { firstName, lastName } = body ?? {}

  // Create Veriff session
  const response = await $fetch<any>(`${baseUrl}/v1/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-AUTH-CLIENT': apiKey,
    },
    body: {
      verification: {
        ...(config.public.siteUrl?.startsWith('https') ? { callback: `${config.public.siteUrl}/espace` } : {}),
        person: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        },
        vendorData: user.id,
      },
    },
  })

  if (response.status !== 'success') {
    throw createError({ statusCode: 500, message: 'Erreur lors de la création de la session Veriff' })
  }

  // Store session ID in prescripteurs table
  const { createClient } = await import('@supabase/supabase-js')
  const adminClient = createClient(
    config.public.supabase.url,
    config.supabaseServiceRoleKey,
  )

  await adminClient
    .from('prescripteurs')
    .update({ veriff_session_id: response.verification.id })
    .eq('id', user.id)

  return {
    sessionUrl: response.verification.url,
    sessionId: response.verification.id,
  }
})
