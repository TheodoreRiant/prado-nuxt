<script setup lang="ts">
interface PrMultiSelectOption {
  value: string
  label: string
}

interface Props {
  modelValue: string[]
  options: readonly PrMultiSelectOption[]
  label?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

function toggle(value: string) {
  if (props.modelValue.includes(value)) {
    emit('update:modelValue', props.modelValue.filter(v => v !== value))
  } else {
    emit('update:modelValue', [...props.modelValue, value])
  }
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <span v-if="label" class="text-sm font-medium text-prado-text">
      {{ label }}
    </span>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors"
        :class="modelValue.includes(opt.value)
          ? 'bg-[var(--prado-signature-muted)] border-[var(--prado-signature)]/30 text-prado-text'
          : 'bg-prado-input-bg border-prado-border text-prado-text-muted hover:border-prado-border-medium'"
        @click="toggle(opt.value)"
      >
        <span
          class="w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors"
          :class="modelValue.includes(opt.value)
            ? 'bg-[var(--prado-signature)] border-[var(--prado-signature)]'
            : 'border-prado-border'"
        >
          <svg
            v-if="modelValue.includes(opt.value)"
            class="w-2.5 h-2.5 text-[var(--prado-signature-text)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>
