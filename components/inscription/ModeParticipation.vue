<script setup lang="ts">
const props = defineProps<{
  accompagnateurPresent: boolean
  nomsAccompagnateurs: string
  personneUrgenceNom: string
  personneUrgenceTel: string
}>()

const emit = defineEmits<{
  'update:accompagnateurPresent': [value: boolean]
  'update:nomsAccompagnateurs': [value: string]
  'update:personneUrgenceNom': [value: string]
  'update:personneUrgenceTel': [value: string]
}>()

const inputClass = 'w-full px-3 py-2 rounded-xl bg-prado-input-bg border border-prado-border text-prado-text text-sm focus:outline-none focus:border-prado-border-medium'
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm font-medium text-prado-text">Mode de participation</p>

    <div class="space-y-2">
      <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
        :class="accompagnateurPresent
          ? 'border-prado-teal/40 bg-prado-teal/5'
          : 'border-prado-border hover:border-prado-border-medium'"
      >
        <input
          type="radio"
          :checked="accompagnateurPresent"
          name="mode-participation"
          class="text-prado-teal focus:ring-prado-teal"
          @change="emit('update:accompagnateurPresent', true)"
        />
        <div>
          <span class="text-sm text-prado-text">Avec accompagnateur</span>
          <p class="text-xs text-prado-text-muted">Un accompagnateur sera present lors de l'action</p>
        </div>
      </label>

      <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
        :class="!accompagnateurPresent
          ? 'border-prado-teal/40 bg-prado-teal/5'
          : 'border-prado-border hover:border-prado-border-medium'"
      >
        <input
          type="radio"
          :checked="!accompagnateurPresent"
          name="mode-participation"
          class="text-prado-teal focus:ring-prado-teal"
          @change="emit('update:accompagnateurPresent', false)"
        />
        <div>
          <span class="text-sm text-prado-text">En autonomie</span>
          <p class="text-xs text-prado-text-muted">Le jeune participe seul, une personne d'urgence sera renseignee</p>
        </div>
      </label>
    </div>

    <!-- Conditional fields: accompagnateur -->
    <div v-if="accompagnateurPresent" class="pl-4 border-l-2 border-prado-teal/30 space-y-3">
      <div>
        <label class="text-xs text-prado-text-muted mb-1 block">Nom(s) de l'accompagnateur</label>
        <input
          :value="nomsAccompagnateurs"
          type="text"
          placeholder="Nom et prenom"
          :class="inputClass"
          @input="emit('update:nomsAccompagnateurs', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- Conditional fields: autonomie -->
    <div v-if="!accompagnateurPresent" class="pl-4 border-l-2 border-prado-teal/30 space-y-3">
      <div>
        <label class="text-xs text-prado-text-muted mb-1 block">Personne d'urgence - nom</label>
        <input
          :value="personneUrgenceNom"
          type="text"
          placeholder="Nom et prenom"
          :class="inputClass"
          @input="emit('update:personneUrgenceNom', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div>
        <label class="text-xs text-prado-text-muted mb-1 block">Personne d'urgence - telephone</label>
        <input
          :value="personneUrgenceTel"
          type="tel"
          placeholder="06 XX XX XX XX"
          :class="inputClass"
          @input="emit('update:personneUrgenceTel', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>
