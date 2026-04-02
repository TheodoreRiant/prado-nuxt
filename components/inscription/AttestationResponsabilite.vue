<script setup lang="ts">
const checked = defineModel<boolean>({ required: true })
</script>

<template>
  <label class="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors"
    :class="checked
      ? 'border-prado-teal/40 bg-prado-teal/5'
      : 'border-prado-border hover:border-prado-border-medium'"
  >
    <input
      v-model="checked"
      type="checkbox"
      class="mt-0.5 rounded border-prado-border text-prado-teal focus:ring-prado-teal"
    />
    <div>
      <span class="text-sm text-prado-text font-medium">Attestation de responsabilite</span>
      <p class="text-xs text-prado-text-muted mt-1 leading-relaxed">
        Je certifie que le jeune est apte a participer a cette activite et degage l'association de toute responsabilite en cas d'accident.
      </p>
    </div>
  </label>
</template>
