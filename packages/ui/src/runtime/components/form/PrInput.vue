<script setup lang="ts">
import { computed, type Component } from 'vue'

interface Props {
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  error?: string
  help?: string
  disabled?: boolean
  required?: boolean
  icon?: Component
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputId = computed(() => props.id ?? `pr-input-${Math.random().toString(36).slice(2, 9)}`)

const inputClasses = computed(() => [
  'w-full rounded-xl border bg-prado-input-bg text-prado-text placeholder:text-prado-text-faint transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-prado-sage/50 focus:border-prado-sage',
  props.icon ? 'pl-10 pr-3' : 'px-3',
  'py-2.5 text-sm',
  props.error
    ? 'border-destructive focus:ring-destructive/50 focus:border-destructive'
    : 'border-prado-border-light hover:border-prado-border-medium',
  props.disabled && 'opacity-50 cursor-not-allowed',
])

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
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

    <div class="relative">
      <div
        v-if="icon"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-prado-text-muted pointer-events-none"
      >
        <component :is="icon" :size="16" />
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        :aria-describedby="error ? `${inputId}-error` : help ? `${inputId}-help` : undefined"
        :aria-invalid="error ? true : undefined"
        @input="onInput"
      />
    </div>

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
