<script setup lang="ts">
export interface PrTimelineItem {
  title: string
  description?: string
  date?: string
  icon?: string
  color?: 'sage' | 'orange' | 'teal' | 'red' | 'gray'
}

interface Props {
  items: PrTimelineItem[]
}

defineProps<Props>()

defineSlots<{
  item?: (props: { item: PrTimelineItem; index: number }) => unknown
  icon?: (props: { item: PrTimelineItem; index: number }) => unknown
}>()

const colorClasses: Record<string, { dot: string; ring: string }> = {
  sage: { dot: 'bg-prado-sage', ring: 'ring-prado-sage/20' },
  orange: { dot: 'bg-[var(--prado-orange)]', ring: 'ring-[var(--prado-orange)]/20' },
  teal: { dot: 'bg-[var(--prado-teal)]', ring: 'ring-[var(--prado-teal)]/20' },
  red: { dot: 'bg-red-500', ring: 'ring-red-500/20' },
  gray: { dot: 'bg-prado-text-muted', ring: 'ring-prado-text-muted/20' },
}

function getDotClasses(color?: string): string {
  const c = colorClasses[color ?? 'sage'] ?? colorClasses.sage
  return `${c.dot} ${c.ring}`
}
</script>

<template>
  <div class="relative" role="list">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="relative flex gap-4 pb-8 last:pb-0"
      role="listitem"
    >
      <!-- Vertical line -->
      <div class="flex flex-col items-center">
        <!-- Dot / icon -->
        <div class="relative z-10">
          <slot name="icon" :item="item" :index="index">
            <div
              class="w-3 h-3 rounded-full ring-4 shrink-0 mt-1.5"
              :class="getDotClasses(item.color)"
            />
          </slot>
        </div>
        <!-- Connector line -->
        <div
          v-if="index < items.length - 1"
          class="w-px flex-1 bg-prado-border mt-2"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0 pb-2">
        <slot name="item" :item="item" :index="index">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div class="min-w-0">
              <h4 class="text-sm font-medium text-prado-text">
                {{ item.title }}
              </h4>
              <p
                v-if="item.description"
                class="text-sm text-prado-text-secondary mt-0.5"
              >
                {{ item.description }}
              </p>
            </div>
            <time
              v-if="item.date"
              class="text-xs text-prado-text-faint whitespace-nowrap shrink-0"
            >
              {{ item.date }}
            </time>
          </div>
        </slot>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="items.length === 0"
      class="text-sm text-prado-text-muted text-center py-8"
    >
      Aucun element
    </div>
  </div>
</template>
