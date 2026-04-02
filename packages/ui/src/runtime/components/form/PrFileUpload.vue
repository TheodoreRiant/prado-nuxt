<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  accept?: string
  maxSize?: number
  multiple?: boolean
  label?: string
  help?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  disabled: false,
})

const emit = defineEmits<{
  upload: [files: File[]]
}>()

const fileInputRef = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])
const isDragging = ref(false)
const error = ref('')

const inputId = computed(() => `pr-file-upload-${Math.random().toString(36).slice(2, 9)}`)

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function validateFiles(files: File[]): File[] {
  error.value = ''
  const valid: File[] = []

  for (const file of files) {
    // Check size
    if (props.maxSize && file.size > props.maxSize) {
      error.value = `Le fichier "${file.name}" depasse la taille maximale de ${formatSize(props.maxSize)}.`
      continue
    }

    // Check type (accept string can contain MIME types or extensions)
    if (props.accept) {
      const accepted = props.accept.split(',').map(s => s.trim().toLowerCase())
      const ext = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`
      const mime = file.type.toLowerCase()

      const isAccepted = accepted.some(pattern => {
        if (pattern.startsWith('.')) return ext === pattern
        if (pattern.endsWith('/*')) return mime.startsWith(pattern.replace('/*', '/'))
        return mime === pattern
      })

      if (!isAccepted) {
        error.value = `Le type de fichier "${file.name}" n'est pas accepte.`
        continue
      }
    }

    valid.push(file)
  }

  return valid
}

function handleFiles(rawFiles: FileList | null) {
  if (!rawFiles || rawFiles.length === 0) return

  const files = Array.from(rawFiles)
  const valid = validateFiles(files)

  if (valid.length === 0) return

  if (props.multiple) {
    selectedFiles.value = [...selectedFiles.value, ...valid]
  } else {
    selectedFiles.value = [valid[0]]
  }

  emit('upload', selectedFiles.value)
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  handleFiles(target.files)
  // Reset input so the same file can be re-selected
  target.value = ''
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  if (props.disabled) return
  handleFiles(event.dataTransfer?.files ?? null)
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  if (!props.disabled) isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function openFilePicker() {
  if (props.disabled) return
  fileInputRef.value?.click()
}

function removeFile(index: number) {
  selectedFiles.value = selectedFiles.value.filter((_, i) => i !== index)
  emit('upload', selectedFiles.value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="text-sm font-medium text-prado-text"
    >
      {{ label }}
    </label>

    <!-- Hidden file input -->
    <input
      :id="inputId"
      ref="fileInputRef"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      class="sr-only"
      @change="handleInputChange"
    />

    <!-- Drop zone -->
    <div
      class="relative border-2 border-dashed rounded-xl p-6 text-center transition-colors"
      :class="[
        isDragging
          ? 'border-prado-sage bg-prado-sage/5'
          : 'border-prado-border hover:border-prado-border-medium',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ]"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-label="label ?? 'Zone de depot de fichiers'"
      @click="openFilePicker"
      @keydown.enter="openFilePicker"
      @keydown.space.prevent="openFilePicker"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <!-- Upload icon -->
      <svg
        class="w-8 h-8 mx-auto mb-2 text-prado-text-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>

      <p class="text-sm text-prado-text-secondary">
        <span class="text-prado-sage font-medium">Parcourir</span>
        ou glisser-deposer {{ multiple ? 'vos fichiers' : 'votre fichier' }} ici
      </p>

      <p v-if="accept || maxSize" class="text-xs text-prado-text-faint mt-1">
        <template v-if="accept">{{ accept }}</template>
        <template v-if="accept && maxSize"> — </template>
        <template v-if="maxSize">Max. {{ formatSize(maxSize) }}</template>
      </p>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-xs text-destructive" role="alert">
      {{ error }}
    </p>

    <!-- Help text -->
    <p v-else-if="help" class="text-xs text-prado-text-muted">
      {{ help }}
    </p>

    <!-- File list -->
    <ul v-if="selectedFiles.length > 0" class="space-y-2 mt-1">
      <li
        v-for="(file, index) in selectedFiles"
        :key="`${file.name}-${index}`"
        class="flex items-center gap-3 px-3 py-2 bg-prado-surface rounded-xl border border-prado-border text-sm"
      >
        <!-- File icon -->
        <svg
          class="w-4 h-4 text-prado-text-muted shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>

        <span class="flex-1 truncate text-prado-text">{{ file.name }}</span>
        <span class="text-xs text-prado-text-faint shrink-0">{{ formatSize(file.size) }}</span>

        <!-- Remove button -->
        <button
          type="button"
          class="p-0.5 rounded hover:bg-prado-surface-hover text-prado-text-muted hover:text-prado-text transition-colors"
          aria-label="Supprimer le fichier"
          @click.stop="removeFile(index)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>
