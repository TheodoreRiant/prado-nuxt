<script setup lang="ts">
import { Loader2, Users, CalendarDays, Euro, Building2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const props = defineProps<{
  actionId: string | number
}>()

interface RapportInscription {
  id: string
  jeuneId: string
  jeuneFirstName: string
  jeuneLastName: string
  jeuneSex: string
  jeuneSituation: string
  prescripteurName: string
  presence: 'inscrit' | 'present' | 'absent'
  accompagnateurPresent: boolean
  nomsAccompagnateurs: string | null
  attestationResponsabilite: boolean
  createdAt: string
}

interface RapportData {
  action: {
    id: number
    title: string
    category: string
    date: string | null
    time: string | null
    summary: string
    description: string
    cost: number | null
    isRecurring: boolean
    etablissement: {
      id: string
      name: string
      address: string | null
      postalCode: string | null
      city: string | null
    } | null
  }
  dates: Array<{ id: string; date: string; time: string; placesMax: number | null }>
  inscriptions: RapportInscription[]
  stats: {
    totalInscrits: number
    totalPresents: number
    totalAbsents: number
    totalEnAttente: number
    tauxPresence: number
  }
}

const data = ref<RapportData | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    data.value = await $fetch<RapportData>(`/api/admin/actions/${props.actionId}/rapport`)
  } catch {
    toast.error('Erreur chargement du rapport')
  } finally {
    loading.value = false
  }
})

const presenceColors: Record<string, string> = {
  present: 'bg-emerald-500/15 text-emerald-600',
  absent: 'bg-red-500/15 text-red-400',
  inscrit: 'bg-prado-tag-bg text-prado-text-muted',
}

const presenceLabels: Record<string, string> = {
  present: 'Present',
  absent: 'Absent',
  inscrit: 'En attente',
}
</script>

<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Loader2 :size="24" class="animate-spin text-prado-text-muted" />
    </div>

    <template v-else-if="data">
      <!-- Action header -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-prado-text">{{ data.action.title }}</h2>
        <p class="text-sm text-prado-text-muted">{{ data.action.category }}</p>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div class="bg-prado-surface rounded-xl border border-prado-border p-4 text-center">
          <p class="text-2xl font-semibold text-prado-text">{{ data.stats.totalInscrits }}</p>
          <p class="text-xs text-prado-text-muted">Inscrits</p>
        </div>
        <div class="bg-prado-surface rounded-xl border border-prado-border p-4 text-center">
          <p class="text-2xl font-semibold text-emerald-500">{{ data.stats.totalPresents }}</p>
          <p class="text-xs text-prado-text-muted">Presents</p>
        </div>
        <div class="bg-prado-surface rounded-xl border border-prado-border p-4 text-center">
          <p class="text-2xl font-semibold text-red-400">{{ data.stats.totalAbsents }}</p>
          <p class="text-xs text-prado-text-muted">Absents</p>
        </div>
        <div class="bg-prado-surface rounded-xl border border-prado-border p-4 text-center">
          <p class="text-2xl font-semibold text-prado-teal">{{ data.stats.tauxPresence }}%</p>
          <p class="text-xs text-prado-text-muted">Taux presence</p>
        </div>
      </div>

      <!-- Action info -->
      <div class="bg-prado-surface rounded-2xl border border-prado-border p-5 mb-6 space-y-2">
        <div v-if="data.action.cost != null" class="flex items-center gap-2 text-sm text-prado-text-secondary">
          <Euro :size="14" class="text-prado-text-faint" />
          Cout : {{ data.action.cost }} euros
        </div>
        <div v-if="data.action.etablissement" class="flex items-center gap-2 text-sm text-prado-text-secondary">
          <Building2 :size="14" class="text-prado-text-faint" />
          {{ data.action.etablissement.name }}
          <span v-if="data.action.etablissement.city" class="text-prado-text-muted">
            ({{ data.action.etablissement.city }})
          </span>
        </div>
        <div v-if="data.dates.length > 0" class="flex items-center gap-2 text-sm text-prado-text-secondary">
          <CalendarDays :size="14" class="text-prado-text-faint" />
          {{ data.dates.length }} seance{{ data.dates.length > 1 ? 's' : '' }}
        </div>
      </div>

      <!-- Participants list -->
      <h3 class="text-sm font-semibold text-prado-text mb-3 flex items-center gap-2">
        <Users :size="16" class="text-prado-text-faint" />
        Participants ({{ data.inscriptions.length }})
      </h3>

      <div v-if="data.inscriptions.length === 0" class="text-sm text-prado-text-muted text-center py-8">
        Aucun participant.
      </div>

      <div v-else class="bg-prado-surface rounded-2xl border border-prado-border overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-prado-border">
              <th class="text-left px-4 py-3 text-prado-text-secondary font-medium">Jeune</th>
              <th class="text-left px-4 py-3 text-prado-text-secondary font-medium hidden sm:table-cell">Prescripteur</th>
              <th class="text-left px-4 py-3 text-prado-text-secondary font-medium">Presence</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="insc in data.inscriptions"
              :key="insc.id"
              class="border-b border-prado-border last:border-0"
            >
              <td class="px-4 py-3 text-prado-text">
                {{ insc.jeuneFirstName }} {{ insc.jeuneLastName }}
              </td>
              <td class="px-4 py-3 text-prado-text-muted hidden sm:table-cell">
                {{ insc.prescripteurName || '-' }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-block px-2 py-0.5 rounded-full text-xs"
                  :class="presenceColors[insc.presence]"
                >
                  {{ presenceLabels[insc.presence] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
