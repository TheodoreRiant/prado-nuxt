import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const config = useRuntimeConfig()
  const endpoint = config.public?.prismic?.endpoint || 'prado-itineraires'

  try {
    // Test connection by fetching repository info
    const res = await fetch(`https://${endpoint}.cdn.prismic.io/api/v2`)
    if (!res.ok) {
      return { connected: false, types: [] }
    }

    const data = await res.json() as { types?: Record<string, string> }
    const types = Object.keys(data.types ?? {})

    return {
      connected: true,
      types,
    }
  } catch {
    return { connected: false, types: [] }
  }
})
