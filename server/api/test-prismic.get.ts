import * as prismic from '@prismicio/client'

export default defineEventHandler(async () => {
  const client = prismic.createClient('prado-nuxt')

  const res = await client.getByType('ressource', { pageSize: 3 })

  return {
    total: res.total_results_size,
    count: res.results.length,
    sample: res.results[0]?.data?.title ?? 'no data',
  }
})
