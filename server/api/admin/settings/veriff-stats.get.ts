import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)

  // Count verified jeunes
  const { count: verified } = await adminClient
    .from('jeunes')
    .select('*', { count: 'exact', head: true })
    .eq('identity_verified', true)

  // Count pending (session started but not verified)
  const { count: pending } = await adminClient
    .from('jeunes')
    .select('*', { count: 'exact', head: true })
    .not('veriff_session_id', 'is', null)
    .eq('identity_verified', false)

  // Count unverified (no session)
  const { count: unverified } = await adminClient
    .from('jeunes')
    .select('*', { count: 'exact', head: true })
    .is('veriff_session_id', null)

  // Test Veriff connection
  let connectionOk = false
  const config = useRuntimeConfig()
  if (config.veriffApiKey) {
    try {
      const res = await fetch(`${config.veriffBaseUrl}/v1/sessions`, {
        method: 'HEAD',
        headers: { 'X-AUTH-CLIENT': config.veriffApiKey },
      })
      connectionOk = res.status !== 401
    } catch {
      connectionOk = false
    }
  }

  return {
    verified: verified ?? 0,
    pending: pending ?? 0,
    unverified: unverified ?? 0,
    connectionOk,
  }
})
