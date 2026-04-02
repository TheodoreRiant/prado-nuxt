<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  error?: string
  help?: string
  required?: boolean
  id?: string
}

const props = defineProps<Props>()

defineSlots<{
  default(): unknown
}>()

const fieldId = computed(() => props.id ?? `pr-field-${Math.random().toString(36).slice(2, 9)}`)
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="fieldId"
      class="text-sm font-medium text-prado-text"
    >
      {{ label }}
      <span v-if="required" class="text-destructive ml-0.5">*</span>
    </label>

    <slot />

    <p
      v-if="error"
      :id="`${fieldId}-error`"
      class="text-xs text-destructive"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="help"
      :id="`${fieldId}-help`"
      class="text-xs text-prado-text-muted"
    >
      {{ help }}
    </p>
  </div>
</template>
