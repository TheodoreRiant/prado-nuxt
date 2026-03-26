import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock vue-sonner
const mockSuccess = vi.fn()
const mockError = vi.fn()
vi.mock('vue-sonner', () => ({
  toast: {
    success: (...args: any[]) => mockSuccess(...args),
    error: (...args: any[]) => mockError(...args),
  },
}))

// Mock Nuxt auto-imports
vi.stubGlobal('computed', (fn: () => any) => ({ value: fn() }))

// Mock import.meta.client
vi.stubGlobal('import', { meta: { client: true } })

const { useShare } = await import('~/composables/useShare')

describe('useShare', () => {
  beforeEach(() => {
    mockSuccess.mockClear()
    mockError.mockClear()
  })

  describe('copyLink', () => {
    it('copies URL to clipboard and shows success toast', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        writable: true,
        configurable: true,
      })

      const { copyLink } = useShare()
      await copyLink('https://example.com/action/1')

      expect(writeText).toHaveBeenCalledWith('https://example.com/action/1')
      expect(mockSuccess).toHaveBeenCalledWith('Lien copie dans le presse-papiers')
    })

    it('shows error toast when clipboard fails', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('denied'))
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        writable: true,
        configurable: true,
      })

      const { copyLink } = useShare()
      await copyLink('https://example.com')

      expect(mockError).toHaveBeenCalledWith('Impossible de copier le lien')
    })
  })

  describe('shareByEmail', () => {
    it('opens mailto link with encoded title and URL', () => {
      const mockOpen = vi.fn()
      vi.stubGlobal('window', { open: mockOpen })

      const { shareByEmail } = useShare()
      shareByEmail('Foodtruck', 'https://prado.fr/actions/1')

      expect(mockOpen).toHaveBeenCalledOnce()
      const url = mockOpen.mock.calls[0][0] as string
      expect(url).toContain('mailto:?')
      expect(url).toContain('subject=')
      expect(url).toContain('Foodtruck')
      expect(url).toContain('body=')
    })
  })

  describe('shareByWhatsApp', () => {
    it('opens WhatsApp share link', () => {
      const mockOpen = vi.fn()
      vi.stubGlobal('window', { open: mockOpen })

      const { shareByWhatsApp } = useShare()
      shareByWhatsApp('Fresque', 'https://prado.fr/actions/2')

      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/?text='),
        '_blank',
      )
      const url = mockOpen.mock.calls[0][0] as string
      expect(url).toContain('Fresque')
      expect(url).toContain('prado.fr')
    })
  })

  describe('share', () => {
    it('falls back to copyLink when native share is unavailable', async () => {
      // Remove navigator.share
      const nav = { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } }
      Object.defineProperty(globalThis, 'navigator', { value: nav, writable: true })

      const { share } = useShare()
      await share('Title', 'Text', 'https://prado.fr')

      expect(nav.clipboard.writeText).toHaveBeenCalledWith('https://prado.fr')
    })
  })
})
