/**
 * Provides image URLs from Supabase for actions and ressources.
 * Uses useAsyncData for SSR compatibility.
 */
export function useImages() {
  const client = useSupabaseClient()

  const { data: actionImagesData } = useAsyncData('action-images', async () => {
    const { data } = await client.from('actions').select('id, url_image')
    const map: Record<number, string> = {}
    for (const row of data ?? []) {
      map[row.id] = row.url_image ?? ''
    }
    return map
  }, { default: () => ({} as Record<number, string>) })

  const { data: ressourceImagesData } = useAsyncData('ressource-images', async () => {
    const { data } = await client.from('ressources').select('id, image')
    const map: Record<number, string> = {}
    for (const row of data ?? []) {
      map[row.id] = row.image ?? ''
    }
    return map
  }, { default: () => ({} as Record<number, string>) })

  function getActionImage(originalId: number): string {
    return actionImagesData.value[originalId] ?? ''
  }

  function getRessourceImage(originalId: number): string {
    return ressourceImagesData.value[originalId] ?? ''
  }

  return { getActionImage, getRessourceImage }
}
