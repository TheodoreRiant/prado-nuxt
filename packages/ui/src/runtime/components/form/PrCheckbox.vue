<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
  description?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checkboxId = computed(() => props.id ?? `pr-checkbox-${Math.random().toString(36).slice(2, 9)}`)

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div
    class="flex items-start gap-3 group"
    :class="disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
    @click="toggle"
  >
    <button
      :id="checkboxId"
      type="button"
      role="checkbox"
      :aria-checked="modelValue"
      :disabled="disabled"
      class="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prado-sage/50"
      :class="modelValue
        ? 'bg-prado-sage border-prado-sage'
        : 'border-prado-border-medium bg-prado-input-bg group-hover:border-prado-sage/50'"
      @click.stop="toggle"
    >
      <svg
        v-if="modelValue"
        class="w-3 h-3 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </button>

    <div v-if="label || description" class="flex flex-col gap-0.5">
      <label
        v-if="label"
        :for="checkboxId"
        class="text-sm font-medium text-prado-text select-none"
        :class="!disabled && 'cursor-pointer'"
      >
        {{ label }}
      </label>
      <p v-if="description" class="text-xs text-prado-text-muted">
        {{ description }}
      </p>
    </div>
  </div>
</template>
