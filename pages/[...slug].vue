<script setup lang="ts">
const route = useRoute()
const slug = computed(() => {
  const parts = route.params.slug
  return Array.isArray(parts) ? parts.join('/') : parts
})

const { data: page } = await useStaticPage(slug.value)

if (!page.value?.data) {
  throw createError({ statusCode: 404, statusMessage: 'Page non trouvee' })
}

useHead({
  title: page.value.data.meta_title || `${page.value.data.title} | Prado Itineraires`,
  meta: page.value.data.meta_description
    ? [{ name: 'description', content: page.value.data.meta_description }]
    : [],
})
</script>

<template>
  <div v-if="page?.data">
    <!-- Hero image -->
    <div v-if="page.data.hero_image?.url" class="relative h-[35vh] min-h-[260px] flex items-end">
      <div class="absolute inset-0">
        <PrismicImage :field="page.data.hero_image" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-prado-bg via-prado-bg/70 to-transparent" />
      </div>
      <div class="relative z-10 max-w-4xl mx-auto px-6 pb-10 w-full">
        <p v-if="page.data.subtitle" class="text-[var(--prado-signature-accent)] text-sm mb-2">{{ page.data.subtitle }}</p>
        <h1 class="text-3xl md:text-4xl text-prado-text" :style="{ fontFamily: 'Poppins' }">
          {{ page.data.title }}
        </h1>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-6" :class="page.data.hero_image?.url ? 'py-12' : 'py-20'">
      <template v-if="!page.data.hero_image?.url">
        <h1 class="text-3xl md:text-4xl text-prado-text mb-2" :style="{ fontFamily: 'Poppins' }">
          {{ page.data.title }}
        </h1>
        <p v-if="page.data.subtitle" class="text-prado-text-muted text-lg mb-10">{{ page.data.subtitle }}</p>
      </template>
      <div class="text-prado-text-muted leading-relaxed prose-headings:text-prado-text prose-headings:font-medium prose-headings:mt-8 prose-headings:mb-3 prose-p:mb-4 prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-1 prose-a:text-[var(--prado-signature-accent)] prose-a:underline">
        <PrismicRichText :field="page.data.body" />
      </div>
    </div>
  </div>
</template>
