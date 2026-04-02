<script setup lang="ts">
defineSlots<{
  default(): unknown
  actions(): unknown
}>()
</script>

<template>
  <div class="flex items-start justify-between gap-4 px-5 pt-5 pb-0">
    <div class="flex-1 min-w-0">
      <slot />
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>
