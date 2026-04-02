<script setup lang="ts">
import { computed, inject, onMounted, type Ref } from 'vue'

interface Props {
  title: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
})

defineSlots<{
  default(): unknown
}>()

const itemId = `pr-accordion-${Math.random().toString(36).slice(2, 9)}`

const accordion = inject<{
  toggle: (id: string) => void
  isOpen: (id: string) => boolean
  openItems: Ref<Set<string>>
} | null>('pr-accordion', null)

const isOpen = computed(() => {
  if (!accordion) return false
  return accordion.openItems.value.has(itemId)
})

function toggle() {
  accordion?.toggle(itemId)
}

onMounted(() => {
  if (props.defaultOpen) {
    accordion?.toggle(itemId)
  }
})
</script>

<template>
  <div
    class="rounded-2xl border border-prado-border overflow-hidden transition-colors"
    :class="isOpen ? 'bg-prado-surface' : 'bg-transparent'"
  >
    <button
      type="button"
      class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span class="text-prado-text font-medium">{{ title }}</span>
      <svg
        class="w-5 h-5 shrink-0 transition-all duration-300"
        :class="isOpen ? 'rotate-180 text-prado-sage' : 'text-prado-text-muted'"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div
      class="grid transition-all duration-300 ease-in-out"
      :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <div class="px-6 pb-5 text-prado-text-secondary leading-relaxed">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
