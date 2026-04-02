<script setup lang="ts">
import { computed, resolveComponent, type Component } from 'vue'

interface Props {
  icon?: Component
  title: string
  description?: string
  ctaLabel?: string
  ctaTo?: string
}

const props = defineProps<Props>()

defineSlots<{
  default(): unknown
}>()

const linkComponent = computed(() => {
  if (!props.ctaTo) return null
  try {
    const resolved = resolveComponent('NuxtLink')
    return typeof resolved === 'string' ? 'a' : resolved
  } catch {
    return 'a'
  }
})

const linkProps = computed(() => {
  if (!props.ctaTo) return {}
  if (linkComponent.value === 'a') {
    return { href: props.ctaTo }
  }
  return { to: props.ctaTo }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-10 px-4 text-center">
    <div class="w-14 h-14 rounded-2xl bg-prado-surface-hover flex items-center justify-center mb-4">
      <component v-if="icon" :is="icon" :size="24" class="text-prado-text-faint" />
      <svg
        v-else
        class="w-6 h-6 text-prado-text-faint"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>

    <p class="text-sm font-medium text-prado-text mb-1">{{ title }}</p>
    <p v-if="description" class="text-xs text-prado-text-muted max-w-xs mb-4">{{ description }}</p>

    <slot />

    <component
      v-if="ctaLabel && ctaTo"
      :is="linkComponent ?? 'a'"
      v-bind="linkProps"
      class="px-5 py-2 rounded-full bg-[var(--prado-signature)] text-[var(--prado-signature-text)] text-sm font-medium hover:brightness-110 transition-all"
    >
      {{ ctaLabel }}
    </component>
  </div>
</template>
