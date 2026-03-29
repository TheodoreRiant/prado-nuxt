export interface ActionPlacesRow {
  actionDateId: string
  actionId: string | number
  placesMax: number | null
  inscriptionsCount: number
  placesRemaining: number | null
}

export interface ActionPlacesInfo {
  placesMax: number | null
  inscriptionsCount: number
  placesRemaining: number | null
  isFull: boolean
}

export function useActionPlaces() {
  const placesByDate = useState<Record<string, ActionPlacesRow>>('action-places', () => ({}))
  const loading = useState<boolean>('action-places-loading', () => false)

  const refresh = async () => {
    if (import.meta.server || loading.value) return
    loading.value = true
    try {
      const data = await $fetch<ActionPlacesRow[]>('/api/action-places')
      const next: Record<string, ActionPlacesRow> = {}
      for (const item of data ?? []) {
        next[item.actionDateId] = item
      }
      placesByDate.value = next
    } catch (err) {
      console.error('Erreur chargement places', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    if (Object.keys(placesByDate.value).length === 0) {
      refresh()
    }
  })

  // Auto-refresh when inscriptions change
  if (import.meta.client) {
    const { inscriptions } = useAuth()
    watch(
      () => inscriptions.value.map(i => i.id).join('|'),
      () => { refresh() },
    )
  }

  const getPlacesInfo = (actionDateId: string): ActionPlacesInfo => {
    const info = placesByDate.value[actionDateId]
    const placesMax = info?.placesMax ?? null
    const inscriptionsCount = info?.inscriptionsCount ?? 0
    const placesRemaining = info?.placesRemaining ?? null
    const isFull = placesMax !== null && inscriptionsCount >= placesMax

    return { placesMax, inscriptionsCount, placesRemaining, isFull }
  }

  return { loading, refresh, getPlacesInfo }
}
