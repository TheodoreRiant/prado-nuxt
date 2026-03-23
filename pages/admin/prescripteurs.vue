<script setup lang="ts">
import { Loader2, Download, CheckCircle, XCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  fetchAllPrescripteurs,
  updatePrescripteurStatus,
  type AdminPrescripteur,
} from '~/lib/adminApi'
import { exportToCsv } from '~/utils/csvExport'

definePageMeta({ layout: 'admin', middleware: 'admin' })

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected'

const client = useSupabaseClient()
const prescripteurs = ref<AdminPrescripteur[]>([])
const loading = ref(true)
const filter = ref<FilterTab>('all')

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'pending', label: 'En attente' },
  { key: 'approved', label: 'Approuves' },
  { key: 'rejected', label: 'Rejetes' },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  approved: { label: 'Approuve', className: 'bg-[#93C1AF]/20 text-[#93C1AF]' },
  pending: { label: 'En attente', className: 'bg-[#FB6223]/20 text-[#FB6223]' },
  rejected: { label: 'Rejete', className: 'bg-red-500/20 text-red-400' },
}

const filtered = computed(() =>
  filter.value === 'all'
    ? prescripteurs.value
    : prescripteurs.value.filter(p => p.status === filter.value)
)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  try {
    prescripteurs.value = await fetchAllPrescripteurs(client)
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Erreur de chargement')
  } finally {
    loading.value = false
  }
}

async function handleStatusChange(id: string, status: 'approved' | 'rejected') {
  try {
    await updatePrescripteurStatus(client, id, status)
    prescripteurs.value = prescripteurs.value.map(p =>
      p.id === id ? { ...p, status } : p
    )
    toast.success(status === 'approved' ? 'Compte approuve' : 'Compte rejete')
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Erreur')
  }
}

function handleExport() {
  const headers = ['Nom', 'Email', 'Structure', 'Statut', 'Role', 'Date']
  const rows = filtered.value.map(p => [
    p.name,
    p.professional_email,
    p.structure,
    p.status,
    p.role,
    new Date(p.created_at).toLocaleDateString('fr-FR'),
  ])
  exportToCsv('prescripteurs.csv', headers, rows)
  toast.success('Export CSV telecharge')
}
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-32">
    <Loader2 class="animate-spin text-prado-text-muted" :size="32" />
  </div>

  <div v-else class="max-w-6xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-xl font-semibold text-prado-text italic">Prescripteurs</h1>
      <button
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#004657] text-white text-sm hover:opacity-90 transition-opacity"
        @click="handleExport"
      >
        <Download :size="16" />
        Exporter CSV
      </button>
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="{ key, label } in tabs"
        :key="key"
        :class="[
          'px-4 py-1.5 rounded-full text-sm transition-colors',
          filter === key
            ? 'bg-[#CF006C] text-white'
            : 'bg-prado-tag-bg text-prado-text-secondary hover:text-prado-text',
        ]"
        @click="filter = key"
      >
        {{ label }}
      </button>
    </div>

    <!-- Table -->
    <div class="bg-prado-surface rounded-2xl border border-prado-border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-prado-border">
              <th class="text-left px-4 py-3 text-prado-text-secondary font-medium">Nom</th>
              <th class="text-left px-4 py-3 text-prado-text-secondary font-medium hidden md:table-cell">Email</th>
              <th class="text-left px-4 py-3 text-prado-text-secondary font-medium hidden lg:table-cell">Structure</th>
              <th class="text-left px-4 py-3 text-prado-text-secondary font-medium">Statut</th>
              <th class="text-left px-4 py-3 text-prado-text-secondary font-medium hidden lg:table-cell">Role</th>
              <th class="text-left px-4 py-3 text-prado-text-secondary font-medium hidden xl:table-cell">Date</th>
              <th class="text-right px-4 py-3 text-prado-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in filtered"
              :key="p.id"
              class="border-b border-prado-border last:border-0 hover:bg-prado-surface-hover"
            >
              <td class="px-4 py-3 text-prado-text">{{ p.name }}</td>
              <td class="px-4 py-3 text-prado-text-secondary hidden md:table-cell">{{ p.professional_email }}</td>
              <td class="px-4 py-3 text-prado-text-secondary hidden lg:table-cell">{{ p.structure }}</td>
              <td class="px-4 py-3">
                <span :class="['inline-block px-2.5 py-0.5 rounded-full text-xs', (statusConfig[p.status] ?? statusConfig.pending).className]">
                  {{ (statusConfig[p.status] ?? statusConfig.pending).label }}
                </span>
              </td>
              <td class="px-4 py-3 text-prado-text-secondary hidden lg:table-cell">{{ p.role }}</td>
              <td class="px-4 py-3 text-prado-text-muted hidden xl:table-cell">
                {{ new Date(p.created_at).toLocaleDateString('fr-FR') }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="p.status !== 'approved'"
                    class="p-1.5 rounded-lg text-[#93C1AF] hover:bg-[#93C1AF]/10 transition-colors"
                    title="Approuver"
                    @click="handleStatusChange(p.id, 'approved')"
                  >
                    <CheckCircle :size="16" />
                  </button>
                  <button
                    v-if="p.status !== 'rejected'"
                    class="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Rejeter"
                    @click="handleStatusChange(p.id, 'rejected')"
                  >
                    <XCircle :size="16" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-prado-text-muted">
                Aucun prescripteur trouve
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
