<script setup lang="ts">
defineSlots<{
  default(): unknown
}>()
</script>

<template>
  <div class="flex items-center justify-end gap-3 px-5 py-4 border-t border-prado-border">
    <slot />
  </div>
</template>
