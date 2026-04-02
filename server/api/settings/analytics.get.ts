import { getSettings } from '~/server/utils/settings'

// Public endpoint — no auth required
// Returns analytics toggle + IDs (non-sensitive configuration data)
export default defineEventHandler(async () => {
  const analytics = await getSettings<{
    clarityEnabled?: boolean
    clarityProjectId?: string
    ga4Enabled?: boolean
    ga4Id?: string
  }>('analytics')

  return {
    clarityEnabled: analytics.clarityEnabled ?? false,
    clarityProjectId: analytics.clarityProjectId ?? '',
    ga4Enabled: analytics.ga4Enabled ?? false,
    ga4Id: analytics.ga4Id ?? '',
  }
})
