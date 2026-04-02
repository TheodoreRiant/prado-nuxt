<script setup lang="ts">
import { computed } from 'vue'

export interface PrSelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue?: string | number
  label?: string
  options: PrSelectOption[]
  placeholder?: string
  error?: string
  help?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  placeholder: 'Sélectionner...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const selectId = computed(() => props.id ?? `pr-select-${Math.random().toString(36).slice(2, 9)}`)

const selectClasses = computed(() => [
  'w-full rounded-xl border bg-prado-input-bg text-prado-text transition-colors duration-200 appearance-none',
  'focus:outline-none focus:ring-2 focus:ring-prado-sage/50 focus:border-prado-sage',
  'px-3 py-2.5 pr-10 text-sm',
  props.error
    ? 'border-destructive focus:ring-destructive/50 focus:border-destructive'
    : 'border-prado-border-light hover:border-prado-border-medium',
  props.disabled && 'opacity-50 cursor-not-allowed',
])

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="selectId"
      class="text-sm font-medium text-prado-text"
    >
      {{ label }}
      <span v-if="required" class="text-destructive ml-0.5">*</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="selectClasses"
        :aria-describedby="error ? `${selectId}-error` : help ? `${selectId}-help` : undefined"
        :aria-invalid="error ? true : undefined"
        @change="onChange"
      >
        <option v-if="placeholder" value="" disabled :selected="!modelValue">
          {{ placeholder }}
        </option>
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>

      <!-- Chevron icon -->
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-prado-text-muted">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>

    <p
      v-if="error"
      :id="`${selectId}-error`"
      class="text-xs text-destructive"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="help"
      :id="`${selectId}-help`"
      class="text-xs text-prado-text-muted"
    >
      {{ help }}
    </p>
  </div>
</template>
