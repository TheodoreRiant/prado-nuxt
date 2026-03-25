<script setup lang="ts">
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Linkedin } from 'lucide-vue-next'
import * as prismicH from '@prismicio/client'

const route = useRoute()
const { client: prismic } = usePrismic()
const uid = route.params.uid as string

const { data: doc, status } = await useAsyncData(`actualite-${uid}`, () =>
  prismic.getByUID('actualite', uid)
)

const { data: relatedDocs } = await useAsyncData(`related-${uid}`, async () => {
  const all = await prismic.getAllByType('actualite', {
    orderings: { field: 'my.actualite.date', direction: 'desc' },
    pageSize: 4,
  })
  return all.filter(d => d.uid !== uid).slice(0, 3)
})

const loading = computed(() => status.value === 'pending')

const article = computed(() => {
  if (!doc.value) return null
  const d = doc.value.data
  const bodyText = d.body ? prismicH.asText(d.body) : ''
  return {
    title: (d.title as string) || 'Sans titre',
    excerpt: (d.excerpt as string) || '',
    date: d.date ? new Date(d.date as string).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
    image: (d.image as any)?.url,
    body: d.body,
    readingTime: Math.ceil((bodyText.split(' ').length || 1) / 200),
  }
})

useHead({
  title: () => article.value ? `${article.value.title} | Prado Itinéraires` : 'Actualité',
  meta: [
    { name: 'description', content: () => article.value?.excerpt ?? '' },
    { property: 'og:image', content: () => article.value?.image ?? '' },
  ],
})

function share(platform: string) {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(article.value?.title ?? '')
  const urls: Record<string, string> = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  }
  if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400')
}

async function copyLink() {
  await navigator.clipboard.writeText(window.location.href)
}
</script>

<template>
  <div class="bg-prado-bg min-h-screen">
    <div v-if="loading" class="h-screen flex items-center justify-center">
      <div class="animate-spin w-8 h-8 border-2 border-prado-text border-t-transparent rounded-full" />
    </div>

    <article v-else-if="article" class="pb-20">
      <div class="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <div class="absolute inset-0 bg-prado-surface">
          <img v-if="article.image" :src="article.image" class="w-full h-full object-cover" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-prado-bg via-prado-bg/50 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
          <NuxtLink to="/actualites" class="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft :size="16" /> Retour aux actualités
          </NuxtLink>
          <h1 class="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight" :style="{ fontFamily: 'Poppins' }">{{ article.title }}</h1>
          <div class="flex items-center gap-6 text-white/80 text-sm">
            <span class="flex items-center gap-2"><Calendar :size="14" /> {{ article.date }}</span>
            <span class="flex items-center gap-2"><Clock :size="14" /> {{ article.readingTime }} min de lecture</span>
          </div>
        </div>
      </div>

      <div class="max-w-3xl mx-auto px-6 py-12">
        <div class="prose prose-lg dark:prose-invert prose-a:text-[#CF006C] max-w-none text-prado-text">
          <PrismicRichText :field="article.body" />
        </div>

        <div class="border-t border-prado-border mt-12 pt-8 flex items-center justify-between">
          <span class="text-sm text-prado-text-secondary">Partager</span>
          <div class="flex gap-3">
            <button @click="share('facebook')" class="p-2 rounded-full bg-prado-surface hover:bg-[#1877F2] hover:text-white transition-colors text-prado-text-muted"><Facebook :size="18" /></button>
            <button @click="share('linkedin')" class="p-2 rounded-full bg-prado-surface hover:bg-[#0A66C2] hover:text-white transition-colors text-prado-text-muted"><Linkedin :size="18" /></button>
            <button @click="copyLink" class="p-2 rounded-full bg-prado-surface hover:bg-[#93C1AF] hover:text-white transition-colors text-prado-text-muted"><Share2 :size="18" /></button>
          </div>
        </div>
      </div>

      <div v-if="relatedDocs?.length" class="max-w-6xl mx-auto px-6 mt-12 pt-12 border-t border-prado-border">
        <h3 class="text-2xl text-prado-text mb-8" :style="{ fontFamily: 'Poppins' }">À lire aussi</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <NuxtLink v-for="d in relatedDocs" :key="d.uid" :to="`/actualites/${d.uid}`" class="group block">
            <div class="aspect-video rounded-xl overflow-hidden mb-4 bg-prado-surface">
              <img v-if="(d.data.image as any)?.url" :src="(d.data.image as any).url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 class="text-lg font-medium text-prado-text group-hover:text-[#CF006C] transition-colors mb-2">{{ d.data.title }}</h4>
            <p class="text-sm text-prado-text-muted line-clamp-2">{{ d.data.excerpt }}</p>
          </NuxtLink>
        </div>
      </div>
    </article>

    <div v-else class="py-32 text-center">
      <h1 class="text-2xl text-prado-text">Article introuvable</h1>
      <NuxtLink to="/actualites" class="text-[#CF006C] mt-4 inline-block">Retour aux actualités</NuxtLink>
    </div>
  </div>
</template>
