import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const client = createClient(config.public.supabase.url, config.supabaseServiceRoleKey)

  const actionsRes = await client.from('actions').select('id, title, category, is_activite').order('id', { ascending: true })

  if (actionsRes.error) throw createError({ statusCode: 500, message: actionsRes.error.message })

  // Try to fetch action_dates (table may not exist yet if migration not applied)
  let datesData: any[] = []
  try {
    const datesRes = await client.from('action_dates').select('id, action_id, date, time').order('date', { ascending: true })
    if (!datesRes.error) {
      datesData = datesRes.data ?? []
    }
  } catch {
    // Table doesn't exist yet — continue without dates
  }

  // Group dates by action_id
  const datesByAction = new Map<number, { id: string; date: string; time: string }[]>()
  for (const d of datesData) {
    const list = datesByAction.get(d.action_id) ?? []
    list.push({ id: d.id, date: d.date, time: d.time ?? '' })
    datesByAction.set(d.action_id, list)
  }

  return (actionsRes.data ?? []).map(a => ({
    id: a.id,
    title: a.title,
    category: a.category,
    is_activite: a.is_activite,
    dates: datesByAction.get(a.id) ?? [],
  }))
})
