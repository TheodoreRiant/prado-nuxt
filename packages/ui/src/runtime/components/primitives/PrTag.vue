<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  removable?: boolean
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  removable: false,
})

defineSlots<{
  default(): unknown
}>()

const emit = defineEmits<{
  remove: []
}>()

const tagStyle = computed(() => {
  if (!props.color) return {}
  return {
    backgroundColor: `${props.color}20`,
    color: props.color,
    borderColor: `${props.color}40`,
  }
})

const tagClass = computed(() => [
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
  !props.color && 'bg-prado-tag-bg text-prado-text-secondary border border-prado-border-light',
  props.color && 'border',
])
</script>

<template>
  <span :class="tagClass" :style="tagStyle">
    <slot />
    <button
      v-if="removable"
      type="button"
      class="ml-0.5 -mr-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
      aria-label="Retirer"
      @click.stop="emit('remove')"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </span>
</template>
