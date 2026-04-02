import { describe, it, expect } from 'vitest'

/**
 * Unit test for rate limiting logic (extracted from server/middleware/rate-limit.ts).
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60_000

function checkRateLimit(
  store: Map<string, RateLimitEntry>,
  key: string,
  now: number,
): { allowed: boolean; retryAfter?: number } {
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true }
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  store.set(key, { ...entry, count: entry.count + 1 })
  return { allowed: true }
}

describe('Rate limiting logic', () => {
  it('allows first request', () => {
    const store = new Map<string, RateLimitEntry>()
    const result = checkRateLimit(store, '1.2.3.4:/api/contact', Date.now())
    expect(result.allowed).toBe(true)
  })

  it('allows up to 5 requests', () => {
    const store = new Map<string, RateLimitEntry>()
    const now = Date.now()
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(store, '1.2.3.4:/api/contact', now)
      expect(result.allowed).toBe(true)
    }
  })

  it('blocks 6th request', () => {
    const store = new Map<string, RateLimitEntry>()
    const now = Date.now()
    for (let i = 0; i < 5; i++) {
      checkRateLimit(store, '1.2.3.4:/api/contact', now)
    }
    const result = checkRateLimit(store, '1.2.3.4:/api/contact', now)
    expect(result.allowed).toBe(false)
    expect(result.retryAfter).toBeGreaterThan(0)
  })

  it('resets after window expires', () => {
    const store = new Map<string, RateLimitEntry>()
    const now = Date.now()
    for (let i = 0; i < 5; i++) {
      checkRateLimit(store, '1.2.3.4:/api/contact', now)
    }
    // After window expires
    const afterWindow = now + RATE_LIMIT_WINDOW_MS + 1
    const result = checkRateLimit(store, '1.2.3.4:/api/contact', afterWindow)
    expect(result.allowed).toBe(true)
  })

  it('tracks different IPs separately', () => {
    const store = new Map<string, RateLimitEntry>()
    const now = Date.now()
    for (let i = 0; i < 5; i++) {
      checkRateLimit(store, '1.2.3.4:/api/contact', now)
    }
    // Different IP should be allowed
    const result = checkRateLimit(store, '5.6.7.8:/api/contact', now)
    expect(result.allowed).toBe(true)
  })

  it('tracks different paths separately', () => {
    const store = new Map<string, RateLimitEntry>()
    const now = Date.now()
    for (let i = 0; i < 5; i++) {
      checkRateLimit(store, '1.2.3.4:/api/contact', now)
    }
    const result = checkRateLimit(store, '1.2.3.4:/api/newsletter', now)
    expect(result.allowed).toBe(true)
  })
})
