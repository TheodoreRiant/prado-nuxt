<script setup lang="ts">
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { data: actualites } = await useActualites(5)

const scrollContainer = ref<HTMLElement | null>(null)

function scrollBy(direction: 'left' | 'right') {
  if (!scrollContainer.value) return
  const cardWidth = scrollContainer.value.firstElementChild?.clientWidth ?? 320
  const scrollAmount = direction === 'left' ? -cardWidth - 24 : cardWidth + 24
  scrollContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const hasArticles = computed(() => (actualites.value?.length ?? 0) > 0)
</script>

<template>
  <section v-if="hasArticles" class="py-20 bg-prado-bg-deep">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Header -->
      <div class="flex items-end justify-between mb-10">
        <div>
          <p class="text-[var(--prado-signature-accent)] text-sm tracking-wide uppercase font-medium mb-2">
            Blog
          </p>
          <h2 class="text-3xl md:text-4xl text-prado-text">
            Nos actualites
          </h2>
        </div>
        <div class="flex items-center gap-4">
          <!-- Nav arrows (hidden on mobile where stack is shown) -->
          <div class="hidden md:flex items-center gap-2">
            <button
              class="p-2 rounded-full border border-prado-border text-prado-text-muted hover:text-prado-text hover:border-prado-border-medium transition-colors"
              aria-label="Articles precedents"
              @click="scrollBy('left')"
            >
              <ChevronLeft :size="18" />
            </button>
            <button
              class="p-2 rounded-full border border-prado-border text-prado-text-muted hover:text-prado-text hover:border-prado-border-medium transition-colors"
              aria-label="Articles suivants"
              @click="scrollBy('right')"
            >
              <ChevronRight :size="18" />
            </button>
          </div>
          <NuxtLink
            to="/actualites"
            class="hidden md:inline-flex items-center gap-1.5 text-sm text-[var(--prado-signature-accent)] hover:underline"
          >
            Voir tout
            <ArrowRight :size="14" />
          </NuxtLink>
        </div>
      </div>

      <!-- Carousel (desktop) / Stack (mobile) -->
      <div
        ref="scrollContainer"
        class="flex gap-6 overflow-x-auto md:scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
        style="-webkit-overflow-scrolling: touch;"
      >
        <NuxtLink
          v-for="article in actualites"
          :key="article.uid"
          :to="`/actualites/${article.uid}`"
          class="group flex-none w-[85vw] md:w-[calc(33.333%-16px)] snap-start"
        >
          <div class="h-full rounded-2xl overflow-hidden bg-prado-surface border border-prado-border hover:border-prado-border-medium transition-all hover:-translate-y-1">
            <!-- Image -->
            <div class="aspect-[16/10] overflow-hidden bg-prado-surface-hover">
              <img
                v-if="(article.data.image as any)?.url"
                :src="(article.data.image as any).url"
                :alt="(article.data.image as any).alt || ''"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <!-- Content -->
            <div class="p-5">
              <div class="text-xs text-[var(--prado-signature-accent)] mb-2 flex items-center gap-1.5">
                <Calendar :size="12" />
                {{ formatDate(article.data.date as string) }}
              </div>
              <h3 class="text-lg font-medium text-prado-text mb-2 line-clamp-2 group-hover:text-[var(--prado-signature-accent)] transition-colors">
                {{ article.data.title }}
              </h3>
              <p class="text-sm text-prado-text-muted line-clamp-2">
                {{ article.data.excerpt }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Mobile CTA -->
      <div class="mt-6 text-center md:hidden">
        <NuxtLink
          to="/actualites"
          class="inline-flex items-center gap-1.5 text-sm text-[var(--prado-signature-accent)] hover:underline"
        >
          Voir toutes les actualites
          <ArrowRight :size="14" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hide scrollbar for cleaner look */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
