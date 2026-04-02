<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  error?: string
  help?: string
  placeholder?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '06 12 34 56 78',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputRef = ref<HTMLInputElement>()
const inputId = computed(() => props.id ?? `pr-phone-${Math.random().toString(36).slice(2, 9)}`)

function formatPhone(value: string): string {
  const hasPlus = value.startsWith('+')
  const digits = value.replace(/\D/g, '')

  if (hasPlus && digits.startsWith('33')) {
    const local = digits.slice(2)
    const parts = local.match(/.{1,2}/g) ?? []
    return '+33 ' + parts.join(' ')
  }

  const parts = digits.match(/.{1,2}/g) ?? []
  return parts.join(' ')
}

function handleInput(e: Event) {
  const input = e.target as HTMLInputElement
  const raw = input.value
  const formatted = formatPhone(raw)
  emit('update:modelValue', formatted)

  nextTick(() => {
    if (inputRef.value) inputRef.value.value = formatted
  })
}

const isValid = computed(() => {
  if (!props.modelValue) return true
  const digits = props.modelValue.replace(/\D/g, '')
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('33'))
})

const inputClasses = computed(() => [
  'w-full px-3 py-2.5 rounded-xl bg-prado-input-bg border text-prado-text text-sm focus:outline-none focus:ring-2 focus:ring-prado-sage/50 transition-colors',
  props.error || !isValid.value
    ? 'border-destructive focus:ring-destructive/50 focus:border-destructive'
    : 'border-prado-border-light hover:border-prado-border-medium focus:border-prado-sage',
])
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="text-sm font-medium text-prado-text"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        :id="inputId"
        ref="inputRef"
        :value="modelValue"
        type="tel"
        :class="inputClasses"
        :placeholder="placeholder"
        maxlength="17"
        :aria-describedby="error ? `${inputId}-error` : help ? `${inputId}-help` : undefined"
        :aria-invalid="error || !isValid ? true : undefined"
        @input="handleInput"
      />
      <span
        v-if="modelValue && !isValid && !error"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-destructive"
      >
        Format invalide
      </span>
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
