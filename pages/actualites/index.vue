<script setup lang="ts">
import { Search, ChevronLeft, ChevronRight, Loader2, Calendar } from 'lucide-vue-next'
import * as prismicH from '@prismicio/client'

const { client: prismic } = usePrismic()

const search = ref('')
const page = ref(1)
const ITEMS_PER_PAGE = 8

const { data: docs, status } = await useAsyncData('actualites', () =>
  prismic.getAllByType('actualite', {
    orderings: { field: 'my.actualite.date', direction: 'desc' },
  })
)

const loading = computed(() => status.value === 'pending')

const filteredDocs = computed(() => {
  if (!docs.value) return []
  return docs.value.filter(doc => {
    if (!search.value) return true
    const term = search.value.toLowerCase()
    const title = (doc.data.title as string)?.toLowerCase() ?? ''
    const excerpt = (doc.data.excerpt as string)?.toLowerCase() ?? ''
    return title.includes(term) || excerpt.includes(term)
  })
})

const totalPages = computed(() => Math.ceil(filteredDocs.value.length / ITEMS_PER_PAGE))
const paginatedDocs = computed(() =>
  filteredDocs.value.slice((page.value - 1) * ITEMS_PER_PAGE, page.value * ITEMS_PER_PAGE)
)

useHead({
  title: 'Actualités | Prado Itinéraires',
  meta: [{ name: 'description', content: 'Toutes les actualités de Prado Itinéraires.' }],
})

function onCardEnter(el: Element, index: number) {
  const htmlEl = el as HTMLElement
  htmlEl.style.opacity = '0'
  htmlEl.style.transform = 'translateY(24px)'
  setTimeout(() => {
    htmlEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
    htmlEl.style.opacity = '1'
    htmlEl.style.transform = 'translateY(0)'
  }, index * 100)
}
</script>

<template>
  <div class="bg-prado-bg-deep min-h-screen">
    <div class="py-20 md:py-28 bg-prado-bg border-b border-prado-border-light">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <p class="text-[var(--prado-signature-accent)] text-sm mb-5 tracking-wide uppercase font-medium">Blog & Mises à jour</p>
        <h1 class="text-4xl md:text-6xl text-prado-text mb-6" :style="{ fontFamily: 'Poppins' }">Actualités</h1>
        <div class="relative max-w-md mx-auto mt-8">
          <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-prado-text-faint" />
          <input
            v-model="search"
            placeholder="Rechercher un article..."
            class="w-full pl-12 pr-4 py-3 rounded-full bg-prado-surface border border-prado-border text-prado-text placeholder:text-prado-text-faint focus:outline-none focus:border-prado-border-medium"
          />
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-16">
      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 class="animate-spin text-prado-text-muted" :size="32" />
      </div>

      <div v-else-if="paginatedDocs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <NuxtLink
          v-for="(doc, i) in paginatedDocs"
          :key="doc.uid"
          :ref="(el: any) => { if (el?.$el) onCardEnter(el.$el, i) }"
          :to="`/actualites/${doc.uid}`"
          class="group flex flex-col h-full rounded-2xl overflow-hidden bg-prado-surface border border-prado-border hover:border-prado-border-medium transition-all hover:-translate-y-1"
        >
          <div class="aspect-[4/3] overflow-hidden bg-prado-surface-hover">
            <img
              v-if="(doc.data.image as any)?.url"
              :src="(doc.data.image as any).url"
              :alt="(doc.data.image as any).alt || ''"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <div class="text-xs text-[var(--prado-signature-accent)] mb-3 flex items-center gap-1.5">
              <Calendar :size="12" />
              {{ doc.data.date ? new Date(doc.data.date as string).toLocaleDateString('fr-FR') : '' }}
            </div>
            <h3 class="text-xl font-medium text-prado-text mb-3 group-hover:text-[var(--prado-signature-accent)] transition-colors line-clamp-2">
              {{ doc.data.title }}
            </h3>
            <p class="text-sm text-prado-text-muted line-clamp-3 mb-4 flex-1">{{ doc.data.excerpt }}</p>
            <span class="text-sm text-prado-text font-medium underline decoration-prado-border group-hover:decoration-[var(--prado-signature-accent)] underline-offset-4 transition-all">Lire la suite</span>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="text-center py-20 text-prado-text-muted">Aucune actualité trouvée.</div>

      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-12">
        <button :disabled="page === 1" class="p-2 rounded-full hover:bg-prado-surface disabled:opacity-30 text-prado-text" @click="page--">
          <ChevronLeft :size="20" />
        </button>
        <span class="px-4 py-2 text-prado-text-muted text-sm">Page {{ page }} sur {{ totalPages }}</span>
        <button :disabled="page === totalPages" class="p-2 rounded-full hover:bg-prado-surface disabled:opacity-30 text-prado-text" @click="page++">
          <ChevronRight :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>
