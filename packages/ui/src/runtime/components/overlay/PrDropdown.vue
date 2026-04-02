<script setup lang="ts">
import { ref, onMounted, onUnmounted, type Component } from 'vue'

export interface PrDropdownItem {
  label: string
  value: string
  icon?: Component
  disabled?: boolean
  separator?: boolean
}

interface Props {
  items: PrDropdownItem[]
}

defineProps<Props>()

const emit = defineEmits<{
  select: [value: string]
}>()

defineSlots<{
  trigger(): unknown
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLDivElement>()

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function selectItem(item: PrDropdownItem) {
  if (item.disabled) return
  emit('select', item.value)
  close()
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    close()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="dropdownRef" class="relative inline-flex">
    <!-- Trigger -->
    <div @click="toggle">
      <slot name="trigger">
        <button
          type="button"
          class="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-prado-text border border-prado-border hover:bg-prado-surface-hover transition-colors"
        >
          Options
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </slot>
    </div>

    <!-- Menu -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-xl border border-prado-border shadow-xl overflow-hidden"
        style="background-color: var(--prado-surface)"
        role="menu"
      >
        <template v-for="(item, idx) in items" :key="idx">
          <!-- Separator -->
          <div v-if="item.separator" class="h-px bg-prado-border my-1" role="separator" />

          <!-- Item -->
          <button
            v-else
            type="button"
            role="menuitem"
            :disabled="item.disabled"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors"
            :class="item.disabled
              ? 'text-prado-text-faint cursor-not-allowed'
              : 'text-prado-text hover:bg-prado-surface-hover'"
            @click="selectItem(item)"
          >
            <component v-if="item.icon" :is="item.icon" :size="16" class="shrink-0" />
            {{ item.label }}
          </button>
        </template>
      </div>
    </Transition>
  </div>
</template>
