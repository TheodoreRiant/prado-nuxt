<script setup lang="ts">
import { computed } from 'vue'

export type SkeletonVariant = 'rect' | 'circle' | 'text'

interface Props {
  variant?: SkeletonVariant
  width?: string
  height?: string
  lines?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'rect',
  lines: 3,
})

const baseClasses = 'animate-pulse bg-prado-border/50'

const shapeClasses = computed(() => {
  if (props.variant === 'circle') {
    return `${baseClasses} rounded-full`
  }
  if (props.variant === 'text') {
    return '' // handled by lines loop
  }
  return `${baseClasses} rounded-xl`
})

const shapeStyle = computed(() => {
  if (props.variant === 'text') return {}
  return {
    width: props.width ?? (props.variant === 'circle' ? '3rem' : '100%'),
    height: props.height ?? (props.variant === 'circle' ? '3rem' : '1rem'),
  }
})

// Generate pseudo-random widths for text lines
const lineWidths = computed(() => {
  const widths = ['100%', '92%', '75%', '85%', '60%', '95%', '70%', '88%']
  return Array.from({ length: props.lines }, (_, i) => widths[i % widths.length])
})
</script>

<template>
  <!-- Text variant: multiple lines -->
  <div v-if="variant === 'text'" class="space-y-2.5" :style="{ width: width ?? '100%' }">
    <div
      v-for="(w, i) in lineWidths"
      :key="i"
      :class="baseClasses"
      class="rounded-full"
      :style="{ width: w, height: height ?? '0.75rem' }"
    />
  </div>

  <!-- Rect / Circle variant -->
  <div v-else :class="shapeClasses" :style="shapeStyle" />
</template>
