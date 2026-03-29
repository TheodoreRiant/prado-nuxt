import { toast } from 'vue-sonner'

interface SettingsState {
  [key: string]: Record<string, unknown>
}

export function useAdminSettings() {
  const settings = useState<SettingsState>('admin-settings', () => ({}))
  const loading = ref(false)
  const saving = ref(false)

  async function fetchSettings() {
    loading.value = true
    try {
      const data = await $fetch<SettingsState>('/api/admin/settings')
      settings.value = data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des paramètres'
      toast.error(message)
    } finally {
      loading.value = false
    }
  }

  async function save(key: string, value: Record<string, unknown>) {
    saving.value = true
    try {
      await $fetch('/api/admin/settings', {
        method: 'PATCH',
        body: { key, value },
      })
      // Optimistic update
      settings.value = {
        ...settings.value,
        [key]: { ...settings.value[key], ...value, _updatedAt: new Date().toISOString() },
      }
      toast.success('Paramètres enregistrés')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
      toast.error(message)
      throw err
    } finally {
      saving.value = false
    }
  }

  function get<T = Record<string, unknown>>(key: string): T {
    return (settings.value[key] ?? {}) as T
  }

  return {
    settings,
    loading,
    saving,
    fetchSettings,
    save,
    get,
  }
}
