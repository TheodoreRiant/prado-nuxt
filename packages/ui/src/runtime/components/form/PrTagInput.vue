<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue: string[]
  suggestions?: string[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Tapez pour ajouter...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const query = ref('')
const showSuggestions = ref(false)
const inputRef = ref<HTMLInputElement>()

const filteredSuggestions = computed(() => {
  if (!props.suggestions || !query.value.trim()) return []
  const q = query.value.toLowerCase()
  return props.suggestions.filter(
    s => s.toLowerCase().includes(q) && !props.modelValue.includes(s),
  )
})

function addTag(tag: string) {
  const trimmed = tag.trim()
  if (!trimmed || props.modelValue.includes(trimmed)) return
  emit('update:modelValue', [...props.modelValue, trimmed])
  query.value = ''
  showSuggestions.value = false
  inputRef.value?.focus()
}

function removeTag(index: number) {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && query.value.trim()) {
    e.preventDefault()
    if (filteredSuggestions.value.length > 0) {
      addTag(filteredSuggestions.value[0])
    } else {
      addTag(query.value)
    }
  }
  if (e.key === 'Backspace' && !query.value && props.modelValue.length > 0) {
    removeTag(props.modelValue.length - 1)
  }
}

function handleBlur() {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}
</script>

<template>
  <div>
    <!-- Tags display -->
    <div
      class="flex flex-wrap gap-1.5 p-2 rounded-xl bg-prado-input-bg border border-prado-border min-h-[42px] cursor-text focus-within:border-prado-border-medium transition-colors"
      @click="inputRef?.focus()"
    >
      <span
        v-for="(tag, i) in modelValue"
        :key="tag"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--prado-signature-muted)] text-[var(--prado-signature-accent)] text-xs font-medium"
      >
        {{ tag }}
        <button
          type="button"
          class="p-0.5 rounded hover:bg-[var(--prado-signature)]/30 transition-colors"
          @click.stop="removeTag(i)"
        >
          <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        class="flex-1 min-w-[120px] bg-transparent text-sm text-prado-text outline-none placeholder:text-prado-text-faint"
        :placeholder="modelValue.length === 0 ? placeholder : ''"
        autocomplete="off"
        @keydown="handleKeydown"
        @focus="showSuggestions = filteredSuggestions.length > 0"
        @input="showSuggestions = filteredSuggestions.length > 0"
        @blur="handleBlur"
      />
    </div>

    <!-- Suggestions dropdown -->
    <div v-if="showSuggestions && filteredSuggestions.length > 0" class="relative">
      <div
        class="absolute z-50 left-0 right-0 top-0 mt-1 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto border border-prado-border"
        style="background-color: var(--prado-surface)"
      >
        <button
          v-for="s in filteredSuggestions"
          :key="s"
          type="button"
          class="w-full text-left px-3 py-2 text-sm text-prado-text hover:bg-prado-surface-hover transition-colors border-b border-prado-border last:border-0"
          style="background-color: var(--prado-surface)"
          @mousedown.prevent="addTag(s)"
        >
          {{ s }}
        </button>
      </div>
    </div>
  </div>
</template>
