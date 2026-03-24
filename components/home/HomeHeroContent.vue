<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const containerRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  if (!containerRef.value) return
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.2 },
  )
  observer.observe(containerRef.value)
})
</script>

<template>
  <div ref="containerRef" class="max-w-4xl mx-auto">
    <!-- Sur-titre -->
    <p
      class="text-[#FB6223] text-sm tracking-widest uppercase text-center mb-8 hero-reveal"
      :class="isVisible ? 'is-visible' : ''"
      style="--delay: 0s;"
    >
      Association de la Fondation du Prado — Lyon Métropole
    </p>

    <!-- Texte principal — mise en forme impactante -->
    <div class="space-y-6 mb-12">
      <p
        class="text-2xl md:text-3xl text-prado-text text-center leading-snug font-medium hero-reveal"
        :class="isVisible ? 'is-visible' : ''"
        style="--delay: 0.15s;"
      >
        Accompagner les jeunes de
        <span class="text-[#CF006C]">11 à 25 ans</span>
        et leurs familles vers l'autonomie.
      </p>

      <p
        class="text-prado-text-secondary text-center text-lg leading-relaxed max-w-2xl mx-auto hero-reveal"
        :class="isVisible ? 'is-visible' : ''"
        style="--delay: 0.3s;"
      >
        Ateliers, formations, ressources, dispositifs d'insertion&nbsp;: nous relions les publics accompagnés à des
        <span class="text-prado-text">partenaires engagés</span>,
        des
        <span class="text-prado-text">environnements porteurs</span>,
        pour que chacun puisse prendre conscience de son
        <span class="text-prado-text">pouvoir d'agir</span>.
      </p>
    </div>

    <!-- Ligne de séparation subtile -->
    <div
      class="w-16 h-px bg-gradient-to-r from-[#CF006C] to-[#FB6223] mx-auto mb-10 hero-reveal"
      :class="isVisible ? 'is-visible' : ''"
      style="--delay: 0.45s;"
    />

    <!-- CTAs -->
    <div
      class="flex flex-wrap justify-center gap-4 hero-reveal"
      :class="isVisible ? 'is-visible' : ''"
      style="--delay: 0.55s;"
    >
      <NuxtLink
        to="/actions"
        class="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#CF006C] text-white hover:bg-[#CF006C]/90 transition-all font-medium"
      >
        Découvrir nos actions
        <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
      </NuxtLink>
      <NuxtLink
        to="/connexion?mode=register"
        class="px-8 py-3.5 rounded-full border border-prado-border-medium text-prado-text hover:bg-prado-surface-hover transition-colors"
      >
        Inscrire un jeune
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.hero-reveal {
  opacity: 0;
  transform: translateY(24px);
  filter: blur(4px);
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0s);
}

.hero-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
</style>
