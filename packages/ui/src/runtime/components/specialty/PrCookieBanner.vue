<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  storageKey?: string
  acceptLabel?: string
  rejectLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  storageKey: 'prado-cookie-consent',
  acceptLabel: 'Accepter',
  rejectLabel: 'Refuser',
})

const emit = defineEmits<{
  accept: []
  reject: []
}>()

defineSlots<{
  default(): unknown
  link(): unknown
}>()

const visible = ref(false)

onMounted(() => {
  const consent = localStorage.getItem(props.storageKey)
  if (!consent) visible.value = true
})

function accept() {
  localStorage.setItem(props.storageKey, 'accepted')
  visible.value = false
  emit('accept')
}

function refuse() {
  localStorage.setItem(props.storageKey, 'refused')
  visible.value = false
  emit('reject')
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div v-if="visible" class="fixed bottom-0 left-0 right-0 z-[60] p-4">
      <div class="max-w-3xl mx-auto rounded-2xl border border-prado-border-light bg-prado-surface/95 backdrop-blur-xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex-1 text-sm text-prado-text-secondary leading-relaxed">
          <slot>
            Ce site utilise des cookies pour ameliorer votre experience.
          </slot>
          <slot name="link" />
        </div>
        <div class="flex gap-2 shrink-0">
          <button
            class="px-5 py-2 rounded-full text-sm border border-prado-border-medium text-prado-text hover:bg-prado-surface-hover transition-colors"
            @click="refuse"
          >
            {{ rejectLabel }}
          </button>
          <button
            class="px-5 py-2 rounded-full text-sm bg-[var(--prado-signature)] text-[var(--prado-signature-text)] hover:bg-[var(--prado-signature)]/80 transition-colors"
            @click="accept"
          >
            {{ acceptLabel }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
