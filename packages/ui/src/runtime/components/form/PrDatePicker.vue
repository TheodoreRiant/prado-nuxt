<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  error?: string
  help?: string
  min?: string
  max?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => props.id ?? `pr-date-${Math.random().toString(36).slice(2, 9)}`)

const inputClasses = computed(() => [
  'w-full px-3 py-2.5 rounded-xl bg-prado-input-bg border text-prado-text text-sm transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-prado-sage/50 focus:border-prado-sage',
  props.error
    ? 'border-destructive focus:ring-destructive/50 focus:border-destructive'
    : 'border-prado-border-light hover:border-prado-border-medium',
  props.disabled && 'opacity-50 cursor-not-allowed',
])

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="text-sm font-medium text-prado-text"
    >
      {{ label }}
      <span v-if="required" class="text-destructive ml-0.5">*</span>
    </label>

    <input
      :id="inputId"
      type="date"
      :value="modelValue"
      :min="min"
      :max="max"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      :aria-describedby="error ? `${inputId}-error` : help ? `${inputId}-help` : undefined"
      :aria-invalid="error ? true : undefined"
      @input="onInput"
    />

    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="text-xs text-destructive"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="help"
      :id="`${inputId}-help`"
      class="text-xs text-prado-text-muted"
    >
      {{ help }}
    </p>
  </div>
</template>
