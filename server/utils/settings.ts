import { createClient } from '@supabase/supabase-js'

interface CacheEntry {
  value: Record<string, unknown>
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 60_000 // 60 seconds

function getAdminClient() {
  const config = useRuntimeConfig()
  return createClient(config.public.supabase.url, config.supabaseServiceRoleKey)
}

export async function getSettings<T = Record<string, unknown>>(key: string): Promise<T> {
  const cached = cache.get(key)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as T
  }

  const client = getAdminClient()
  const { data, error } = await client
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error || !data) {
    return {} as T
  }

  cache.set(key, { value: data.value, expiresAt: Date.now() + CACHE_TTL })
  return data.value as T
}

export async function getAllSettings(): Promise<Record<string, Record<string, unknown>>> {
  const client = getAdminClient()
  const { data, error } = await client
    .from('app_settings')
    .select('key, value, updated_at')

  if (error || !data) return {}

  const result: Record<string, Record<string, unknown>> = {}
  for (const row of data) {
    result[row.key] = { ...row.value as Record<string, unknown>, _updatedAt: row.updated_at }
    cache.set(row.key, { value: row.value, expiresAt: Date.now() + CACHE_TTL })
  }
  return result
}

export async function updateSettings(
  key: string,
  value: Record<string, unknown>,
  userId?: string,
): Promise<void> {
  const client = getAdminClient()

  // Merge with existing values (partial update)
  const existing = await getSettings(key)
  const merged = { ...existing, ...value }

  const { error } = await client
    .from('app_settings')
    .upsert({
      key,
      value: merged,
      updated_at: new Date().toISOString(),
      updated_by: userId ?? null,
    })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  // Invalidate cache
  cache.delete(key)
}

export function invalidateSettings(key?: string): void {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}
