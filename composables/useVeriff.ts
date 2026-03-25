export function useVeriff() {
  const verifying = ref(false)
  const error = ref<string | null>(null)
  const status = ref<'idle' | 'started' | 'submitted' | 'finished' | 'canceled'>('idle')

  const startVerification = async (firstName?: string, lastName?: string) => {
    verifying.value = true
    error.value = null
    status.value = 'idle'

    try {
      // Create session server-side
      const session = await $fetch('/api/veriff/session', {
        method: 'POST',
        body: { firstName, lastName },
      })

      // Dynamically import Veriff InContext SDK (client-side only)
      const { createVeriffFrame, MESSAGES } = await import('@veriff/incontext-sdk')

      createVeriffFrame({
        url: session.sessionUrl,
        onEvent: (msg: string) => {
          switch (msg) {
            case MESSAGES.STARTED:
              status.value = 'started'
              break
            case MESSAGES.SUBMITTED:
              status.value = 'submitted'
              break
            case MESSAGES.FINISHED:
              status.value = 'finished'
              verifying.value = false
              break
            case MESSAGES.CANCELED:
              status.value = 'canceled'
              verifying.value = false
              break
          }
        },
      })
    } catch (err: any) {
      error.value = err.data?.message ?? 'Erreur lors du lancement de la vérification'
      verifying.value = false
    }
  }

  return {
    verifying,
    error,
    status,
    startVerification,
  }
}
