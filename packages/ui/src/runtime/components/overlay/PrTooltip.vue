<script setup lang="ts">
import { ref, computed } from 'vue'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

interface Props {
  content: string
  position?: TooltipPosition
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
})

defineSlots<{
  default(): unknown
}>()

const visible = ref(false)

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

const arrowClasses: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-prado-text border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-prado-text border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-prado-text border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-prado-text border-y-transparent border-l-transparent',
}

const tooltipClasses = computed(() => [
  'absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-prado-text rounded-lg whitespace-nowrap pointer-events-none',
  positionClasses[props.position],
])

const arrowClass = computed(() => [
  'absolute w-0 h-0 border-4',
  arrowClasses[props.position],
])
</script>

<template>
  <div
    class="relative inline-flex"
    @mouseenter="visible = true"
    @mouseleave="visible = false"
    @focusin="visible = true"
    @focusout="visible = false"
  >
    <slot />

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="visible && content" :class="tooltipClasses" role="tooltip">
        {{ content }}
        <span :class="arrowClass" />
      </div>
    </Transition>
  </div>
</template>
