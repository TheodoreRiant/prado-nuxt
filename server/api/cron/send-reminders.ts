import { createClient } from '@supabase/supabase-js'
import { sendEmail, escapeHtml, formatDateFr } from '~/server/utils/email'

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

  const today = new Date()
  const datePlus1 = toDateKey(addDays(today, 1))
  const datePlus2 = toDateKey(addDays(today, 2))
  const dayOffsetByDate = new Map([[datePlus1, 1], [datePlus2, 2]])

  const { data: actions, error: actionsError } = await adminClient
    .from('actions')
    .select('id, title, date, time')
    .in('date', [datePlus1, datePlus2])

  if (actionsError) {
    throw createError({ statusCode: 500, message: actionsError.message })
  }

  if (!actions?.length) {
    return { sent: 0 }
  }

  const actionMap = new Map(actions.map(a => [a.id, a]))

  const { data: inscriptions, error: inscError } = await adminClient
    .from('inscriptions')
    .select('id, action_id, jeunes(first_name, last_name), prescripteurs(professional_email)')
    .in('action_id', actions.map(a => a.id))
    .is('canceled_at', null)

  if (inscError) {
    throw createError({ statusCode: 500, message: inscError.message })
  }

  let sent = 0

  for (const insc of inscriptions ?? []) {
    const action = actionMap.get(insc.action_id)
    if (!action) continue

    const email = (insc.jeunes as any)?.professional_email ?? (insc.prescripteurs as any)?.professional_email
    if (!email) continue

    const jeuneName = `${(insc.jeunes as any)?.first_name ?? ''} ${(insc.jeunes as any)?.last_name ?? ''}`.trim()
    const daysUntil = dayOffsetByDate.get(action.date) ?? 0
    const formattedDate = formatDateFr(action.date)
    const fullDate = formattedDate + (action.time ? ` à ${action.time}` : '')

    const html = buildReminderHtml({
      actionTitle: action.title,
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
