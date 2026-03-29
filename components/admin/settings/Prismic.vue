<script setup lang="ts">
import { ExternalLink, CheckCircle, XCircle, FileText } from 'lucide-vue-next'

const loading = ref(true)
const status = ref<{ connected: boolean; types: string[]; lastPublished?: string } | null>(null)

const typeLabels: Record<string, string> = {
  homepage: 'Page d\'accueil',
  actualite: 'Actualités',
  educolab: 'Éducolab',
  foodtruck: 'Foodtruck',
  fresque: 'Fresque',
  page_legale: 'Pages légales',
  page: 'Pages statiques',
}

async function loadStatus() {
  loading.value = true
  try {
    status.value = await $fetch<{ connected: boolean; types: string[]; lastPublished?: string }>('/api/admin/settings/prismic-status')
  } catch {
    status.value = { connected: false, types: [] }
  } finally {
    loading.value = false
  }
}

onMounted(loadStatus)
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-lg font-semibold text-prado-text mb-1">CMS (Prismic)</h2>
      <p class="text-sm text-prado-text-muted">Gestion du contenu éditorial du site (pages, actualités, programmes).</p>
    </div>

    <!-- Status -->
    <div v-if="loading" class="h-14 rounded-xl bg-prado-bg animate-pulse" />
    <div v-else class="flex items-center gap-3 p-4 rounded-xl bg-prado-bg border border-prado-border">
      <CheckCircle v-if="status?.connected" :size="18" class="text-[#93C1AF]" />
      <XCircle v-else :size="18" class="text-red-400" />
      <span class="text-sm text-prado-text">
        {{ status?.connected ? 'Prismic connecté' : 'Connexion Prismic indisponible' }}
      </span>
    </div>

    <!-- Types -->
    <div v-if="status?.connected" class="space-y-3">
      <h3 class="text-sm font-medium text-prado-text-secondary uppercase tracking-wider">Types de contenu</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div
          v-for="t in status.types"
          :key="t"
          class="flex items-center gap-2 p-3 rounded-xl bg-prado-bg border border-prado-border"
        >
          <FileText :size="14" class="text-prado-text-faint" />
          <span class="text-sm text-prado-text">{{ typeLabels[t] ?? t }}</span>
        </div>
      </div>
    </div>

    <!-- Link -->
    <a
      href="https://prado-itineraires.prismic.io"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-prado-border text-prado-text-secondary text-sm hover:bg-prado-surface-hover transition-colors"
    >
      Ouvrir le dashboard Prismic
      <ExternalLink :size="14" />
    </a>

    <p class="text-xs text-prado-text-faint">
      Pour modifier le contenu du site (textes, images, actualités), utilisez directement le dashboard Prismic.
    </p>
  </div>
</template>
