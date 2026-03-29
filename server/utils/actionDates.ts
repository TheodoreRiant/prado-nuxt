import type { SupabaseClient } from '@supabase/supabase-js'

export interface ActionDateRow {
  id: string
  action_id: number
  date: string
  time: string
  places_max: number | null
}

export interface ActionDateWithPlaces extends ActionDateRow {
  inscriptionsCount: number
  placesRemaining: number | null
}

/**
 * Fetch action_dates for given action IDs, enriched with inscription counts.
 */
export async function fetchActionDatesWithPlaces(
  client: SupabaseClient,
  actionIds: number[],
): Promise<Map<number, ActionDateWithPlaces[]>> {
  if (actionIds.length === 0) return new Map()

  let datesData: any[] = []
  let inscData: any[] = []

  try {
    const [datesRes, inscRes] = await Promise.all([
      client.from('action_dates').select('*').in('action_id', actionIds).order('date', { ascending: true }),
      client.from('inscriptions').select('action_date_id').is('canceled_at', null).not('action_date_id', 'is', null),
    ])

    // Gracefully handle missing table (migration not yet applied)
    if (datesRes.error && datesRes.error.code === '42P01') return new Map()
    if (datesRes.error) throw datesRes.error
    if (inscRes.error) throw inscRes.error

    datesData = datesRes.data ?? []
    inscData = inscRes.data ?? []
  } catch (err: any) {
    // Table doesn't exist yet — return empty
    if (err?.code === '42P01' || err?.message?.includes('action_dates')) return new Map()
    throw err
  }

  // Count inscriptions per action_date
  const countsByDateId = new Map<string, number>()
  for (const row of inscData) {
    const id = row.action_date_id as string
    countsByDateId.set(id, (countsByDateId.get(id) ?? 0) + 1)
  }

  const result = new Map<number, ActionDateWithPlaces[]>()

  for (const d of datesData) {
    const inscriptionsCount = countsByDateId.get(d.id) ?? 0
    const placesMax = typeof d.places_max === 'number' ? d.places_max : null
    const placesRemaining = placesMax === null ? null : Math.max(placesMax - inscriptionsCount, 0)

    const entry: ActionDateWithPlaces = {
      id: d.id,
      action_id: d.action_id,
      date: d.date,
      time: d.time ?? '',
      places_max: d.places_max,
      inscriptionsCount,
      placesRemaining,
    }

    const list = result.get(d.action_id) ?? []
    list.push(entry)
    result.set(d.action_id, list)
  }

  return result
}

/**
 * Determine if all dates of an action are in the past.
 */
export function isActionTermine(dates: ActionDateRow[], today: string): boolean {
  if (dates.length === 0) return false
  return dates.every(d => d.date < today)
}

/**
 * Find the next upcoming date (>= today), or null.
 */
export function getNextDate(dates: ActionDateRow[], today: string): string | null {
  const future = dates.filter(d => d.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  return future.length > 0 ? future[0].date : null
}

/**
 * Compute today's date key (YYYY-MM-DD).
 */
export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}
