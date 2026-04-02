/**
 * Google Analytics 4 client plugin.
 * Loads the GA4 script only if:
 *  1. A GA4 ID is configured in app_settings (fetched from /api/settings/analytics)
 *  2. The user has accepted cookies (prado-cookie-consent === 'accepted')
 */
export default defineNuxtPlugin(async () => {
  try {
    // Check cookie consent first — do not load tracking without consent
    const consent = localStorage.getItem('prado-cookie-consent')
    if (consent !== 'accepted') return

    const settings = await $fetch<{
      ga4Enabled?: boolean
      ga4Id?: string
    }>('/api/settings/analytics')

    if (!settings?.ga4Enabled || !settings?.ga4Id) return

    const ga4Id = settings.ga4Id

    // Load gtag.js script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
    document.head.appendChild(script)

    // Initialize gtag
    const w = window as unknown as {
      dataLayer?: unknown[]
      gtag?: (...args: unknown[]) => void
    }
    w.dataLayer = w.dataLayer || []
    w.gtag = function (...args: unknown[]) {
      w.dataLayer!.push(args)
    }
    w.gtag('js', new Date())
    w.gtag('config', ga4Id, {
      anonymize_ip: true,
      send_page_view: true,
    })
  } catch {
    // Silent — analytics is non-critical
  }
})
