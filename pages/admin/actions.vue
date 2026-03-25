<script setup lang="ts">
import { Loader2, Save, Users, Infinity } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

definePageMeta({ middleware: ['auth', 'admin'] })

const { client: prismic } = usePrismic()

interface ActionRow {
  id: number
  title: string
  category: string
  isActivite: boolean
  placesMax: number | null
  inscriptionsCount: number
}

const actions = ref<ActionRow[]>([])
const loading = ref(true)
const saving = ref<number | null>(null)

onMounted(async () => {
  try {
    const [prismicActions, placesData] = await Promise.all([
      prismic.getAllByType('action'),
      $fetch<{ actionId: number; placesMax: number | null; inscriptionsCount: number }[]>('/api/action-places'),
    ])

    const placesMap = new Map(placesData.map(p => [p.actionId, p]))

    actions.value = prismicActions.map(doc => {
      const id = doc.data.original_id as number
      const info = placesMap.get(id)
      return {
        id,
        title: (doc.data.title as string) || 'Sans titre',
        category: (doc.data.category as string) || '',
        isActivite: (doc.data.is_activite as boolean) ?? false,
        placesMax: info?.placesMax ?? null,
        inscriptionsCount: info?.inscriptionsCount ?? 0,
      }
    })
  } catch {
    toast.error('Erreur chargement actions')
  } finally {
    loading.value = false
  }
})

async function savePlaces(action: ActionRow) {
  saving.value = action.id
  try {
    await $fetch('/api/admin/actions', {
      method: 'PATCH',
      body: { id: action.id, places_max: action.placesMax },
    })
    toast.success(`Places mises à jour pour "${action.title}"`)
  } catch {
    toast.error('Erreur lors de la sauvegarde')
  } finally {
    saving.value = null
  }
}

function setUnlimited(action: ActionRow) {
  action.placesMax = null
  savePlaces(action)
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-10 space-y-6">
    <h1 class="text-xl font-semibold text-prado-text">Gestion des places par action</h1>

    <div v-if="loading" class="flex justify-center py-20">
      <Loader2 class="animate-spin text-prado-text-muted" :size="32" />
    </div>

    <div v-else class="bg-prado-surface rounded-2xl border border-prado-border overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-prado-border text-prado-text-secondary text-left">
            <th class="px-4 py-3 font-medium">Action</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium w-28">Inscrits</th>
            <th class="px-4 py-3 font-medium w-40">Places max</th>
            <th class="px-4 py-3 font-medium w-32" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in actions" :key="a.id" class="border-b border-prado-border last:border-0 hover:bg-prado-surface-hover">
            <td class="px-4 py-3">
              <div class="text-prado-text">{{ a.title }}</div>
              <div class="text-xs text-prado-text-faint">{{ a.category }}</div>
            </td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-0.5 rounded-full text-xs"
                :class="a.isActivite ? 'bg-[#CF006C]/15 text-[#CF006C]' : 'bg-prado-tag-bg text-prado-text-muted'"
              >
                {{ a.isActivite ? 'Planifié' : 'Sur mesure' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1.5 text-prado-text">
                <Users :size="14" class="text-prado-text-faint" />
                {{ a.inscriptionsCount }}
              </div>
            </td>
            <td class="px-4 py-3">
              <input
                :value="a.placesMax ?? ''"
                type="number"
                min="0"
                :placeholder="'∞'"
                class="w-full px-3 py-1.5 rounded-lg bg-prado-input-bg border border-prado-border text-prado-text text-sm focus:outline-none focus:border-prado-border-medium"
                @input="a.placesMax = ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : null"
              />
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-1">
                <button
                  class="p-1.5 rounded-lg hover:bg-[#93C1AF]/20 text-[#93C1AF] transition-colors"
                  title="Sauvegarder"
                  :disabled="saving === a.id"
                  @click="savePlaces(a)"
                >
                  <Loader2 v-if="saving === a.id" :size="16" class="animate-spin" />
                  <Save v-else :size="16" />
                </button>
                <button
                  class="p-1.5 rounded-lg hover:bg-prado-surface-hover text-prado-text-faint transition-colors"
                  title="Illimité"
                  @click="setUnlimited(a)"
                >
                  <Infinity :size="16" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
