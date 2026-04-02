<script setup lang="ts">
import { Loader2, Users, Check } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { Jeune } from '~/lib/api'

const props = defineProps<{
  actionId: string
  jeunes: Jeune[]
  existingJeuneIds: Set<string>
}>()

const emit = defineEmits<{
  done: []
}>()

const selectedJeuneIds = ref<string[]>([])
const accompagnateurPresent = ref(false)
const nomsAccompagnateurs = ref('')
const submitting = ref(false)

const availableJeunes = computed(() =>
  props.jeunes.filter(j => !props.existingJeuneIds.has(j.id)),
)

function toggleJeune(id: string) {
  if (selectedJeuneIds.value.includes(id)) {
    selectedJeuneIds.value = selectedJeuneIds.value.filter(v => v !== id)
  } else {
    selectedJeuneIds.value = [...selectedJeuneIds.value, id]
  }
}

function toggleAll() {
  if (selectedJeuneIds.value.length === availableJeunes.value.length) {
    selectedJeuneIds.value = []
  } else {
    selectedJeuneIds.value = availableJeunes.value.map(j => j.id)
  }
}

async function handleSubmit() {
  if (selectedJeuneIds.value.length === 0) {
    toast.error('Selectionnez au moins un jeune')
    return
  }
  submitting.value = true
  try {
    const result = await $fetch<{ created: number }>('/api/inscriptions/batch', {
      method: 'POST',
      body: {
        actionId: props.actionId,
        jeuneIds: selectedJeuneIds.value,
        accompagnateurPresent: accompagnateurPresent.value,
        nomsAccompagnateurs: nomsAccompagnateurs.value || undefined,
      },
    })
    toast.success(`${result.created} inscription(s) creee(s)`)
    emit('done')
  } catch (err: any) {
    toast.error(err.data?.message ?? 'Erreur lors de l\'inscription groupee')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium text-prado-text flex items-center gap-2">
        <Users :size="16" class="text-prado-text-faint" />
        Inscription groupee
      </p>
      <button
        v-if="availableJeunes.length > 0"
        type="button"
        class="text-xs text-prado-teal hover:underline"
        @click="toggleAll"
      >
        {{ selectedJeuneIds.length === availableJeunes.length ? 'Tout deselectionner' : 'Tout selectionner' }}
      </button>
    </div>

    <div v-if="availableJeunes.length === 0" class="text-sm text-prado-text-muted py-4 text-center">
      Tous les jeunes sont deja inscrits a cette action.
    </div>

    <div v-else class="space-y-1 max-h-60 overflow-y-auto">
      <label
        v-for="j in availableJeunes"
        :key="j.id"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
        :class="selectedJeuneIds.includes(j.id) ? 'bg-prado-teal/5' : 'hover:bg-prado-surface-hover'"
      >
        <span
          class="w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors"
          :class="selectedJeuneIds.includes(j.id)
            ? 'bg-prado-teal border-prado-teal'
            : 'border-prado-border'"
        >
          <Check v-if="selectedJeuneIds.includes(j.id)" :size="12" class="text-white" />
        </span>
        <span class="text-sm text-prado-text">{{ j.firstName }} {{ j.lastName }}</span>
      </label>
    </div>

    <div v-if="availableJeunes.length > 0" class="space-y-3 pt-2">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          v-model="accompagnateurPresent"
          type="checkbox"
          class="rounded border-prado-border text-prado-teal focus:ring-prado-teal"
        />
        <span class="text-sm text-prado-text">Accompagnateur present</span>
      </label>

      <div v-if="accompagnateurPresent">
        <label class="text-xs text-prado-text-muted mb-1 block">Nom de l'accompagnateur</label>
        <input
          v-model="nomsAccompagnateurs"
          type="text"
          placeholder="Nom et prenom"
          class="w-full px-3 py-2 rounded-xl bg-prado-input-bg border border-prado-border text-prado-text text-sm focus:outline-none focus:border-prado-border-medium"
        />
      </div>

      <button
        :disabled="selectedJeuneIds.length === 0 || submitting"
        class="w-full px-4 py-2.5 rounded-xl bg-prado-teal text-white text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        @click="handleSubmit"
      >
        <Loader2 v-if="submitting" :size="14" class="animate-spin" />
        Inscrire {{ selectedJeuneIds.length }} jeune{{ selectedJeuneIds.length > 1 ? 's' : '' }}
      </button>
    </div>
  </div>
</template>
