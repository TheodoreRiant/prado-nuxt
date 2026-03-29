import { requireAdmin } from '~/server/utils/admin'
import { getSettings } from '~/server/utils/settings'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const settings = await getSettings<{
    mailchimpApiKey?: string
    mailchimpServer?: string
    mailchimpListId?: string
  }>('newsletter')

  if (!settings.mailchimpApiKey || !settings.mailchimpServer || !settings.mailchimpListId) {
    return { ok: false, error: 'Clé API, serveur ou ID de liste manquant' }
  }

  try {
    const baseUrl = `https://${settings.mailchimpServer}.api.mailchimp.com/3.0`
    const authHeader = `Basic ${Buffer.from(`anystring:${settings.mailchimpApiKey}`).toString('base64')}`

    // Test: fetch list info
    const res = await fetch(`${baseUrl}/lists/${settings.mailchimpListId}`, {
      headers: { Authorization: authHeader },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { detail?: string }
      return { ok: false, error: err.detail ?? `Erreur ${res.status}` }
    }

    const list = await res.json() as { name?: string; stats?: { member_count?: number } }

    return {
      ok: true,
      listName: list.name ?? 'Liste inconnue',
      memberCount: list.stats?.member_count ?? 0,
    }
  } catch {
    return { ok: false, error: 'Impossible de contacter l\'API Mailchimp' }
  }
})
