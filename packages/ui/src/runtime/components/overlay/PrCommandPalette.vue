<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

export interface PrCommandPaletteItem {
  id: string
  label: string
  description?: string
  icon?: string
  group?: string
  action: () => void
}

interface Props {
  items: PrCommandPaletteItem[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Rechercher une commande...',
})

const emit = defineEmits<{
  select: [item: PrCommandPaletteItem]
}>()

const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement>()
const listRef = ref<HTMLDivElement>()

// Fuzzy matching: check if all characters of the query appear in order in the target
function fuzzyMatch(target: string, search: string): { matches: boolean; score: number } {
  if (!search) return { matches: true, score: 0 }

  const targetLower = target.toLowerCase()
  const searchLower = search.toLowerCase()

  let score = 0
  let searchIdx = 0
  let lastMatchIdx = -1

  for (let i = 0; i < targetLower.length && searchIdx < searchLower.length; i++) {
    if (targetLower[i] === searchLower[searchIdx]) {
      // Consecutive matches score higher
      if (lastMatchIdx === i - 1) score += 2
      // First character match scores higher
      if (i === 0) score += 3
      // Match after separator scores higher
      if (i > 0 && (targetLower[i - 1] === ' ' || targetLower[i - 1] === '-')) score += 2

      score += 1
      lastMatchIdx = i
      searchIdx++
    }
  }

  return {
    matches: searchIdx === searchLower.length,
    score,
  }
}

const filteredItems = computed(() => {
  const q = query.value.trim()

  const scored = props.items
    .map(item => {
      const labelMatch = fuzzyMatch(item.label, q)
      const descMatch = item.description ? fuzzyMatch(item.description, q) : { matches: false, score: 0 }
      return {
        item,
        matches: labelMatch.matches || descMatch.matches,
        score: Math.max(labelMatch.score, descMatch.score),
      }
    })
    .filter(entry => entry.matches)
    .sort((a, b) => b.score - a.score)

  return scored.map(entry => entry.item)
})

// Group items by their group property
const groupedItems = computed(() => {
  const groups = new Map<string, PrCommandPaletteItem[]>()
  const ungrouped: PrCommandPaletteItem[] = []

  for (const item of filteredItems.value) {
    if (item.group) {
      const group = groups.get(item.group) ?? []
      groups.set(item.group, [...group, item])
    } else {
      ungrouped.push(item)
    }
  }

  const result: Array<{ group: string | null; items: PrCommandPaletteItem[] }> = []

  if (ungrouped.length > 0) {
    result.push({ group: null, items: ungrouped })
  }

  for (const [group, items] of groups) {
    result.push({ group, items })
  }

  return result
})

// Flat list for keyboard navigation indexing
const flatItems = computed(() => filteredItems.value)

watch(query, () => {
  activeIndex.value = 0
})

watch(isOpen, async (open) => {
  if (open) {
    query.value = ''
    activeIndex.value = 0
    await nextTick()
    inputRef.value?.focus()
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
    }
  } else {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  }
})

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function selectItem(item: PrCommandPaletteItem) {
  emit('select', item)
  item.action()
  close()
}

function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      activeIndex.value = (activeIndex.value + 1) % Math.max(1, flatItems.value.length)
      scrollActiveIntoView()
      break
    case 'ArrowUp':
      event.preventDefault()
      activeIndex.value = (activeIndex.value - 1 + flatItems.value.length) % Math.max(1, flatItems.value.length)
      scrollActiveIntoView()
      break
    case 'Enter':
      event.preventDefault()
      if (flatItems.value[activeIndex.value]) {
        selectItem(flatItems.value[activeIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      close()
      break
  }
}

function scrollActiveIntoView() {
  nextTick(() => {
    const activeEl = listRef.value?.querySelector('[data-active="true"]')
    activeEl?.scrollIntoView({ block: 'nearest' })
  })
}

// Global keyboard shortcut: Cmd+K / Ctrl+K
function handleGlobalKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleGlobalKeydown)
    document.body.style.overflow = ''
  }
})

/** Get flat index for a given item */
function getFlatIndex(item: PrCommandPaletteItem): number {
  return flatItems.value.indexOf(item)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="pr-command-palette">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="close"
        />

        <!-- Palette -->
        <div
          class="relative w-full max-w-lg rounded-2xl border border-prado-border shadow-2xl overflow-hidden"
          style="background-color: var(--prado-surface)"
          role="dialog"
          aria-modal="true"
          aria-label="Palette de commandes"
          @keydown="handleKeydown"
        >
          <!-- Search input -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-prado-border">
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
                d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              :placeholder="placeholder"
              class="flex-1 bg-transparent text-sm text-prado-text placeholder:text-prado-text-faint focus:outline-none"
            />
            <kbd class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] text-prado-text-faint border border-prado-border rounded font-mono">
              Esc
            </kbd>
          </div>

          <!-- Results list -->
          <div
            ref="listRef"
            class="max-h-[320px] overflow-y-auto py-2"
            role="listbox"
          >
            <template v-if="flatItems.length > 0">
              <template v-for="section in groupedItems" :key="section.group ?? '__ungrouped'">
                <!-- Group header -->
                <div
                  v-if="section.group"
                  class="px-4 py-1.5 text-[11px] font-semibold text-prado-text-faint uppercase tracking-wider"
                >
                  {{ section.group }}
                </div>

                <!-- Items -->
                <button
                  v-for="item in section.items"
                  :key="item.id"
                  type="button"
                  role="option"
                  :aria-selected="getFlatIndex(item) === activeIndex"
                  :data-active="getFlatIndex(item) === activeIndex"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
                  :class="getFlatIndex(item) === activeIndex
                    ? 'bg-prado-surface-hover text-prado-text'
                    : 'text-prado-text hover:bg-prado-surface-hover'"
                  @click="selectItem(item)"
                  @mouseenter="activeIndex = getFlatIndex(item)"
                >
                  <!-- Icon placeholder -->
                  <span
                    v-if="item.icon"
                    class="text-base shrink-0"
                    aria-hidden="true"
                  >{{ item.icon }}</span>

                  <div class="flex-1 min-w-0">
                    <div class="truncate">{{ item.label }}</div>
                    <div
                      v-if="item.description"
                      class="text-xs text-prado-text-faint truncate"
                    >
                      {{ item.description }}
                    </div>
                  </div>
                </button>
              </template>
            </template>

            <!-- Empty state -->
            <div
              v-else
              class="px-4 py-8 text-center text-sm text-prado-text-muted"
            >
              Aucun resultat pour "{{ query }}"
            </div>
          </div>

          <!-- Footer hint -->
          <div class="flex items-center gap-4 px-4 py-2 border-t border-prado-border text-[11px] text-prado-text-faint">
            <span class="inline-flex items-center gap-1">
              <kbd class="px-1 py-0.5 border border-prado-border rounded font-mono text-[10px]">&#8593;&#8595;</kbd>
              Naviguer
            </span>
            <span class="inline-flex items-center gap-1">
              <kbd class="px-1 py-0.5 border border-prado-border rounded font-mono text-[10px]">&#9166;</kbd>
              Selectionner
            </span>
            <span class="inline-flex items-center gap-1">
              <kbd class="px-1 py-0.5 border border-prado-border rounded font-mono text-[10px]">Esc</kbd>
              Fermer
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pr-command-palette-enter-active,
.pr-command-palette-leave-active {
  transition: opacity 0.15s ease;
}
.pr-command-palette-enter-from,
.pr-command-palette-leave-to {
  opacity: 0;
}
</style>
