import crypto from 'node:crypto'
import { getSettings } from '~/server/utils/settings'

interface MailchimpConfig {
  mailchimpEnabled?: boolean
  mailchimpApiKey?: string
  mailchimpServer?: string
  mailchimpListId?: string
}

/**
 * Sync a single contact to Mailchimp (add or update).
 * Only acts if Mailchimp is enabled and fully configured in app_settings.
 * Silently no-ops if disabled or misconfigured.
 */
export async function syncToMailchimp(
  email: string,
  firstName?: string,
  lastName?: string,
  structure?: string,
): Promise<{ synced: boolean; error?: string }> {
  try {
    const settings = await getSettings<MailchimpConfig>('newsletter')

    if (!settings.mailchimpEnabled) {
      return { synced: false }
    }

    if (!settings.mailchimpApiKey || !settings.mailchimpServer || !settings.mailchimpListId) {
      return { synced: false, error: 'Configuration Mailchimp incomplete' }
    }

    const baseUrl = `https://${settings.mailchimpServer}.api.mailchimp.com/3.0`
    const authHeader = `Basic ${Buffer.from(`anystring:${settings.mailchimpApiKey}`).toString('base64')}`
    const subscriberHash = md5Hash(email.toLowerCase())

    const mergeFields: Record<string, string> = {}
    if (firstName) mergeFields.FNAME = firstName
    if (lastName) mergeFields.LNAME = lastName
    if (structure) mergeFields.STRUCTURE = structure

    const res = await fetch(
      `${baseUrl}/lists/${settings.mailchimpListId}/members/${subscriberHash}`,
      {
        method: 'PUT',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status_if_new: 'subscribed',
          merge_fields: Object.keys(mergeFields).length > 0 ? mergeFields : undefined,
        }),
      },
    )

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { detail?: string }
      return { synced: false, error: err.detail ?? `Erreur ${res.status}` }
    }

    return { synced: true }
  } catch {
    return { synced: false, error: 'Impossible de contacter Mailchimp' }
  }
}

function md5Hash(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex')
}
