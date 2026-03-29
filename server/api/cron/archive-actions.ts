import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // Verify cron secret (Vercel Cron sends this header)
  const authHeader = getHeader(event, 'authorization')
  const config = useRuntimeConfig()

  if (authHeader !== `Bearer ${config.cronSecret}`) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const client = createClient(config.public.supabase.url, config.supabaseServiceRoleKey)

  const today = new Date().toISOString().split('T')[0]

  // Find activite actions that are not archived and have at least one date
  const { data: activeActions, error: actionsError } = await client
    .from('actions')
    .select('id')
    .eq('is_activite', true)
    .is('archived_at', null)

  if (actionsError) {
    throw createError({ statusCode: 500, message: actionsError.message })
  }

  if (!activeActions?.length) {
    return { archived: 0, actions: [] }
  }

  // Get all action_dates for these actions
  let allDates: any[] = []
  try {
    const { data, error: datesError } = await client
      .from('action_dates')
      .select('action_id, date')
      .in('action_id', activeActions.map(a => a.id))

    if (datesError && datesError.code !== '42P01') {
      throw createError({ statusCode: 500, message: datesError.message })
    }
    allDates = data ?? []
  } catch (err: any) {
    // Table doesn't exist yet — fallback to legacy single date
    if (err?.code === '42P01' || err?.message?.includes('action_dates')) {
      const { data, error } = await client
        .from('actions')
        .update({ archived_at: new Date().toISOString() })
        .eq('is_activite', true)
        .is('archived_at', null)
        .lt('date', today)
        .select('id, title')
      if (error) throw createError({ statusCode: 500, message: error.message })
      return { archived: data?.length ?? 0, actions: data?.map(a => a.title) ?? [] }
    }
    throw err
  }

  // Find actions where ALL dates are in the past (and they have at least one date)
  const futureDateActions = new Set<number>()
  const actionsWithDates = new Set<number>()

  for (const d of allDates ?? []) {
    actionsWithDates.add(d.action_id)
    if (d.date >= today) {
      futureDateActions.add(d.action_id)
    }
  }

  const toArchive = activeActions
    .filter(a => actionsWithDates.has(a.id) && !futureDateActions.has(a.id))
    .map(a => a.id)

  if (toArchive.length === 0) {
    return { archived: 0, actions: [] }
  }

  const { data, error } = await client
    .from('actions')
    .update({ archived_at: new Date().toISOString() })
    .in('id', toArchive)
    .select('id, title')

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return {
    archived: data?.length ?? 0,
    actions: data?.map(a => a.title) ?? [],
  }
})
