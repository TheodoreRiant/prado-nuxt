<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

export interface PrBreadcrumbItem {
  label: string
  to?: string
}

interface Props {
  items: PrBreadcrumbItem[]
}

const props = defineProps<Props>()

const linkComponent = computed(() => {
  try {
    const resolved = resolveComponent('NuxtLink')
    return typeof resolved === 'string' ? 'a' : resolved
  } catch {
    return 'a'
  }
})

function getLinkProps(to: string) {
  if (linkComponent.value === 'a') {
    return { href: to }
  }
  return { to }
}
</script>

<template>
  <nav aria-label="Fil d'Ariane" class="flex items-center gap-2 text-sm">
    <template v-for="(item, idx) in items" :key="idx">
      <!-- Separator -->
      <span v-if="idx > 0" class="text-prado-text-faint select-none">/</span>

      <!-- Last item: not clickable -->
      <span
        v-if="idx === items.length - 1"
        class="text-prado-text font-medium truncate"
        aria-current="page"
      >
        {{ item.label }}
      </span>

      <!-- Clickable items -->
      <component
        v-else-if="item.to"
        :is="linkComponent"
        v-bind="getLinkProps(item.to)"
        class="text-prado-text-muted hover:text-prado-text transition-colors truncate"
      >
        {{ item.label }}
      </component>

      <!-- Non-clickable intermediate items -->
      <span v-else class="text-prado-text-muted truncate">
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
