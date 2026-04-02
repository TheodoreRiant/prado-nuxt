import type { ActualiteDocument } from '~/prismicio-types'

/**
 * Fetch the latest news articles from Prismic (type "actualite").
 * Returns up to `limit` articles ordered by date descending.
 */
export function useActualites(limit = 5) {
  const { client } = usePrismic()

  return useAsyncData(`actualites-latest-${limit}`, async () => {
    try {
      const results = await client.getAllByType<ActualiteDocument>('actualite', {
        orderings: { field: 'my.actualite.date', direction: 'desc' },
        pageSize: limit,
      })
      return results.slice(0, limit)
    } catch {
      return [] as ActualiteDocument[]
    }
  }, {
    server: true,
    dedupe: 'defer',
  })
}
