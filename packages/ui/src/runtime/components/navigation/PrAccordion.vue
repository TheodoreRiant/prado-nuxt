<script setup lang="ts">
import { provide, ref, readonly } from 'vue'

interface Props {
  multiple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
})

defineSlots<{
  default(): unknown
}>()

const openItems = ref<Set<string>>(new Set())

function toggle(id: string) {
  const next = new Set(openItems.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    if (!props.multiple) {
      next.clear()
    }
    next.add(id)
  }
  openItems.value = next
}

function isOpen(id: string): boolean {
  return openItems.value.has(id)
}

provide('pr-accordion', {
  toggle,
  isOpen,
  openItems: readonly(openItems),
})
</script>

<template>
  <div class="space-y-3">
    <slot />
  </div>
</template>
