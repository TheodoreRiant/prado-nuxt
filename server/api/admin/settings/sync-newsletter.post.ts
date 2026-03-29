import crypto from 'node:crypto'
import { requireAdmin } from '~/server/utils/admin'
import { getSettings, updateSettings } from '~/server/utils/settings'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)

  const settings = await getSettings<{
    mailchimpEnabled?: boolean
    mailchimpApiKey?: string
    mailchimpServer?: string
    mailchimpListId?: string
  }>('newsletter')

  if (!settings.mailchimpEnabled) {
    throw createError({ statusCode: 400, message: 'Mailchimp n\'est pas activé' })
  }

  if (!settings.mailchimpApiKey || !settings.mailchimpServer || !settings.mailchimpListId) {
    throw createError({ statusCode: 400, message: 'Configuration Mailchimp incomplète' })
  }

  // Fetch confirmed subscribers
  const { data: subscribers, error } = await adminClient
    .from('newsletter_subscribers')
    .select('email, structure')
    .eq('confirmed', true)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  if (!subscribers?.length) {
    return { synced: 0 }
  }

  const baseUrl = `https://${settings.mailchimpServer}.api.mailchimp.com/3.0`
  const authHeader = `Basic ${Buffer.from(`anystring:${settings.mailchimpApiKey}`).toString('base64')}`

  // Batch add/update via Mailchimp batch operations
  const operations = subscribers.map((sub) => ({
    method: 'PUT' as const,
    path: `/lists/${settings.mailchimpListId}/members/${md5Hash(sub.email.toLowerCase())}`,
    body: JSON.stringify({
      email_address: sub.email,
      status_if_new: 'subscribed',
      merge_fields: sub.structure ? { STRUCTURE: sub.structure } : {},
    }),
  }))

  // Mailchimp batch API
  const res = await fetch(`${baseUrl}/batches`, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ operations }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    throw createError({ statusCode: 500, message: err.detail ?? 'Erreur Mailchimp' })
  }

  // Update sync metadata
  await updateSettings('newsletter', {
    lastSyncAt: new Date().toISOString(),
    syncCount: subscribers.length,
  })

  return { synced: subscribers.length }
})

// Simple MD5 hash for Mailchimp subscriber hash (email-based)
function md5Hash(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex')
}
