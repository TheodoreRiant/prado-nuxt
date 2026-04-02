<script setup lang="ts">
import { computed, ref, type Component } from 'vue'

interface Props {
  src?: string
  alt?: string
  class?: string
  fallbackIcon?: Component
}

const props = defineProps<Props>()

const loaded = ref(false)
const didError = ref(false)

const PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

const showFallbackIcon = computed(() => props.fallbackIcon && (!props.src || didError.value))
const showPlaceholder = computed(() => !props.fallbackIcon && (!props.src || didError.value))

const displaySrc = computed(() => {
  if (!props.src || didError.value) return PLACEHOLDER
  return props.src
})
</script>

<template>
  <!-- Fallback icon mode -->
  <div
    v-if="showFallbackIcon"
    :class="[props.class, 'flex items-center justify-center bg-prado-surface-hover']"
  >
    <component :is="fallbackIcon" :size="24" class="text-prado-text-faint" />
  </div>

  <!-- Image mode (with placeholder fallback) -->
  <img
    v-else
    :src="displaySrc"
    :alt="props.alt"
    :class="[props.class, !loaded && !didError ? 'bg-gray-800/50' : '']"
    @load="loaded = true"
    @error="didError = true"
  />
</template>
