<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted, ref } from 'vue'

export type DialogVariant = 'default' | 'destructive'

interface Props {
  open: boolean
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: DialogVariant
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmation',
  confirmLabel: 'Confirmer',
  cancelLabel: 'Annuler',
  variant: 'default',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  cancel: []
}>()

defineSlots<{
  default(): unknown
  icon(): unknown
  footer(): unknown
}>()

const dialogRef = ref<HTMLDivElement>()

const confirmClasses = computed(() => {
  const base = 'px-4 py-2 rounded-xl text-sm text-white transition-colors font-medium'
  if (props.variant === 'destructive') {
    return `${base} bg-red-500 hover:bg-red-600`
  }
  return `${base} bg-prado-sage hover:bg-prado-sage/90`
})

function handleConfirm() {
  emit('confirm')
  emit('update:open', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:open', false)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    handleCancel()
  }
  // Basic focus trap
  if (event.key === 'Tab' && dialogRef.value) {
    const focusable = dialogRef.value.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  if (props.open) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="pr-dialog">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="handleCancel"
        />

        <!-- Dialog panel -->
        <div
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          class="relative rounded-2xl border border-prado-border p-6 max-w-md w-full shadow-xl"
          style="background-color: var(--prado-surface)"
        >
          <div class="flex items-start gap-4">
            <!-- Icon slot -->
            <div v-if="$slots.icon || variant === 'destructive'" class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="variant === 'destructive' ? 'bg-red-500/10' : 'bg-prado-sage/10'">
              <slot name="icon">
                <svg
                  v-if="variant === 'destructive'"
                  class="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5 text-prado-sage"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </slot>
            </div>

            <!-- Content -->
            <div class="flex-1">
              <h3 v-if="title" class="text-sm font-semibold text-prado-text mb-1">
                {{ title }}
              </h3>
              <p v-if="description" class="text-sm text-prado-text-secondary">
                {{ description }}
              </p>
              <div v-if="$slots.default" class="mt-2">
                <slot />
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 mt-6">
            <slot name="footer">
              <button
                class="px-4 py-2 rounded-xl text-sm text-prado-text-secondary border border-prado-border hover:bg-prado-surface-hover transition-colors"
                @click="handleCancel"
              >
                {{ cancelLabel }}
              </button>
              <button
                :class="confirmClasses"
                @click="handleConfirm"
              >
                {{ confirmLabel }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pr-dialog-enter-active,
.pr-dialog-leave-active {
  transition: opacity 0.15s ease;
}
.pr-dialog-enter-from,
.pr-dialog-leave-to {
  opacity: 0;
}
</style>
