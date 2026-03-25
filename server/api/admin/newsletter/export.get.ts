import { requireAdmin } from '~/server/utils/admin'

function csvEscape(value: unknown): string {
  const str = value == null ? '' : String(value)
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const { data, error } = await adminClient
    .from('newsletter_subscribers')
    .select('email, structure, source, subscribed_at, confirmed_at')
    .order('subscribed_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })

  const header = 'email,structure,source,subscribed_at,confirmed_at'
  const rows = (data ?? []).map(row =>
    [row.email, row.structure, row.source, row.subscribed_at, row.confirmed_at].map(csvEscape).join(',')
  )

  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', 'attachment; filename="newsletter_subscribers.csv"')
  return [header, ...rows].join('\n')
})
