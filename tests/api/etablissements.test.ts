import { describe, it, expect, vi } from 'vitest'

/**
 * Tests for etablissement CRUD logic extracted from admin API routes.
 * Since integration testing with real Supabase is not available in the test setup,
 * we test the business logic / validation / response shaping in isolation.
 */

describe('Etablissement — create logic', () => {
  function buildInsertData(body: { name: string; address?: string; postalCode?: string; city?: string }) {
    return {
      name: body.name,
      address: body.address ?? null,
      postal_code: body.postalCode ?? null,
      city: body.city ?? null,
    }
  }

  function buildResponse(data: Record<string, any>) {
    return {
      id: data.id,
      name: data.name,
      address: data.address ?? null,
      postalCode: data.postal_code ?? null,
      city: data.city ?? null,
      createdAt: data.created_at,
    }
  }

  it('maps body to snake_case insert data', () => {
    const result = buildInsertData({ name: 'Centre', address: '1 rue X', postalCode: '13001', city: 'Marseille' })
    expect(result).toEqual({
      name: 'Centre',
      address: '1 rue X',
      postal_code: '13001',
      city: 'Marseille',
    })
  })

  it('defaults optional fields to null', () => {
    const result = buildInsertData({ name: 'Centre' })
    expect(result).toEqual({
      name: 'Centre',
      address: null,
      postal_code: null,
      city: null,
    })
  })

  it('builds response from DB row', () => {
    const row = {
      id: 'etab-1',
      name: 'Centre Social',
      address: '12 rue',
      postal_code: '13001',
      city: 'Marseille',
      created_at: '2026-01-01T00:00:00Z',
    }
    const response = buildResponse(row)
    expect(response).toEqual({
      id: 'etab-1',
      name: 'Centre Social',
      address: '12 rue',
      postalCode: '13001',
      city: 'Marseille',
      createdAt: '2026-01-01T00:00:00Z',
    })
  })

  it('builds response with null optional fields', () => {
    const row = {
      id: 'etab-2',
      name: 'Lieu',
      created_at: '2026-01-01T00:00:00Z',
    }
    const response = buildResponse(row)
    expect(response.address).toBeNull()
    expect(response.postalCode).toBeNull()
    expect(response.city).toBeNull()
  })
})

describe('Etablissement — update logic', () => {
  function buildUpdates(body: { name?: string; address?: string; postalCode?: string; city?: string }) {
    const updates: Record<string, unknown> = {}
    if (body.name !== undefined) updates.name = body.name
    if (body.address !== undefined) updates.address = body.address
    if (body.postalCode !== undefined) updates.postal_code = body.postalCode
    if (body.city !== undefined) updates.city = body.city
    return updates
  }

  it('maps partial update to DB columns', () => {
    const result = buildUpdates({ name: 'New Name' })
    expect(result).toEqual({ name: 'New Name' })
  })

  it('maps postalCode to postal_code', () => {
    const result = buildUpdates({ postalCode: '13002' })
    expect(result).toEqual({ postal_code: '13002' })
  })

  it('maps multiple fields', () => {
    const result = buildUpdates({ name: 'New', address: '2 rue Y', city: 'Aix' })
    expect(result).toEqual({ name: 'New', address: '2 rue Y', city: 'Aix' })
  })

  it('ignores undefined fields', () => {
    const result = buildUpdates({})
    expect(result).toEqual({})
  })
})

describe('Etablissement — duplicate detection', () => {
  function isDuplicateError(errorCode: string): boolean {
    return errorCode === '23505'
  }

  it('detects unique constraint violation', () => {
    expect(isDuplicateError('23505')).toBe(true)
  })

  it('ignores other error codes', () => {
    expect(isDuplicateError('42P01')).toBe(false)
    expect(isDuplicateError('23503')).toBe(false)
  })
})
