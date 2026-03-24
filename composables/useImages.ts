/**
 * Provides image URLs for actions and ressources.
 * Uses local copies (public/images/) when available, falls back to Supabase URLs.
 */
export function useImages() {
  const client = useSupabaseClient()

  // Local images that were successfully downloaded from the Prado site
  const LOCAL_ACTION_IMAGES: Record<number, string> = {
    1: '/images/actions/1.png', 2: '/images/actions/2.png', 3: '/images/actions/3.png',
    4: '/images/actions/4.png', 5: '/images/actions/5.png', 6: '/images/actions/6.png',
    7: '/images/actions/7.jpg', 8: '/images/actions/8.png', 10: '/images/actions/10.png',
    11: '/images/actions/11.png', 12: '/images/actions/12.jpg', 13: '/images/actions/13.png',
    24: '/images/actions/24.png', 30: '/images/actions/30.jpg', 32: '/images/actions/32.png',
    33: '/images/actions/33.png', 46: '/images/actions/46.png', 60: '/images/actions/60.png',
  }

  const LOCAL_RESSOURCE_IMAGES: Record<number, string> = {
    1: '/images/ressources/1.jpg', 2: '/images/ressources/2.png', 3: '/images/ressources/3.jpg',
    4: '/images/ressources/4.jpg', 5: '/images/ressources/5.jpg', 6: '/images/ressources/6.png',
    7: '/images/ressources/7.png', 8: '/images/ressources/8.png', 9: '/images/ressources/9.png',
    10: '/images/ressources/10.png', 11: '/images/ressources/11.png', 12: '/images/ressources/12.png',
    13: '/images/ressources/13.png', 40: '/images/ressources/40.png', 65: '/images/ressources/65.png',
    80: '/images/ressources/80.png', 120: '/images/ressources/120.png', 121: '/images/ressources/121.png',
    137: '/images/ressources/137.png', 160: '/images/ressources/160.png',
  }

  function getActionImage(originalId: number): string {
    return LOCAL_ACTION_IMAGES[originalId] ?? ''
  }

  function getRessourceImage(originalId: number): string {
    return LOCAL_RESSOURCE_IMAGES[originalId] ?? ''
  }

  return { getActionImage, getRessourceImage }
}
