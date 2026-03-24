/**
 * Onboarding state management.
 * Tracks which steps the user has completed post-registration.
 * Persists to localStorage for cross-session continuity.
 */
const STORAGE_KEY = 'prado-onboarding'

interface OnboardingState {
  accountCreated: boolean
  profileCompleted: boolean
  catalogVisited: boolean
  firstJeuneAdded: boolean
  firstInscription: boolean
}

const defaultState: OnboardingState = {
  accountCreated: false,
  profileCompleted: false,
  catalogVisited: false,
  firstJeuneAdded: false,
  firstInscription: false,
}

export function useOnboarding() {
  const state = useState<OnboardingState>('onboarding', () => ({ ...defaultState }))
  const dismissed = useState<boolean>('onboarding-dismissed', () => false)

  function loadFromStorage() {
    if (import.meta.server) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<OnboardingState>
        state.value = { ...defaultState, ...parsed }
      }
    } catch { /* ignore */ }
  }

  function saveToStorage() {
    if (import.meta.server) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  }

  function complete(step: keyof OnboardingState) {
    if (state.value[step]) return
    state.value = { ...state.value, [step]: true }
    saveToStorage()
  }

  function dismiss() {
    dismissed.value = true
  }

  function reset() {
    state.value = { ...defaultState }
    dismissed.value = false
    if (!import.meta.server) localStorage.removeItem(STORAGE_KEY)
  }

  const completedCount = computed(() =>
    Object.values(state.value).filter(Boolean).length,
  )

  const totalSteps = computed(() => Object.keys(state.value).length)

  const progress = computed(() =>
    Math.round((completedCount.value / totalSteps.value) * 100),
  )

  const isComplete = computed(() => completedCount.value === totalSteps.value)

  const showChecklist = computed(() => !isComplete.value && !dismissed.value)

  const steps = computed(() => [
    { key: 'accountCreated' as const, label: 'Créer votre compte', done: state.value.accountCreated },
    { key: 'profileCompleted' as const, label: 'Compléter votre profil', done: state.value.profileCompleted },
    { key: 'catalogVisited' as const, label: 'Parcourir le catalogue d\'actions', done: state.value.catalogVisited },
    { key: 'firstJeuneAdded' as const, label: 'Ajouter un premier jeune', done: state.value.firstJeuneAdded },
    { key: 'firstInscription' as const, label: 'Inscrire un jeune à une action', done: state.value.firstInscription },
  ])

  return {
    state,
    steps,
    completedCount,
    totalSteps,
    progress,
    isComplete,
    showChecklist,
    complete,
    dismiss,
    reset,
    loadFromStorage,
  }
}
