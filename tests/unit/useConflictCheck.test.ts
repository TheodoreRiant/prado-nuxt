import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Mock vue-sonner
const mockWarning = vi.fn()
vi.mock('vue-sonner', () => ({
  toast: { warning: (...args: any[]) => mockWarning(...args) },
}))

// Mock useAuth composable
const mockInscriptions = ref<{ id: string; jeuneId: string; actionId: string; actionDateId: string | null; date: string }[]>([])
vi.mock('#imports', () => ({
  useAuth: () => ({ inscriptions: mockInscriptions }),
  computed: (fn: () => any) => ({ value: fn() }),
  ref: (val: any) => ({ value: val }),
}))

// We need to mock Nuxt auto-imports
vi.stubGlobal('useAuth', () => ({ inscriptions: mockInscriptions }))
vi.stubGlobal('computed', (fn: () => any) => ref(fn()))

// Import after mocks are set up
const { useConflictCheck } = await import('~/composables/useConflictCheck')

describe('useConflictCheck', () => {
  beforeEach(() => {
    mockWarning.mockClear()
    mockInscriptions.value = []
  })

  function makeActionMap(entries: { id: number; title: string; dates: { id: string; date: string }[] }[]) {
    const map = new Map<string, { id: number; title: string; dates: { id: string; date: string }[] }>()
    for (const e of entries) map.set(String(e.id), e)
    return map
  }

  it('returns false when targetActionDate is null', () => {
    const { checkConflict } = useConflictCheck()
    const result = checkConflict('jeune-1', '10', null, new Map())
    expect(result).toBe(false)
    expect(mockWarning).not.toHaveBeenCalled()
  })

  it('returns false when no inscriptions exist', () => {
    const { checkConflict } = useConflictCheck()
    const map = makeActionMap([{ id: 10, title: 'Action A', dates: [{ id: 'd1', date: '2026-04-01' }] }])
    const result = checkConflict('jeune-1', '10', '2026-04-01', map)
    expect(result).toBe(false)
    expect(mockWarning).not.toHaveBeenCalled()
  })

  it('returns false when jeune has inscriptions on different dates', () => {
    mockInscriptions.value = [
      { id: 'i1', jeuneId: 'jeune-1', actionId: '20', actionDateId: 'd2', date: '2026-03-20' },
    ]
    const map = makeActionMap([
      { id: 10, title: 'Action A', dates: [{ id: 'd1', date: '2026-04-01' }] },
      { id: 20, title: 'Action B', dates: [{ id: 'd2', date: '2026-03-15' }] },
    ])
    const { checkConflict } = useConflictCheck()
    const result = checkConflict('jeune-1', '10', '2026-04-01', map)
    expect(result).toBe(false)
    expect(mockWarning).not.toHaveBeenCalled()
  })

  it('returns true and shows warning when jeune has inscription on same date', () => {
    mockInscriptions.value = [
      { id: 'i1', jeuneId: 'jeune-1', actionId: '20', actionDateId: 'd2', date: '2026-03-20' },
    ]
    const map = makeActionMap([
      { id: 10, title: 'Action A', dates: [{ id: 'd1', date: '2026-04-01' }] },
      { id: 20, title: 'Action B', dates: [{ id: 'd2', date: '2026-04-01' }] },
    ])
    const { checkConflict } = useConflictCheck()
    const result = checkConflict('jeune-1', '10', '2026-04-01', map)
    expect(result).toBe(true)
    expect(mockWarning).toHaveBeenCalledOnce()
    expect(mockWarning.mock.calls[0][0]).toContain('"Action B"')
  })

  it('ignores inscriptions for the target action itself', () => {
    mockInscriptions.value = [
      { id: 'i1', jeuneId: 'jeune-1', actionId: '10', actionDateId: 'd1', date: '2026-03-20' },
    ]
    const map = makeActionMap([
      { id: 10, title: 'Action A', dates: [{ id: 'd1', date: '2026-04-01' }] },
    ])
    const { checkConflict } = useConflictCheck()
    const result = checkConflict('jeune-1', '10', '2026-04-01', map)
    expect(result).toBe(false)
  })

  it('ignores inscriptions for a different jeune', () => {
    mockInscriptions.value = [
      { id: 'i1', jeuneId: 'jeune-2', actionId: '20', actionDateId: 'd2', date: '2026-03-20' },
    ]
    const map = makeActionMap([
      { id: 10, title: 'Action A', dates: [{ id: 'd1', date: '2026-04-01' }] },
      { id: 20, title: 'Action B', dates: [{ id: 'd2', date: '2026-04-01' }] },
    ])
    const { checkConflict } = useConflictCheck()
    const result = checkConflict('jeune-1', '10', '2026-04-01', map)
    expect(result).toBe(false)
  })

  it('handles dates with time component (splits on T)', () => {
    mockInscriptions.value = [
      { id: 'i1', jeuneId: 'jeune-1', actionId: '20', actionDateId: 'd2', date: '2026-03-20' },
    ]
    const map = makeActionMap([
      { id: 10, title: 'Action A', dates: [{ id: 'd1', date: '2026-04-01T14:00:00' }] },
      { id: 20, title: 'Action B', dates: [{ id: 'd2', date: '2026-04-01T09:00:00' }] },
    ])
    const { checkConflict } = useConflictCheck()
    const result = checkConflict('jeune-1', '10', '2026-04-01T14:00:00', map)
    expect(result).toBe(true)
  })

  it('lists multiple conflicting actions in warning', () => {
    mockInscriptions.value = [
      { id: 'i1', jeuneId: 'jeune-1', actionId: '20', actionDateId: 'd2', date: '2026-03-20' },
      { id: 'i2', jeuneId: 'jeune-1', actionId: '30', actionDateId: 'd3', date: '2026-03-20' },
    ]
    const map = makeActionMap([
      { id: 10, title: 'Action A', dates: [{ id: 'd1', date: '2026-04-01' }] },
      { id: 20, title: 'Action B', dates: [{ id: 'd2', date: '2026-04-01' }] },
      { id: 30, title: 'Action C', dates: [{ id: 'd3', date: '2026-04-01' }] },
    ])
    const { checkConflict } = useConflictCheck()
    const result = checkConflict('jeune-1', '10', '2026-04-01', map)
    expect(result).toBe(true)
    expect(mockWarning.mock.calls[0][0]).toContain('"Action B"')
    expect(mockWarning.mock.calls[0][0]).toContain('"Action C"')
  })

  it('skips actions not in the map', () => {
    mockInscriptions.value = [
      { id: 'i1', jeuneId: 'jeune-1', actionId: '99', actionDateId: null, date: '2026-03-20' },
    ]
    const map = makeActionMap([
      { id: 10, title: 'Action A', dates: [{ id: 'd1', date: '2026-04-01' }] },
    ])
    const { checkConflict } = useConflictCheck()
    const result = checkConflict('jeune-1', '10', '2026-04-01', map)
    expect(result).toBe(false)
  })
})
