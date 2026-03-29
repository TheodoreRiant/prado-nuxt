<script setup lang="ts">
const { data: page } = await usePageLegale('mentions-legales')

useHead({
  title: page.value?.data?.meta_title || 'Mentions legales | Prado Itineraires',
  meta: page.value?.data?.meta_description
    ? [{ name: 'description', content: page.value.data.meta_description }]
    : [],
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-20 text-prado-text">
    <template v-if="page?.data">
      <h1 class="text-3xl font-bold mb-10 text-[var(--prado-signature-accent)]" :style="{ fontFamily: 'Poppins' }">
        {{ page.data.title }}
      </h1>
      <div class="space-y-4 text-sm leading-relaxed text-prado-text-muted prose-headings:text-lg prose-headings:text-prado-text prose-headings:font-medium prose-headings:mb-2 prose-headings:mt-8 prose-p:mb-2 prose-ul:list-disc prose-ul:pl-5 prose-ul:mt-2 prose-ul:space-y-1 prose-a:text-[var(--prado-signature-accent)] prose-a:underline">
        <PrismicRichText :field="page.data.body" />
      </div>
    </template>
    <template v-else>
      <h1 class="text-3xl font-bold mb-10 text-[var(--prado-signature-accent)]" :style="{ fontFamily: 'Poppins' }">Mentions Legales</h1>
      <p class="text-prado-text-muted">Contenu en cours de chargement...</p>
    </template>
  </div>
</template>
