import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const actionId = getRouterParam(event, 'actionId')

  if (!actionId) {
    throw createError({ statusCode: 400, message: 'actionId requis' })
  }

  // Fetch the action
  const { data: action, error: actionError } = await adminClient
    .from('actions')
    .select('id, title, category, date, time')
    .eq('id', actionId)
    .single()

  if (actionError || !action) {
    throw createError({ statusCode: 404, message: 'Action introuvable' })
  }

  // Fetch action dates
  const { data: actionDates } = await adminClient
    .from('action_dates')
    .select('id, date, time')
    .eq('action_id', actionId)
    .order('date', { ascending: true })

  // Fetch inscriptions with jeune info
  const { data: inscriptions, error: inscError } = await adminClient
    .from('inscriptions')
    .select('id, jeune_id, action_date_id, presence, accompagnateur_present, noms_accompagnateurs, jeunes(first_name, last_name)')
    .eq('action_id', actionId)
    .is('canceled_at', null)
    .order('created_at', { ascending: true })

  if (inscError) {
    throw createError({ statusCode: 500, message: inscError.message })
  }

  const rows = (inscriptions ?? []).map(row => ({
    inscriptionId: row.id,
    jeuneId: row.jeune_id,
    actionDateId: row.action_date_id,
    jeuneFirstName: (row.jeunes as any)?.first_name ?? '',
    jeuneLastName: (row.jeunes as any)?.last_name ?? '',
    presence: row.presence ?? 'inscrit',
    accompagnateurPresent: row.accompagnateur_present ?? false,
    nomsAccompagnateurs: row.noms_accompagnateurs ?? null,
  }))

  const totalInscrits = rows.length
  const totalPresents = rows.filter(r => r.presence === 'present').length
  const totalAbsents = rows.filter(r => r.presence === 'absent').length

  return {
    action: {
      id: action.id,
      title: action.title,
      category: action.category,
      date: action.date,
      time: action.time,
    },
    dates: actionDates ?? [],
    inscriptions: rows,
    stats: {
      totalInscrits,
      totalPresents,
      totalAbsents,
      tauxPresence: totalInscrits > 0
        ? Math.round((totalPresents / totalInscrits) * 100)
        : 0,
    },
  }
})
