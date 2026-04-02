<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  total: number
  pageSize: number
  modelValue: number
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 25,
  modelValue: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const canGoPrev = computed(() => props.modelValue > 1)
const canGoNext = computed(() => props.modelValue < totalPages.value)

// Generate visible page numbers with ellipsis
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = props.modelValue
  const pages: (number | 'ellipsis')[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  // Always show first page
  pages.push(1)

  if (current > 3) {
    pages.push('ellipsis')
  }

  // Pages around current
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('ellipsis')
  }

  // Always show last page
  pages.push(total)

  return pages
})

function goToPage(page: number) {
  const clamped = Math.min(Math.max(1, page), totalPages.value)
  emit('update:modelValue', clamped)
}
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-between text-sm text-prado-text-muted"
  >
    <span>{{ total }} resultat{{ total > 1 ? 's' : '' }} — page {{ modelValue }}/{{ totalPages }}</span>

    <div class="flex items-center gap-1">
      <!-- Previous -->
      <button
        :disabled="!canGoPrev"
        class="p-1.5 rounded-lg hover:bg-prado-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Page precedente"
        @click="goToPage(modelValue - 1)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" />
        </svg>
      </button>

      <!-- Page numbers -->
      <template v-for="(page, idx) in visiblePages" :key="idx">
        <span v-if="page === 'ellipsis'" class="px-1 text-prado-text-faint select-none">...</span>
        <button
          v-else
          class="w-8 h-8 rounded-lg text-xs font-medium transition-colors"
          :class="page === modelValue
            ? 'bg-prado-sage text-white'
            : 'text-prado-text-muted hover:bg-prado-surface-hover'"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button
        :disabled="!canGoNext"
        class="p-1.5 rounded-lg hover:bg-prado-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Page suivante"
        @click="goToPage(modelValue + 1)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
