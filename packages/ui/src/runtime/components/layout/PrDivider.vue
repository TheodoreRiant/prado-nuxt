<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  vertical?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  vertical: false,
})

const wrapperClass = computed(() => [
  'flex items-center',
  props.vertical ? 'flex-col h-full' : 'w-full',
])

const lineClass = computed(() =>
  props.vertical
    ? 'w-px flex-1 bg-prado-border'
    : 'h-px flex-1 bg-prado-border',
)
</script>

<template>
  <div :class="wrapperClass" role="separator" :aria-orientation="vertical ? 'vertical' : 'horizontal'">
    <div :class="lineClass" />
    <span
      v-if="label"
      class="px-3 py-1 text-xs text-prado-text-muted whitespace-nowrap select-none"
    >
      {{ label }}
    </span>
    <div v-if="label" :class="lineClass" />
  </div>
</template>
