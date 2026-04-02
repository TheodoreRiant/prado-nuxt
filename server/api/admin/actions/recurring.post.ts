import { requireAdmin } from '~/server/utils/admin'
import { validateBody, actionRecurringSchema } from '~/server/utils/validation'

/**
 * Generate dates between startDate and endDate at the given frequency.
 * Uses UTC to avoid timezone-related off-by-one errors.
 */
function generateDates(
  startDate: string,
  endDate: string,
  frequency: 'weekly' | 'biweekly' | 'monthly',
): string[] {
  const dates: string[] = []
  const current = new Date(startDate + 'T12:00:00Z')
  const end = new Date(endDate + 'T12:00:00Z')

  while (current <= end) {
    const y = current.getUTCFullYear()
    const m = String(current.getUTCMonth() + 1).padStart(2, '0')
    const d = String(current.getUTCDate()).padStart(2, '0')
    dates.push(`${y}-${m}-${d}`)

    switch (frequency) {
      case 'weekly':
        current.setUTCDate(current.getUTCDate() + 7)
        break
      case 'biweekly':
        current.setUTCDate(current.getUTCDate() + 14)
        break
      case 'monthly':
        current.setUTCMonth(current.getUTCMonth() + 1)
        break
    }
  }

  return dates
}

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const body = await validateBody(event, actionRecurringSchema)

  const { baseAction, frequency, startDate, endDate } = body

  // Generate the list of dates
  const dates = generateDates(startDate, endDate, frequency)

  if (dates.length === 0) {
    throw createError({ statusCode: 400, message: 'Aucune date generee pour la periode donnee' })
  }

  if (dates.length > 52) {
    throw createError({ statusCode: 400, message: 'Trop de dates (max 52). Reduisez la periode.' })
  }

  // Create the parent action
  const { data: action, error: actionError } = await adminClient
    .from('actions')
    .insert({
      title: baseAction.title,
      category: baseAction.category ?? '',
      date: startDate,
      time: baseAction.time ?? '',
      summary: baseAction.summary ?? '',
      description: baseAction.description ?? '',
      url_detail: baseAction.url_detail ?? '',
      url_image: baseAction.url_image ?? '',
      is_activite: baseAction.is_activite ?? true,
      is_published: baseAction.is_published ?? false,
      places_max: baseAction.places_max ?? null,
      cost: baseAction.cost ?? null,
      is_recurring: true,
      etablissement_id: baseAction.etablissement_id ?? null,
    })
    .select()
    .single()

  if (actionError) {
    throw createError({ statusCode: 500, message: actionError.message })
  }

  // Create action_dates for each generated date
  const actionDatesRows = dates.map(d => ({
    action_id: action.id,
    date: d,
    time: baseAction.time ?? '',
    places_max: baseAction.places_max ?? null,
  }))

  const { data: createdDates, error: datesError } = await adminClient
    .from('action_dates')
    .insert(actionDatesRows)
    .select()

  if (datesError) {
    throw createError({ statusCode: 500, message: datesError.message })
  }

  return {
    action,
    dates: createdDates ?? [],
    totalDates: dates.length,
  }
})
