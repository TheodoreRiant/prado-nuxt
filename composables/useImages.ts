/**
 * Provides image URLs from Supabase for actions and ressources.
 * Prismic documents don't have images yet - this bridges the gap.
 * Cached globally so it only fetches once.
 */
export function useImages() {
  const client = useSupabaseClient()

  const actionImages = useState<Record<number, string>>('action-images', () => ({}))
  const ressourceImages = useState<Record<number, string>>('ressource-images', () => ({}))
  const loaded = useState<boolean>('images-loaded', () => false)

  async function loadImages() {
    if (loaded.value) return
    const [actionsRes, ressourcesRes] = await Promise.all([
      client.from('actions').select('id, url_image'),
      client.from('ressources').select('id, image'),
    ])
    const aMap: Record<number, string> = {}
    for (const row of actionsRes.data ?? []) {
      aMap[row.id] = row.url_image ?? ''
    }
    actionImages.value = aMap

    const rMap: Record<number, string> = {}
    for (const row of ressourcesRes.data ?? []) {
      rMap[row.id] = row.image ?? ''
    }
    ressourceImages.value = rMap
    loaded.value = true
  }

  function getActionImage(originalId: number): string {
    return actionImages.value[originalId] ?? ''
  }

  function getRessourceImage(originalId: number): string {
    return ressourceImages.value[originalId] ?? ''
  }

  return { loadImages, getActionImage, getRessourceImage }
}
