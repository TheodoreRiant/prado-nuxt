import { getSettings } from '~/server/utils/settings'

// Public endpoint — no auth required
// Returns only clarity toggle + project ID (non-sensitive)
export default defineEventHandler(async () => {
  const analytics = await getSettings<{
    clarityEnabled?: boolean
    clarityProjectId?: string
  }>('analytics')

  return {
    clarityEnabled: analytics.clarityEnabled ?? false,
    clarityProjectId: analytics.clarityProjectId ?? '',
  }
})
