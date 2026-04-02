<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  error?: string
  help?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  rows: 4,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaId = computed(() => props.id ?? `pr-textarea-${Math.random().toString(36).slice(2, 9)}`)

const textareaClasses = computed(() => [
  'w-full rounded-xl border bg-prado-input-bg text-prado-text placeholder:text-prado-text-faint transition-colors duration-200 resize-y',
  'focus:outline-none focus:ring-2 focus:ring-prado-sage/50 focus:border-prado-sage',
  'px-3 py-2.5 text-sm',
  props.error
    ? 'border-destructive focus:ring-destructive/50 focus:border-destructive'
    : 'border-prado-border-light hover:border-prado-border-medium',
  props.disabled && 'opacity-50 cursor-not-allowed',
])

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="textareaId"
      class="text-sm font-medium text-prado-text"
    >
      {{ label }}
      <span v-if="required" class="text-destructive ml-0.5">*</span>
    </label>

    <textarea
      :id="textareaId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :class="textareaClasses"
      :aria-describedby="error ? `${textareaId}-error` : help ? `${textareaId}-help` : undefined"
      :aria-invalid="error ? true : undefined"
      @input="onInput"
    />

    <p
      v-if="error"
      :id="`${textareaId}-error`"
      class="text-xs text-destructive"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="help"
      :id="`${textareaId}-help`"
      class="text-xs text-prado-text-muted"
    >
      {{ help }}
    </p>
  </div>
</template>
