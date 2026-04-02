<script setup lang="ts">
defineSlots<{
  default(): unknown
}>()
</script>

<template>
  <div class="px-5 py-4">
    <slot />
  </div>
</template>
