import { createClient } from '@supabase/supabase-js'
import { sendEmail, escapeHtml, formatDateFr } from '~/server/utils/email'
import { getSettings } from '~/server/utils/settings'

function addDays(base: Date, days: number): Date {
  const next = new Date(base)
  next.setDate(next.getDate() + days)
  return next
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function buildReminderHtml(params: {
  actionTitle: string
  actionDate: string
  jeuneName: string
  daysUntil: number
}): string {
  const label = params.daysUntil === 1 ? 'J-1' : 'J-2'
  return `
  <div style="background:#f6f5f3;padding:32px 16px;font-family:Arial,sans-serif;color:#1f1f1f;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e1d8;border-radius:12px;padding:24px;">
      <p style="margin:0 0 12px;font-size:16px;">Bonjour,</p>
      <p style="margin:0 0 12px;font-size:16px;">
        Rappel ${label} pour l'action <strong>${escapeHtml(params.actionTitle)}</strong>.
      </p>
      <p style="margin:0 0 12px;font-size:16px;">
        Jeune concerné : <strong>${escapeHtml(params.jeuneName || 'Non renseigné')}</strong>
      </p>
      <p style="margin:0;font-size:16px;">
        Date : <strong>${escapeHtml(params.actionDate)}</strong>
      </p>
    </div>
  </div>`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = getHeader(event, 'authorization') ?? ''
  const token = authHeader.replace('Bearer ', '')

  if (!config.cronSecret || token !== config.cronSecret) {
    throw createError({ statusCode: 401, message: 'Non autorisé' })
  }

  const adminClient = createClient(
    config.public.supabase.url,
    config.supabaseServiceRoleKey,
  )

  // Check settings toggles
  let reminderJ1Enabled = true
  let reminderJ2Enabled = true
  try {
    const emailSettings = await getSettings<{ reminderJ1Enabled?: boolean; reminderJ2Enabled?: boolean }>('email')
    reminderJ1Enabled = emailSettings.reminderJ1Enabled ?? true
    reminderJ2Enabled = emailSettings.reminderJ2Enabled ?? true
  } catch {
    // Default to enabled if settings table doesn't exist yet
  }

  if (!reminderJ1Enabled && !reminderJ2Enabled) {
    return { sent: 0, skipped: 'Rappels désactivés' }
  }

  const today = new Date()
  const datePlus1 = toDateKey(addDays(today, 1))
  const datePlus2 = toDateKey(addDays(today, 2))

  // Only include dates for enabled reminders
  const targetDates: string[] = []
  if (reminderJ1Enabled) targetDates.push(datePlus1)
  if (reminderJ2Enabled) targetDates.push(datePlus2)

  const dayOffsetByDate = new Map<string, number>()
  if (reminderJ1Enabled) dayOffsetByDate.set(datePlus1, 1)
  if (reminderJ2Enabled) dayOffsetByDate.set(datePlus2, 2)

  // Try action_dates table first (new schema)
  const datesRes = await adminClient
    .from('action_dates')
    .select('id, action_id, date, time')
    .in('date', targetDates)

  // Fallback to legacy actions.date if table doesn't exist
  if (datesRes.error) {
    // Legacy path: query actions.date directly
    const { data: legacyActions, error: legacyError } = await adminClient
      .from('actions')
      .select('id, title, date, time')
      .in('date', targetDates)

    if (legacyError || !legacyActions?.length) return { sent: 0 }

    const legacyMap = new Map(legacyActions.map(a => [a.id, a]))
    const { data: legacyInsc } = await adminClient
      .from('inscriptions')
      .select('id, action_id, jeunes(first_name, last_name), prescripteurs(professional_email)')
      .in('action_id', legacyActions.map(a => a.id))
      .is('canceled_at', null)

    let sent = 0
    for (const insc of legacyInsc ?? []) {
      const action = legacyMap.get(insc.action_id)
      if (!action) continue
      const email = (insc.prescripteurs as any)?.professional_email
      if (!email) continue
      const jeuneName = `${(insc.jeunes as any)?.first_name ?? ''} ${(insc.jeunes as any)?.last_name ?? ''}`.trim()
      const daysUntil = dayOffsetByDate.get(action.date) ?? 0
      const fullDate = formatDateFr(action.date) + (action.time ? ` à ${action.time}` : '')
      try {
        await sendEmail(email, `Rappel : action ${daysUntil === 1 ? 'demain' : 'dans 2 jours'}`, buildReminderHtml({ actionTitle: action.title, actionDate: fullDate, jeuneName, daysUntil }))
        sent++
      } catch (err) { console.error('Erreur envoi rappel', { inscriptionId: insc.id, error: err }) }
    }
    return { sent }
  }

  const upcomingDates = datesRes.data ?? []

  if (!upcomingDates.length) {
    return { sent: 0 }
  }

  // Fetch action titles
  const actionIds = [...new Set(upcomingDates.map(d => d.action_id))]
  const { data: actions } = await adminClient
    .from('actions')
    .select('id, title')
    .in('id', actionIds)

  const actionTitleMap = new Map((actions ?? []).map(a => [a.id, a.title]))
  const dateMap = new Map(upcomingDates.map(d => [d.id, d]))

  // Fetch inscriptions for these action_dates
  const { data: inscriptions, error: inscError } = await adminClient
    .from('inscriptions')
    .select('id, action_id, action_date_id, jeunes(first_name, last_name), prescripteurs(professional_email)')
    .in('action_date_id', upcomingDates.map(d => d.id))
    .is('canceled_at', null)

  if (inscError) {
    throw createError({ statusCode: 500, message: inscError.message })
  }

  let sent = 0

  for (const insc of inscriptions ?? []) {
    const actionDate = dateMap.get(insc.action_date_id)
    if (!actionDate) continue

    const actionTitle = actionTitleMap.get(insc.action_id) ?? 'Action'

    const email = (insc.jeunes as any)?.professional_email ?? (insc.prescripteurs as any)?.professional_email
    if (!email) continue

    const jeuneName = `${(insc.jeunes as any)?.first_name ?? ''} ${(insc.jeunes as any)?.last_name ?? ''}`.trim()
    const daysUntil = dayOffsetByDate.get(actionDate.date) ?? 0
    const formattedDate = formatDateFr(actionDate.date)
    const fullDate = formattedDate + (actionDate.time ? ` à ${actionDate.time}` : '')

    const html = buildReminderHtml({
      actionTitle,
      actionDate: fullDate,
      jeuneName,
      daysUntil,
    })

    try {
      await sendEmail(email, `Rappel : action ${daysUntil === 1 ? 'demain' : 'dans 2 jours'}`, html)
      sent++
    } catch (err) {
      console.error('Erreur envoi rappel', { inscriptionId: insc.id, error: err })
    }
  }

  return { sent }
})
