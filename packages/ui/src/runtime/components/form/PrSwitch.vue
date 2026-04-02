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

const switchId = computed(() => props.id ?? `pr-switch-${Math.random().toString(36).slice(2, 9)}`)

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div
    class="flex items-start gap-3"
    :class="disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
    @click="toggle"
  >
    <button
      :id="switchId"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      class="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-prado-sage/50 focus:ring-offset-2 focus:ring-offset-prado-bg"
      :class="modelValue ? 'bg-prado-sage' : 'bg-prado-border-medium'"
      :style="{ '--switch-background': modelValue ? 'var(--prado-sage)' : 'var(--prado-border-medium)' }"
      @click.stop="toggle"
    >
      <span
        class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
      />
    </button>

    <div v-if="label || description" class="flex flex-col gap-0.5">
      <label
        v-if="label"
        :for="switchId"
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
