<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const HERO_IMAGE = '/images/hero-jeunes.jpg'
const HERO_BG = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1920&auto=format&fit=crop'

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1773270196888-0cdacb07edae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMHdvcmtzaG9wJTIwZWR1Y2F0aW9uJTIwZ3JvdXB8ZW58MXx8fHwxNzc0Mjc0NTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  foodtruck: 'https://images.unsplash.com/photo-1612208176815-e132bcf971b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwdHJ1Y2slMjBzdHJlZXQlMjB1cmJhbnxlbnwxfHx8fDE3NzQyNzQ1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  team: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwc29jaWFsJTIwd29ya2VycyUyMG1lZXRpbmd8ZW58MXx8fHwxNzc0Mjc0NTE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
}

const mockActualites = [
  {
    id: '1',
    title: 'Lancement de la nouvelle programmation printemps 2026',
    excerpt: 'Decouvrez les nouvelles actions proposees pour le printemps ! Ateliers creatifs, stages pro, escape games...',
    date: '2026-03-15',
    image: IMAGES.hero,
  },
  {
    id: '2',
    title: 'Le Foodtruck fait sa tournee de printemps',
    excerpt: 'Retrouvez notre foodtruck solidaire dans les quartiers de la metropole lyonnaise avec un nouveau menu.',
    date: '2026-03-10',
    image: IMAGES.foodtruck,
  },
  {
    id: '3',
    title: 'Retour sur la Fresque de la Protection de l\'Enfance',
    excerpt: 'Plus de 50 professionnels ont participe a la derniere session. Un succes qui confirme le besoin de sensibilisation.',
    date: '2026-03-01',
    image: IMAGES.team,
  },
]

const partners = [
  'Metropole de Lyon',
  'Fondation du Prado',
  'Departement du Rhone',
  'Mission Locale',
  'CAF du Rhone',
  'DDETS du Rhone',
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div>
    <!-- Section 1 — Hero -->
    <div id="hero">
      <UiScrollExpandHero
        media-type="image"
        :media-src="HERO_IMAGE"
        :bg-image-src="HERO_BG"
        title="L'innovation sociale au service des jeunes et des familles"
        subtitle="Prado Itinéraires"
        scroll-hint="Scrollez pour découvrir"
      >
        <div class="max-w-4xl mx-auto text-center">
          <p class="text-[#FB6223] text-sm mb-4 tracking-wide uppercase">Association de la Fondation du Prado — Lyon Métropole</p>
          <p class="text-prado-text-muted text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Prado Itinéraires construit des solutions nouvelles et complémentaires pour accompagner les jeunes de 11 à 25 ans et leurs familles vers l'autonomie. Ateliers, formations, ressources, dispositifs d'insertion&nbsp;: nous relions les publics accompagnés à des partenaires engagés, des environnements porteurs et favorables, pour que chacun puisse prendre conscience de son pouvoir d'agir et trouver sa place.
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <NuxtLink to="/actions" class="px-7 py-3 rounded-full bg-[#CF006C] text-white hover:bg-[#CF006C]/90 transition-colors font-medium">
              Découvrir nos actions
            </NuxtLink>
            <NuxtLink to="/connexion?mode=register" class="px-7 py-3 rounded-full border border-prado-border-medium text-prado-text hover:bg-prado-surface-hover transition-colors">
              Inscrire un jeune
            </NuxtLink>
          </div>
        </div>
      </UiScrollExpandHero>
    </div>

    <!-- Section 2 — Les 4 Programmes -->
    <div id="programmes">
      <HomeProgrammes />
    </div>

    <!-- Section 3 — Nos missions -->
    <div id="missions">
      <HomeMissions />
    </div>

    <!-- Section 4 — Chiffres d'impact -->
    <div id="impact">
      <HomeImpact />
    </div>

    <!-- Section 5 — Comment ça marche -->
    <div id="etapes">
      <HomeSteps />
    </div>

    <!-- Actualites (à remplacer par les futures sections 6-10) -->
    <section id="actualites" class="py-20">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-end justify-between mb-10">
          <div>
            <p class="text-[#FB6223] text-sm mb-2 tracking-wide">Dernieres nouvelles</p>
            <h2 class="text-3xl text-prado-text italic" :style="{ fontFamily: 'Poppins' }">Actualites</h2>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            v-for="actu in mockActualites"
            :key="actu.id"
            class="bg-prado-surface rounded-2xl overflow-hidden border border-prado-border hover:border-prado-border-light transition-all group"
          >
            <div class="relative h-44 overflow-hidden">
              <img :src="actu.image" :alt="actu.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-prado-surface to-transparent" />
            </div>
            <div class="p-5">
              <p class="text-xs text-[#FB6223] mb-2">{{ formatDate(actu.date) }}</p>
              <h3 class="text-prado-text mb-2">{{ actu.title }}</h3>
              <p class="text-sm text-prado-text-muted">{{ actu.excerpt }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partenaires -->
    <section id="partenaires" class="py-16">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <p class="text-[#FB6223] text-sm mb-2 tracking-wide">Ils nous font confiance</p>
        <h2 class="text-2xl text-prado-text italic mb-10" :style="{ fontFamily: 'Poppins' }">Nos partenaires</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <div v-for="p in partners" :key="p" class="px-6 py-3 bg-prado-surface rounded-full text-prado-text-muted text-sm border border-prado-border">
            {{ p }}
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="cta" class="py-16 bg-gradient-to-r from-[#CF006C] to-[#FB6223]">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h2 class="text-3xl text-white mb-4 italic" :style="{ fontFamily: 'Poppins' }">Vous etes prescripteur ?</h2>
        <p class="text-white/80 mb-8">Creez votre compte pour inscrire les jeunes que vous accompagnez a nos actions culturelles et educatives.</p>
        <div class="flex justify-center gap-3">
          <NuxtLink to="/actions" class="px-7 py-3 rounded-full bg-white text-[#1a1a2e] hover:bg-white/90 transition-colors">
            Voir les actions
          </NuxtLink>
          <NuxtLink to="/connexion?mode=register" class="px-7 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors">
            Creer un compte
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
