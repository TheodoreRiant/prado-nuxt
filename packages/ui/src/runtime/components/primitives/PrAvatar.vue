<script setup lang="ts">
import { computed, ref } from 'vue'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  src?: string
  alt?: string
  size?: AvatarSize
  fallback?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  alt: '',
  fallback: '',
})

const imageError = ref(false)

const showImage = computed(() => props.src && !imageError.value)

const initials = computed(() => {
  if (!props.fallback) return '?'
  return props.fallback
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-11 h-11 text-sm',
  xl: 'w-14 h-14 text-base',
}

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 font-medium select-none',
  sizeClasses[props.size],
  !showImage.value && 'bg-prado-sage/20 text-prado-sage',
])
</script>

<template>
  <span :class="classes" role="img" :aria-label="alt || fallback">
    <img
      v-if="showImage"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="imageError = true"
    />
    <span v-else aria-hidden="true">{{ initials }}</span>
  </span>
</template>
