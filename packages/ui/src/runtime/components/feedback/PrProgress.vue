<script setup lang="ts">
import { computed } from 'vue'

export type ProgressVariant = 'default' | 'success'
export type ProgressSize = 'sm' | 'md' | 'lg'

interface Props {
  value?: number
  variant?: ProgressVariant
  size?: ProgressSize
  indeterminate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  variant: 'default',
  size: 'md',
  indeterminate: false,
})

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)))

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const barColor = computed(() => {
  if (props.variant === 'success') return 'bg-emerald-500'
  return 'bg-prado-sage'
})

const barStyle = computed(() => {
  if (props.indeterminate) return {}
  return { width: `${clampedValue.value}%` }
})
</script>

<template>
  <div
    class="w-full rounded-full bg-prado-border/30 overflow-hidden"
    :class="sizeClasses[size]"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : clampedValue"
    :aria-valuemin="0"
    :aria-valuemax="100"
  >
    <div
      :class="[
        'h-full rounded-full transition-all duration-300 ease-out',
        barColor,
        indeterminate && 'pr-progress-indeterminate',
      ]"
      :style="barStyle"
    />
  </div>
</template>

<style scoped>
.pr-progress-indeterminate {
  width: 40%;
  animation: pr-progress-slide 1.5s ease-in-out infinite;
}

@keyframes pr-progress-slide {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(150%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
