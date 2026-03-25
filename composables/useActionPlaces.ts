export interface ActionPlacesRow {
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
  const placesByAction = useState<Record<string, ActionPlacesRow>>('action-places', () => ({}))
  const loading = useState<boolean>('action-places-loading', () => false)

  const refresh = async () => {
    if (import.meta.server || loading.value) return
    loading.value = true
    try {
      const data = await $fetch<ActionPlacesRow[]>('/api/action-places')
      const next: Record<string, ActionPlacesRow> = {}
      for (const item of data ?? []) {
        next[String(item.actionId)] = item
      }
      placesByAction.value = next
    } catch (err) {
      console.error('Erreur chargement places', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    if (Object.keys(placesByAction.value).length === 0) {
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

  const getPlacesInfo = (actionId: string | number): ActionPlacesInfo => {
    const info = placesByAction.value[String(actionId)]
    const placesMax = info?.placesMax ?? null
    const inscriptionsCount = info?.inscriptionsCount ?? 0
    const placesRemaining = info?.placesRemaining ?? null
    const isFull = placesMax !== null && inscriptionsCount >= placesMax

    return { placesMax, inscriptionsCount, placesRemaining, isFull }
  }

  return { loading, refresh, getPlacesInfo }
}
