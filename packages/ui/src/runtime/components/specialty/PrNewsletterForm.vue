<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  showStructure?: boolean
  submitLabel?: string
  emailPlaceholder?: string
  structurePlaceholder?: string
  successMessage?: string
}

withDefaults(defineProps<Props>(), {
  showStructure: false,
  emailPlaceholder: 'votre@email.fr',
  structurePlaceholder: 'Votre structure (optionnel)',
  successMessage: 'Inscription confirmee !',
})

const emit = defineEmits<{
  submit: [data: { email: string; structure?: string }]
}>()

const email = ref('')
const structure = ref('')
const submitting = ref(false)
const success = ref(false)
const errorMsg = ref('')

function handleSubmit() {
  if (!email.value) return
  submitting.value = true
  errorMsg.value = ''

  emit('submit', {
    email: email.value,
    structure: structure.value || undefined,
  })
}

/** Call from parent after successful API call */
function onSuccess() {
  success.value = true
  submitting.value = false
  email.value = ''
  structure.value = ''
}

/** Call from parent after failed API call */
function onError(message?: string) {
  errorMsg.value = message ?? 'Une erreur est survenue'
  submitting.value = false
}

/** Call to reset the form back to default state */
function reset() {
  success.value = false
  submitting.value = false
  errorMsg.value = ''
  email.value = ''
  structure.value = ''
}

defineExpose({ onSuccess, onError, reset })
</script>

<template>
  <!-- Success state -->
  <div v-if="success" class="flex items-center gap-2 text-[var(--prado-signature-accent)]">
    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    <span class="text-sm">{{ successMessage }}</span>
  </div>

  <!-- Form -->
  <form v-else class="space-y-3" @submit.prevent="handleSubmit">
    <div class="flex gap-2">
      <input
        v-model="email"
        type="email"
        required
        :placeholder="emailPlaceholder"
        class="flex-1 px-4 py-2.5 rounded-xl bg-prado-surface border border-prado-border text-prado-text text-sm placeholder:text-prado-text-faint focus:outline-none focus:border-[var(--prado-signature)]/50 transition-colors"
      />
      <button
        type="submit"
        :disabled="submitting || !email"
        class="px-5 py-2.5 rounded-xl bg-[var(--prado-signature)] text-[var(--prado-signature-text)] text-sm hover:bg-[var(--prado-signature)]/80 hover:shadow-lg hover:shadow-[var(--prado-signature)]/20 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
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
      </button>
    </div>

    <!-- Optional structure field -->
    <input
      v-if="showStructure"
      v-model="structure"
      type="text"
      :placeholder="structurePlaceholder"
      class="w-full px-4 py-2.5 rounded-xl bg-prado-surface border border-prado-border text-prado-text text-sm placeholder:text-prado-text-faint focus:outline-none focus:border-[var(--prado-signature)]/50 transition-colors"
    />

    <p v-if="errorMsg" class="text-xs text-red-400">{{ errorMsg }}</p>
  </form>
</template>
