import { describe, it, expect } from 'vitest'

/**
 * Tests for pure utility functions from server/utils/email.ts.
 * Reproduced here to avoid Resend/Supabase dependencies.
 */

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] ?? char),
  )
}

function formatDateFr(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })

  it('escapes angle brackets', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    )
  })

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#39;s')
  })

  it('escapes double quotes', () => {
    expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;')
  })

  it('returns unchanged string when no special characters', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123')
  })

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('')
  })

  it('escapes multiple special characters in sequence', () => {
    expect(escapeHtml('&<>"\'&')).toBe('&amp;&lt;&gt;&quot;&#39;&amp;')
  })
})

describe('formatDateFr', () => {
  it('returns empty string for null', () => {
    expect(formatDateFr(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(formatDateFr(undefined)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(formatDateFr('')).toBe('')
  })

  it('returns original value for invalid date', () => {
    expect(formatDateFr('not-a-date')).toBe('not-a-date')
  })

  it('formats a valid ISO date in French', () => {
    const result = formatDateFr('2026-04-01')
    // Should contain French weekday, day, month, and year
    expect(result).toContain('2026')
    expect(result).toContain('01')
    // April in French is "avril"
    expect(result.toLowerCase()).toContain('avril')
  })

  it('formats a full ISO datetime', () => {
    const result = formatDateFr('2026-12-25T10:00:00Z')
    expect(result).toContain('2026')
    expect(result.toLowerCase()).toContain('cembre') // decembre
  })

  it('includes weekday', () => {
    // 2026-04-01 is a Wednesday (mercredi)
    const result = formatDateFr('2026-04-01T12:00:00Z')
    expect(result.toLowerCase()).toContain('mercredi')
  })
})
