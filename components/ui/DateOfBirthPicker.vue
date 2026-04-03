<script setup lang="ts">
/**
 * Thin wrapper around PrDatePicker that enforces birth date constraints:
 * - max = today (a baby born today)
 * - min = today - 18 years + 1 day (must be under 18)
 */
const model = defineModel<string>({ required: true })

const maxDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const minDate = computed(() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 18)
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})
</script>

<template>
  <PrDatePicker
    v-model="model"
    :min="minDate"
    :max="maxDate"
    required
  />
</template>
