<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface PrDateRange {
  start: string
  end: string
}

interface Props {
  modelValue?: PrDateRange
  label?: string
  min?: string
  max?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: PrDateRange]
}>()

const inputId = computed(() => `pr-daterange-${Math.random().toString(36).slice(2, 9)}`)

const startValue = ref(props.modelValue?.start ?? '')
const endValue = ref(props.modelValue?.end ?? '')
const error = ref('')

// Sync from parent
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      startValue.value = val.start
      endValue.value = val.end
    }
  },
)

function validate(): boolean {
  error.value = ''
  if (startValue.value && endValue.value && endValue.value < startValue.value) {
    error.value = 'La date de fin doit etre posterieure a la date de debut.'
    return false
  }
  return true
}

function handleStartChange(event: Event) {
  const target = event.target as HTMLInputElement
  startValue.value = target.value
  if (validate()) {
    emitValue()
  }
}

function handleEndChange(event: Event) {
  const target = event.target as HTMLInputElement
  endValue.value = target.value
  if (validate()) {
    emitValue()
  }
}

function emitValue() {
  emit('update:modelValue', {
    start: startValue.value,
    end: endValue.value,
  })
}

const inputClasses = computed(() => [
  'w-full px-3 py-2.5 rounded-xl bg-prado-input-bg border text-prado-text text-sm transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-prado-sage/50 focus:border-prado-sage',
  error.value
    ? 'border-destructive focus:ring-destructive/50 focus:border-destructive'
    : 'border-prado-border-light hover:border-prado-border-medium',
  props.disabled && 'opacity-50 cursor-not-allowed',
])

// Computed min for end date: at least the start date
const effectiveEndMin = computed(() => {
  if (startValue.value && props.min) {
    return startValue.value > props.min ? startValue.value : props.min
  }
  return startValue.value || props.min
})

// Computed max for start date: at most the end date
const effectiveStartMax = computed(() => {
  if (endValue.value && props.max) {
    return endValue.value < props.max ? endValue.value : props.max
  }
  return endValue.value || props.max
})
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="`${inputId}-start`"
      class="text-sm font-medium text-prado-text"
    >
      {{ label }}
      <span v-if="required" class="text-destructive ml-0.5">*</span>
    </label>

    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <!-- Start date -->
      <div class="flex-1 w-full">
        <label
          :for="`${inputId}-start`"
          class="sr-only"
        >
          Date de debut
        </label>
        <input
          :id="`${inputId}-start`"
          type="date"
          :value="startValue"
          :min="min"
          :max="effectiveStartMax"
          :disabled="disabled"
          :required="required"
          :class="inputClasses"
          :aria-describedby="error ? `${inputId}-error` : undefined"
          :aria-invalid="error ? true : undefined"
          @input="handleStartChange"
        />
      </div>

      <!-- Arrow separator -->
      <div class="hidden sm:flex items-center text-prado-text-muted px-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>

      <!-- End date -->
      <div class="flex-1 w-full">
        <label
          :for="`${inputId}-end`"
          class="sr-only"
        >
          Date de fin
        </label>
        <input
          :id="`${inputId}-end`"
          type="date"
          :value="endValue"
          :min="effectiveEndMin"
          :max="max"
          :disabled="disabled"
          :required="required"
          :class="inputClasses"
          :aria-describedby="error ? `${inputId}-error` : undefined"
          :aria-invalid="error ? true : undefined"
          @input="handleEndChange"
        />
      </div>
    </div>

    <!-- Error -->
    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="text-xs text-destructive"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
