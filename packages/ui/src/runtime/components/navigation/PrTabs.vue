<script setup lang="ts">
import { computed, type Component } from 'vue'

export interface PrTabItem {
  value: string
  label: string
  icon?: Component
  disabled?: boolean
}

interface Props {
  modelValue?: string
  items: PrTabItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineSlots<{
  [key: `tab-${string}`]: () => unknown
}>()

const activeTab = computed(() => props.modelValue ?? props.items[0]?.value ?? '')

function selectTab(item: PrTabItem) {
  if (item.disabled) return
  emit('update:modelValue', item.value)
}
</script>

<template>
  <div>
    <!-- Tab bar -->
    <div
      class="flex gap-1 border-b border-prado-border overflow-x-auto"
      role="tablist"
    >
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        role="tab"
        :aria-selected="activeTab === item.value"
        :aria-disabled="item.disabled || undefined"
        :tabindex="item.disabled ? -1 : 0"
        class="relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0"
        :class="[
          activeTab === item.value
            ? 'text-prado-text'
            : 'text-prado-text-muted hover:text-prado-text',
          item.disabled && 'opacity-40 cursor-not-allowed',
          !item.disabled && 'cursor-pointer',
        ]"
        @click="selectTab(item)"
      >
        <component v-if="item.icon" :is="item.icon" :size="16" class="shrink-0" />
        {{ item.label }}
        <!-- Active indicator -->
        <span
          v-if="activeTab === item.value"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-prado-sage rounded-full"
        />
      </button>
    </div>

    <!-- Tab panels -->
    <div class="mt-4">
      <template v-for="item in items" :key="item.value">
        <div
          v-if="activeTab === item.value"
          role="tabpanel"
          :aria-label="item.label"
        >
          <slot :name="`tab-${item.value}`" />
        </div>
      </template>
    </div>
  </div>
</template>
