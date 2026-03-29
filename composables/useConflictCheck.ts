import { toast } from 'vue-sonner'

interface ActionDateEntry {
  id: string
  date: string
}

interface ActionMapEntry {
  id: number
  title: string
  dates: ActionDateEntry[]
}

/**
 * Checks if a jeune already has an inscription on the same date as a target action date.
 * Shows a warning toast but does NOT block inscription.
 */
export function useConflictCheck() {
  const { inscriptions } = useAuth()

  function checkConflict(
    jeuneId: string,
    targetActionId: string,
    targetDate: string | null,
    actionMap: Map<string, ActionMapEntry>,
  ): boolean {
    if (!targetDate) return false

    const targetDateKey = targetDate.split('T')[0]

    const conflicting = inscriptions.value
      .filter(i => i.jeuneId === jeuneId && i.actionId !== targetActionId)
      .map(i => {
        const action = actionMap.get(i.actionId)
        if (!action) return null
        // Find the date this inscription is linked to
        const inscDate = i.actionDateId
          ? action.dates.find(d => d.id === i.actionDateId)?.date ?? null
          : null
        return { title: action.title, date: inscDate }
      })
      .filter((a): a is { title: string; date: string | null } => a !== null)
      .filter(a => a.date && a.date.split('T')[0] === targetDateKey)

    if (conflicting.length > 0) {
      const names = conflicting.map(c => `"${c.title}"`).join(', ')
      toast.warning(
        `Attention : ce jeune est deja inscrit a ${names} le meme jour (${new Date(targetDateKey).toLocaleDateString('fr-FR')}).`,
        { duration: 6000 },
      )
      return true
    }

    return false
  }

  return { checkConflict }
}
