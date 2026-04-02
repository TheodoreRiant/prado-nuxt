<script setup lang="ts">
import { Loader2, Users } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const props = defineProps<{
  year: string
}>()

interface ProfilStats {
  year: string
  totalJeunes: number
  ageMedian: number | null
  repartitionSexe: Record<string, number>
  repartitionSituation: Record<string, number>
}

const data = ref<ProfilStats | null>(null)
const loading = ref(true)

const sexeLabels: Record<string, string> = {
  homme: 'Homme',
  femme: 'Femme',
  non_renseigne: 'Non renseigne',
}

const situationLabels: Record<string, string> = {
  sans_emploi: 'Sans emploi',
  scolarise_ordinaire: 'Scolarise en milieu ordinaire',
  scolarise_medico_social: 'Scolarise en milieu medico-social',
  emploi_formation: 'Emploi / Formation',
  autre: 'Autre',
  non_renseigne: 'Non renseigne',
}

async function load() {
  loading.value = true
  try {
    data.value = await $fetch<ProfilStats>('/api/admin/stats/profils', {
      query: { year: props.year },
    })
  } catch {
    toast.error('Erreur chargement stats profils')
  } finally {
    loading.value = false
  }
}

watch(() => props.year, load, { immediate: true })

function maxValue(record: Record<string, number>): number {
  const values = Object.values(record)
  return values.length > 0 ? Math.max(...values) : 1
}
</script>

<template>
  <div class="bg-prado-surface rounded-2xl border border-prado-border p-5">
    <div class="flex items-center gap-2 mb-4">
      <Users :size="16" class="text-prado-text-faint" />
      <h3 class="text-sm font-semibold text-prado-text">Profils et situations</h3>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <Loader2 :size="20" class="animate-spin text-prado-text-muted" />
    </div>

    <template v-else-if="data">
      <!-- Key metrics -->
      <div class="grid grid-cols-2 gap-3 mb-5">
        <div class="text-center p-3 rounded-xl bg-prado-bg-deep">
          <p class="text-xl font-semibold text-prado-text">{{ data.totalJeunes }}</p>
          <p class="text-xs text-prado-text-muted">Jeunes actifs</p>
        </div>
        <div class="text-center p-3 rounded-xl bg-prado-bg-deep">
          <p class="text-xl font-semibold text-prado-text">
            {{ data.ageMedian != null ? `${data.ageMedian} ans` : '-' }}
          </p>
          <p class="text-xs text-prado-text-muted">Age median</p>
        </div>
      </div>

      <!-- Sexe repartition -->
      <div class="mb-5">
        <p class="text-xs text-prado-text-muted mb-2 font-medium">Repartition par sexe</p>
        <div v-if="Object.keys(data.repartitionSexe).length === 0" class="text-xs text-prado-text-faint">
          Aucune donnee
        </div>
        <div v-else class="space-y-2">
          <div v-for="(count, key) in data.repartitionSexe" :key="key" class="flex items-center gap-3">
            <span class="text-xs text-prado-text-secondary w-28 shrink-0 truncate">
              {{ sexeLabels[key] ?? key }}
            </span>
            <div class="flex-1 h-5 rounded-full bg-prado-bg-deep overflow-hidden">
              <div
                class="h-full rounded-full bg-prado-teal transition-all duration-500"
                :style="{ width: `${(count / maxValue(data.repartitionSexe)) * 100}%` }"
              />
            </div>
            <span class="text-xs text-prado-text font-medium w-8 text-right">{{ count }}</span>
          </div>
        </div>
      </div>

      <!-- Situation repartition -->
      <div>
        <p class="text-xs text-prado-text-muted mb-2 font-medium">Repartition par situation</p>
        <div v-if="Object.keys(data.repartitionSituation).length === 0" class="text-xs text-prado-text-faint">
          Aucune donnee
        </div>
        <div v-else class="space-y-2">
          <div v-for="(count, key) in data.repartitionSituation" :key="key" class="flex items-center gap-3">
            <span class="text-xs text-prado-text-secondary w-28 shrink-0 truncate" :title="situationLabels[key] ?? key">
              {{ situationLabels[key] ?? key }}
            </span>
            <div class="flex-1 h-5 rounded-full bg-prado-bg-deep overflow-hidden">
              <div
                class="h-full rounded-full bg-[#93C1AF] transition-all duration-500"
                :style="{ width: `${(count / maxValue(data.repartitionSituation)) * 100}%` }"
              />
            </div>
            <span class="text-xs text-prado-text font-medium w-8 text-right">{{ count }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
