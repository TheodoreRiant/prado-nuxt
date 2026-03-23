<script setup lang="ts">
import { Users, UserCheck, ClipboardList, Clock, Loader2, Eye } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { fetchDashboardStats } from '~/lib/adminApi'

definePageMeta({ layout: 'admin', middleware: 'admin' })

interface DashboardStats {
  prescripteursCount: number
  jeunesCount: number
  inscriptionsCount: number
  pendingCount: number
}

const client = useSupabaseClient()
const stats = ref<DashboardStats | null>(null)
const loading = ref(true)

const statCards = [
  { key: 'prescripteursCount' as const, label: 'Prescripteurs', icon: Users, color: '#CF006C' },
  { key: 'jeunesCount' as const, label: 'Jeunes', icon: UserCheck, color: '#FB6223' },
  { key: 'inscriptionsCount' as const, label: 'Inscriptions', icon: ClipboardList, color: '#93C1AF' },
  { key: 'pendingCount' as const, label: 'En attente', icon: Clock, color: '#C18ED8' },
]

onMounted(async () => {
  try {
    stats.value = await fetchDashboardStats(client)
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Erreur de chargement')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-32">
    <Loader2 class="animate-spin text-prado-text-muted" :size="32" />
  </div>

  <div v-else class="max-w-6xl mx-auto space-y-8">
    <h1 class="text-xl font-semibold text-prado-text italic">Tableau de bord</h1>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="{ key, label, icon: Icon, color } in statCards"
        :key="key"
        class="bg-prado-surface rounded-2xl border border-prado-border p-5 flex items-center gap-4"
      >
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center"
          :style="{ backgroundColor: `${color}20` }"
        >
          <component :is="Icon" :size="20" :style="{ color }" />
        </div>
        <div>
          <p class="text-2xl font-semibold text-prado-text">
            {{ stats ? stats[key] : '-' }}
          </p>
          <p class="text-xs text-prado-text-muted">{{ label }}</p>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="flex flex-wrap gap-3">
      <NuxtLink
        to="/admin/prescripteurs"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C18ED8] text-white text-sm hover:opacity-90 transition-opacity"
      >
        <Eye :size="16" />
        Voir les comptes en attente
      </NuxtLink>
    </div>
  </div>
</template>
