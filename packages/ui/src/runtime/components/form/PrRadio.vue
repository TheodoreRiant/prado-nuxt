<script setup lang="ts">
import { computed } from 'vue'

export interface PrRadioOption {
  value: string | number
  label: string
  description?: string
}

interface Props {
  modelValue?: string | number
  options: PrRadioOption[]
  name?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const groupName = computed(() => props.name ?? `pr-radio-${Math.random().toString(36).slice(2, 9)}`)

function select(value: string | number) {
  if (props.disabled) return
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex flex-col gap-3" role="radiogroup">
    <div
      v-for="option in options"
      :key="option.value"
      class="flex items-start gap-3 group"
      :class="disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
      @click="select(option.value)"
    >
      <button
        type="button"
        role="radio"
        :aria-checked="modelValue === option.value"
        :name="groupName"
        :disabled="disabled"
        class="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prado-sage/50"
        :class="modelValue === option.value
          ? 'border-prado-sage bg-prado-sage'
          : 'border-prado-border-medium bg-prado-input-bg group-hover:border-prado-sage/50'"
        @click.stop="select(option.value)"
      >
        <span
          v-if="modelValue === option.value"
          class="w-2 h-2 rounded-full bg-white"
        />
      </button>

      <div class="flex flex-col gap-0.5">
        <span
          class="text-sm font-medium text-prado-text select-none"
          :class="!disabled && 'cursor-pointer'"
        >
          {{ option.label }}
        </span>
        <p v-if="option.description" class="text-xs text-prado-text-muted">
          {{ option.description }}
        </p>
      </div>
    </div>
  </div>
</template>
