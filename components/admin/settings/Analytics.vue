<script setup lang="ts">
import { ExternalLink, Loader2 } from 'lucide-vue-next'

const { get, save, saving } = useAdminSettings()

interface AnalyticsSettings {
  clarityEnabled: boolean
  clarityProjectId: string
}

const form = reactive<AnalyticsSettings>({
  clarityEnabled: false,
  clarityProjectId: '',
})

watchEffect(() => {
  const s = get<AnalyticsSettings>('analytics')
  form.clarityEnabled = s.clarityEnabled ?? false
  form.clarityProjectId = s.clarityProjectId ?? ''
})

async function handleSave() {
  await save('analytics', { ...form })
}

const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-prado-input-bg border border-prado-border text-prado-text text-sm placeholder:text-prado-text-faint focus:outline-none focus:border-prado-signature/50 transition-colors'
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-lg font-semibold text-prado-text mb-1">Analytics (Clarity)</h2>
      <p class="text-sm text-prado-text-muted">Suivi anonymisé du comportement des visiteurs sur le site.</p>
    </div>

    <!-- Toggle -->
    <div class="flex items-center justify-between py-2">
      <div>
        <p class="text-sm text-prado-text font-medium">Activer Microsoft Clarity</p>
        <p class="text-xs text-prado-text-faint mt-0.5">Enregistrements de session et heatmaps anonymisés</p>
      </div>
      <button
        type="button"
        :class="[
          'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200',
          form.clarityEnabled ? 'bg-prado-signature' : 'bg-prado-border',
        ]"
        role="switch"
        :aria-checked="form.clarityEnabled"
        @click="form.clarityEnabled = !form.clarityEnabled"
      >
        <span
          :class="[
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200',
            form.clarityEnabled ? 'translate-x-5' : 'translate-x-0',
          ]"
        />
      </button>
    </div>

    <!-- Project ID -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="form.clarityEnabled" class="space-y-3">
        <div>
          <label class="block text-sm text-prado-text-muted mb-1.5">ID du projet</label>
          <input v-model="form.clarityProjectId" :class="inputClass" placeholder="abc1234xyz" />
          <p class="text-[10px] text-prado-text-faint mt-1">
            Clarity → Settings → Overview →
            <a href="https://clarity.microsoft.com/" target="_blank" rel="noopener" class="text-prado-signature-accent hover:underline">
              Project ID <ExternalLink :size="10" class="inline" />
            </a>
          </p>
        </div>
      </div>
    </Transition>

    <p class="text-xs text-prado-text-faint">
      Les données sont anonymisées et conformes à la politique de confidentialité du site.
    </p>

    <!-- Save -->
    <div class="pt-2">
      <button
        :disabled="saving"
        class="px-5 py-2.5 rounded-xl bg-prado-signature text-prado-signature-text text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        @click="handleSave"
      >
        <Loader2 v-if="saving" :size="14" class="animate-spin inline mr-1.5" />
        Enregistrer
      </button>
    </div>
  </div>
</template>
