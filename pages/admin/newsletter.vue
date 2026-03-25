<script setup lang="ts">
import { Loader2, Download, Check, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

definePageMeta({ middleware: ['auth', 'admin'] })

interface Subscriber {
  id: string; email: string; structure: string | null; source: string;
  subscribed_at: string; confirmed_at: string | null;
}

const subscribers = ref<Subscriber[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    subscribers.value = await $fetch<Subscriber[]>('/api/admin/newsletter')
  } catch { toast.error('Erreur chargement newsletter') }
  finally { loading.value = false }
})

async function handleExport() {
  window.open('/api/admin/newsletter/export', '_blank')
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-10 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-semibold text-prado-text">Inscrits Newsletter ({{ subscribers.length }})</h1>
      <button class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#004657] text-white text-sm hover:opacity-90 transition-opacity" @click="handleExport">
        <Download :size="16" /> Export CSV
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-20"><Loader2 class="animate-spin text-prado-text-muted" :size="32" /></div>

    <div v-else class="bg-prado-surface rounded-2xl border border-prado-border overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-prado-border text-prado-text-secondary text-left">
            <th class="px-4 py-3 font-medium">Email</th>
            <th class="px-4 py-3 font-medium">Structure</th>
            <th class="px-4 py-3 font-medium">Source</th>
            <th class="px-4 py-3 font-medium">Date</th>
            <th class="px-4 py-3 font-medium">Confirmé</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sub in subscribers" :key="sub.id" class="border-b border-prado-border last:border-0 hover:bg-prado-surface-hover">
            <td class="px-4 py-3 text-prado-text">{{ sub.email }}</td>
            <td class="px-4 py-3 text-prado-text-muted">{{ sub.structure || '-' }}</td>
            <td class="px-4 py-3 text-prado-text-muted">{{ sub.source }}</td>
            <td class="px-4 py-3 text-prado-text-muted">{{ new Date(sub.subscribed_at).toLocaleDateString('fr-FR') }}</td>
            <td class="px-4 py-3">
              <Check v-if="sub.confirmed_at" :size="16" class="text-[#93C1AF]" />
              <X v-else :size="16" class="text-prado-text-faint" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
