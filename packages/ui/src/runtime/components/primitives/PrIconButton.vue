<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { ButtonVariant, ButtonSize } from './PrButton.vue'

interface Props {
  icon: Component
  label: string
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
})

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-prado-orange text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-prado-orange/50',
  secondary:
    'bg-prado-sage text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-prado-sage/50',
  outline:
    'border border-prado-sage text-prado-sage bg-transparent hover:bg-prado-sage/10 focus-visible:ring-2 focus-visible:ring-prado-sage/50',
  ghost:
    'bg-transparent text-prado-text hover:bg-prado-surface-hover focus-visible:ring-2 focus-visible:ring-prado-sage/50',
  destructive:
    'bg-destructive text-destructive-foreground hover:brightness-110 focus-visible:ring-2 focus-visible:ring-destructive/50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-11 h-11',
}

const iconSizeMap: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
}

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer select-none',
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.disabled && 'opacity-50 pointer-events-none',
])
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled"
    :aria-label="label"
    type="button"
  >
    <component :is="icon" :size="iconSizeMap[size]" class="shrink-0" />
  </button>
</template>
