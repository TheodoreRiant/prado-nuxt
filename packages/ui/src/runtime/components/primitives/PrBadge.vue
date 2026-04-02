<script setup lang="ts">
import { computed } from 'vue'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'
export type BadgeSize = 'sm' | 'md'

interface Props {
  variant?: BadgeVariant
  size?: BadgeSize
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
})

defineSlots<{
  default(): unknown
}>()

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-prado-tag-bg text-prado-text-secondary',
  success: 'bg-emerald-500/15 text-emerald-400',
  warning: 'bg-amber-500/15 text-amber-400',
  error: 'bg-red-500/15 text-red-400',
  info: 'bg-sky-500/15 text-sky-400',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
}

const classes = computed(() => [
  'inline-flex items-center font-medium rounded-full whitespace-nowrap',
  variantClasses[props.variant],
  sizeClasses[props.size],
])
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
