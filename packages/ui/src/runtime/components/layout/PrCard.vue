<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  hoverable?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hoverable: false,
  clickable: false,
})

defineSlots<{
  default(): unknown
}>()

const classes = computed(() => [
  'bg-prado-surface border border-prado-border rounded-2xl overflow-hidden',
  props.hoverable && 'transition-shadow duration-200 hover:shadow-lg hover:shadow-black/10',
  props.clickable && 'cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/10 active:scale-[0.99]',
])
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
