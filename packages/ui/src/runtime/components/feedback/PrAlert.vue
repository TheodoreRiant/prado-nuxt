<script setup lang="ts">
import { computed, ref } from 'vue'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface Props {
  variant?: AlertVariant
  title?: string
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  closable: false,
})

defineSlots<{
  default(): unknown
}>()

const visible = ref(true)

const variantConfig: Record<AlertVariant, { bg: string; border: string; icon: string; text: string }> = {
  info: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    icon: 'text-sky-400',
    text: 'text-sky-300',
  },
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
    text: 'text-emerald-300',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
    text: 'text-amber-300',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    text: 'text-red-300',
  },
}

const config = computed(() => variantConfig[props.variant])

const alertClasses = computed(() => [
  'flex items-start gap-3 p-4 rounded-xl border',
  config.value.bg,
  config.value.border,
])

// SVG path data for icons per variant
const iconPaths: Record<AlertVariant, string> = {
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
}
</script>

<template>
  <div v-if="visible" :class="alertClasses" role="alert">
    <!-- Icon -->
    <svg
      class="w-5 h-5 shrink-0 mt-0.5"
      :class="config.icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        :d="iconPaths[variant]"
      />
    </svg>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p v-if="title" class="text-sm font-medium text-prado-text">
        {{ title }}
      </p>
      <div class="text-sm text-prado-text-secondary" :class="title && 'mt-1'">
        <slot />
      </div>
    </div>

    <!-- Close button -->
    <button
      v-if="closable"
      type="button"
      class="shrink-0 p-1 rounded-lg text-prado-text-muted hover:text-prado-text hover:bg-black/10 transition-colors"
      aria-label="Fermer"
      @click="visible = false"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
