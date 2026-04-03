<script setup lang="ts">
import { Loader2, CheckCircle, XCircle, ShieldCheck, Clock, ShieldOff } from 'lucide-vue-next'

const { get, save, saving } = useAdminSettings()

interface VeriffSettings {
  enabled: boolean
}

const form = reactive<VeriffSettings>({
  enabled: true,
})

const stats = ref<{ verified: number; pending: number; unverified: number } | null>(null)
const loadingStats = ref(true)
const connectionOk = ref<boolean | null>(null)

watchEffect(() => {
  const s = get<VeriffSettings>('veriff')
  form.enabled = s.enabled ?? true
})

async function handleSave() {
  await save('veriff', { enabled: form.enabled })
}

async function loadStats() {
  loadingStats.value = true
  try {
    const res = await $fetch<{ verified: number; pending: number; unverified: number; connectionOk: boolean }>('/api/admin/settings/veriff-stats')
    stats.value = { verified: res.verified, pending: res.pending, unverified: res.unverified }
    connectionOk.value = res.connectionOk
  } catch {
    connectionOk.value = false
  } finally {
    loadingStats.value = false
  }
}

onMounted(loadStats)
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-lg font-semibold text-prado-text mb-1">Vérification d'identité</h2>
      <p class="text-sm text-prado-text-muted">Service Veriff pour la vérification des pièces d'identité des jeunes.</p>
    </div>

    <!-- Status -->
    <div class="flex items-center gap-3 p-4 rounded-xl bg-prado-bg border border-prado-border">
      <div
        :class="[
          'w-2.5 h-2.5 rounded-full',
          connectionOk === null ? 'bg-prado-text-faint animate-pulse' : connectionOk ? 'bg-[#93C1AF]' : 'bg-red-400',
        ]"
      />
      <span class="text-sm text-prado-text">
        {{ connectionOk === null ? 'Vérification de la connexion...' : connectionOk ? 'Veriff connecté' : 'Connexion Veriff indisponible' }}
      </span>
    </div>

    <!-- Toggle -->
    <div class="flex items-center justify-between py-2">
      <div>
        <p class="text-sm text-prado-text font-medium">Vérification d'identité active</p>
        <p class="text-xs text-prado-text-faint mt-0.5">Si désactivé, les prescripteurs ne pourront pas lancer de vérification</p>
      </div>
      <button
        type="button"
        :class="[
          'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200',
          form.enabled ? 'bg-[var(--prado-signature)]' : 'bg-prado-border',
        ]"
        role="switch"
        :aria-checked="form.enabled"
        @click="form.enabled = !form.enabled"
      >
        <span
          :class="[
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200',
            form.enabled ? 'translate-x-5' : 'translate-x-0',
          ]"
        />
      </button>
    </div>

    <!-- Stats -->
    <div class="space-y-3">
      <h3 class="text-sm font-medium text-prado-text-secondary uppercase tracking-wider">Statistiques</h3>
      <div v-if="loadingStats" class="grid grid-cols-3 gap-3">
        <div v-for="n in 3" :key="n" class="h-20 rounded-xl bg-prado-bg animate-pulse" />
      </div>
      <div v-else-if="stats" class="grid grid-cols-3 gap-3">
        <div class="p-4 rounded-xl bg-prado-bg border border-prado-border text-center">
          <ShieldCheck :size="18" class="mx-auto mb-1.5 text-[#93C1AF]" />
          <p class="text-2xl font-bold text-prado-text">{{ stats.verified }}</p>
          <p class="text-[10px] text-prado-text-faint uppercase tracking-wider mt-1">Vérifiés</p>
        </div>
        <div class="p-4 rounded-xl bg-prado-bg border border-prado-border text-center">
          <Clock :size="18" class="mx-auto mb-1.5 text-[var(--prado-signature)]" />
          <p class="text-2xl font-bold text-prado-text">{{ stats.pending }}</p>
          <p class="text-[10px] text-prado-text-faint uppercase tracking-wider mt-1">En attente</p>
        </div>
        <div class="p-4 rounded-xl bg-prado-bg border border-prado-border text-center">
          <ShieldOff :size="18" class="mx-auto mb-1.5 text-prado-text-faint" />
          <p class="text-2xl font-bold text-prado-text">{{ stats.unverified }}</p>
          <p class="text-[10px] text-prado-text-faint uppercase tracking-wider mt-1">Non vérifiés</p>
        </div>
      </div>
    </div>

    <p class="text-xs text-prado-text-faint">Les clés API sont configurées dans les variables d'environnement du serveur.</p>

    <!-- Save -->
    <div class="pt-2">
      <button
        :disabled="saving"
        class="px-5 py-2.5 rounded-xl bg-[var(--prado-signature)] text-[var(--prado-signature-text)] text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        @click="handleSave"
      >
        <Loader2 v-if="saving" :size="14" class="animate-spin inline mr-1.5" />
        Enregistrer
      </button>
    </div>
  </div>
</template>
