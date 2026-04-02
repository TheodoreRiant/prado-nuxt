<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  headerTitle?: string
  headerSubtitle?: string
  footerText?: string
  namePlaceholder?: string
  emailPlaceholder?: string
  messagePlaceholder?: string
  submitLabel?: string
  successTitle?: string
  successMessage?: string
  resetLabel?: string
}

withDefaults(defineProps<Props>(), {
  headerTitle: "Besoin d'aide ?",
  headerSubtitle: 'Notre equipe repond sous 48h.',
  namePlaceholder: 'Votre nom',
  emailPlaceholder: 'votre@email.fr',
  messagePlaceholder: 'Votre message...',
  submitLabel: 'Envoyer',
  successTitle: 'Message envoye !',
  successMessage: 'Nous vous repondrons dans les plus brefs delais.',
  resetLabel: 'Envoyer un autre message',
})

const emit = defineEmits<{
  submit: [data: { name: string; email: string; message: string }]
}>()

const isOpen = ref(false)
const form = ref({ name: '', email: '', message: '' })
const submitting = ref(false)
const success = ref(false)
const errorMsg = ref('')

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    success.value = false
    errorMsg.value = ''
  }
}

function handleSubmit() {
  if (!form.value.name || !form.value.email || !form.value.message) return
  submitting.value = true
  errorMsg.value = ''

  emit('submit', { ...form.value })
}

/** Call from parent after successful API call */
function onSuccess() {
  success.value = true
  submitting.value = false
  form.value = { name: '', email: '', message: '' }
}

/** Call from parent after failed API call */
function onError(message?: string) {
  errorMsg.value = message ?? 'Une erreur est survenue'
  submitting.value = false
}

defineExpose({ onSuccess, onError })

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg bg-prado-bg border border-prado-border text-prado-text text-sm placeholder:text-prado-text-faint focus:outline-none focus:border-[var(--prado-signature)]/50 transition-colors'
</script>

<template>
  <!-- Floating button -->
  <button
    class="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-prado-sage text-white shadow-lg shadow-prado-sage/30 hover:shadow-xl hover:shadow-prado-sage/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
    :class="isOpen ? 'rotate-90' : ''"
    @click="toggle"
  >
    <!-- Close icon -->
    <svg v-if="isOpen" class="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
    <!-- Chat icon -->
    <svg v-else class="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  </button>

  <!-- Chat panel -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-95"
  >
    <div
      v-if="isOpen"
      class="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl border border-prado-border shadow-2xl overflow-hidden"
      style="background-color: var(--prado-surface)"
    >
      <!-- Header -->
      <div class="bg-prado-sage px-5 py-4">
        <h3 class="text-white font-medium">{{ headerTitle }}</h3>
        <p v-if="headerSubtitle" class="text-white/70 text-sm">{{ headerSubtitle }}</p>
      </div>

      <!-- Content -->
      <div class="p-5">
        <!-- Success -->
        <div v-if="success" class="text-center py-6">
          <div class="w-12 h-12 rounded-full bg-[var(--prado-signature)]/20 flex items-center justify-center mx-auto mb-3">
            <svg class="w-5.5 h-5.5 text-[var(--prado-signature-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="text-prado-text font-medium mb-1">{{ successTitle }}</p>
          <p class="text-sm text-prado-text-muted">{{ successMessage }}</p>
          <button
            class="mt-4 text-sm text-[var(--prado-signature-accent)] hover:underline"
            @click="success = false"
          >
            {{ resetLabel }}
          </button>
        </div>

        <!-- Form -->
        <form v-else class="space-y-3" @submit.prevent="handleSubmit">
          <div>
            <input
              v-model="form.name"
              type="text"
              required
              :placeholder="namePlaceholder"
              :class="inputClass"
            />
          </div>
          <div>
            <input
              v-model="form.email"
              type="email"
              required
              :placeholder="emailPlaceholder"
              :class="inputClass"
            />
          </div>
          <div>
            <textarea
              v-model="form.message"
              required
              rows="3"
              :placeholder="messagePlaceholder"
              :class="inputClass + ' resize-none'"
            />
          </div>

          <p v-if="errorMsg" class="text-xs text-red-400">{{ errorMsg }}</p>

          <button
            type="submit"
            :disabled="submitting"
            class="w-full py-2.5 rounded-lg bg-[var(--prado-signature)] text-[var(--prado-signature-text)] text-sm hover:bg-[var(--prado-signature)]/80 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <!-- Spinner -->
            <svg v-if="submitting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <!-- Send icon -->
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
            {{ submitLabel }}
          </button>
        </form>
      </div>

      <!-- Footer -->
      <div v-if="footerText" class="px-5 py-3 border-t border-prado-border text-xs text-prado-text-faint text-center">
        {{ footerText }}
      </div>
    </div>
  </Transition>
</template>
