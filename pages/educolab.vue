<script setup lang="ts">
import { ExternalLink, BookOpen } from 'lucide-vue-next'

const { data: page } = await useEducolab()
const d = computed(() => page.value?.data)

useHead({
  title: d.value?.meta_title || 'Educolab | Prado Itineraires',
  meta: d.value?.meta_description
    ? [{ name: 'description', content: d.value.meta_description }]
    : [],
})

const brandColor = computed(() => '#93C1AF')
</script>

<template>
  <div v-if="d">
    <div class="relative h-[40vh] min-h-[300px] flex items-end">
      <div class="absolute inset-0">
        <PrismicImage v-if="d.hero_image?.url" :field="d.hero_image" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-prado-bg via-prado-bg/60 to-transparent" />
      </div>
      <div class="relative z-10 max-w-7xl mx-auto px-6 pb-10 w-full">
        <p class="text-sm mb-2 tracking-wide" :style="{ color: brandColor }">{{ d.surtitle }}</p>
        <h1 class="text-4xl md:text-5xl text-prado-text italic" :style="{ fontFamily: 'Poppins' }">{{ d.title }}</h1>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-16 text-center">
      <div class="bg-prado-surface rounded-2xl p-10 border border-prado-border">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" :style="{ backgroundColor: `${brandColor}25` }">
          <BookOpen :size="30" :style="{ color: brandColor }" />
        </div>
        <h2 class="text-2xl text-prado-text mb-4">{{ d.card_title }}</h2>
        <div class="text-prado-text-muted mb-8 leading-relaxed">
          <PrismicRichText :field="d.card_body" />
        </div>
        <PrismicLink v-if="d.cta_link" :field="d.cta_link" class="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white transition-colors" :style="{ backgroundColor: brandColor }">
          {{ d.cta_label }} <ExternalLink :size="15" />
        </PrismicLink>
      </div>
    </div>
  </div>
</template>
