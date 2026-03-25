export const useHomepage = () => {
  const { client } = usePrismic()

  return useAsyncData('homepage', async () => {
    try {
      return await client.getSingle('homepage')
    } catch {
      console.warn('[useHomepage] Prismic fetch failed, using fallback data')
      return null
    }
  }, {
    server: true,
    dedupe: 'defer',
  })
}
