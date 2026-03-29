import { getSettings } from '~/server/utils/settings'

// Public endpoint — no auth required
// Returns only non-sensitive settings (contact info, donation URL)
export default defineEventHandler(async () => {
  const contact = await getSettings<{
    contactEmail?: string
    contactPhone?: string
    address?: string
    donationUrl?: string
  }>('contact')

  return {
    contactEmail: contact.contactEmail ?? '',
    contactPhone: contact.contactPhone ?? '',
    address: contact.address ?? '',
    donationUrl: contact.donationUrl ?? 'https://www.le-prado.fr/don/',
  }
})
