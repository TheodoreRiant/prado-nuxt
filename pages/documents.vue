<script setup lang="ts">
import { Search, Loader2, FileText } from 'lucide-vue-next'

const { client: prismic } = usePrismic()

const search = ref('')

const { data: docs, status } = await useAsyncData('documents', () =>
  prismic.getAllByType('document')
)

const loading = computed(() => status.value === 'pending')

const documents = computed(() =>
  (docs.value ?? []).map(doc => ({
    uid: doc.uid,
    title: (doc.data.title as string) || 'Document',
    description: (doc.data.description as string) || '',
    category: (doc.data.category as string) || '',
    fileUrl: (doc.data.file as any)?.url || '',
    imageUrl: (doc.data.image as any)?.url || '',
  }))
)

const filtered = computed(() => {
  if (!search.value) return documents.value
  const term = search.value.toLowerCase()
  return documents.value.filter(d =>
    d.title.toLowerCase().includes(term) || d.description.toLowerCase().includes(term)
  )
})

useHead({
  title: 'Documents | Prado Itinéraires',
  meta: [{ name: 'description', content: 'Téléchargez les documents et rapports de Prado Itinéraires.' }],
})
</script>

<template>
  <div class="min-h-screen">
    <div class="py-20 md:py-28">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <p class="text-[var(--prado-signature-accent)] text-sm mb-5 tracking-wide uppercase font-medium">Ressources</p>
        <h1 class="text-4xl md:text-5xl text-prado-text mb-6" :style="{ fontFamily: 'Poppins' }">Documents</h1>
        <p class="text-prado-text-muted max-w-lg mx-auto">Catalogues, rapports d'activité et guides à télécharger.</p>
        <div class="relative max-w-md mx-auto mt-8">
          <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-prado-text-faint" />
          <input
            v-model="search"
            placeholder="Rechercher un document..."
            class="w-full pl-12 pr-4 py-3 rounded-full bg-prado-surface border border-prado-border text-prado-text placeholder:text-prado-text-faint focus:outline-none focus:border-prado-border-medium"
          />
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 pb-20">
      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 class="animate-spin text-prado-text-muted" :size="32" />
      </div>

      <div v-else-if="filtered.length > 0" class="space-y-4">
        <PrDocumentDownload
          v-for="doc in filtered"
          :key="doc.uid"
          :title="doc.title"
          :description="doc.description"
          :category="doc.category"
          :file-url="doc.fileUrl"
        />
      </div>

      <div v-else class="text-center py-20">
        <FileText :size="48" class="mx-auto mb-4 text-prado-text-faint" />
        <p class="text-prado-text-muted">Aucun document disponible.</p>
      </div>
    </div>
  </div>
</template>
