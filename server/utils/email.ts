import { Resend } from 'resend'

const DEFAULT_FROM = 'Prado Itinéraires <noreply@prado-itineraires.fr>'

let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (resendClient) return resendClient
  const config = useRuntimeConfig()
  if (!config.resendApiKey) {
    throw new Error('RESEND_API_KEY manquant')
  }
  resendClient = new Resend(config.resendApiKey)
  return resendClient
}

export async function sendEmail(to: string | string[], subject: string, html: string) {
  const resend = getResendClient()
  const { data, error } = await resend.emails.send({
    from: DEFAULT_FROM,
    to,
    subject,
    html,
  })
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] ?? char)
  )
}

export function formatDateFr(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
