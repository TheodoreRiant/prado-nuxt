<script setup lang="ts">
import { ArrowRight, Heart, BookOpen, Truck, Users } from 'lucide-vue-next'

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

const pillars = [
  { icon: Users, title: 'Jeunes & Autonomes', desc: 'Programmation d\'actions pour les 12-21 ans en parcours d\'insertion', color: '#CF006C', to: '/actions' },
  { icon: Truck, title: 'Foodtruck Solidaire', desc: 'Creer du lien et former les jeunes aux metiers de la restauration', color: '#FB6223', to: '/foodtruck' },
  { icon: Heart, title: 'Fresque PDE', desc: 'Sensibiliser aux enjeux de la protection de l\'enfance', color: '#C18ED8', to: '/fresque' },
  { icon: BookOpen, title: 'Educolab', desc: 'Renforcement des competences parentales et programmes educatifs', color: '#93C1AF', to: '/educolab' },
]

const stats = [
  { n: '500+', l: 'Jeunes accompagnes', c: '#CF006C' },
  { n: '80+', l: 'Actions par an', c: '#FB6223' },
  { n: '50+', l: 'Partenaires', c: '#C18ED8' },
  { n: '15', l: 'Annees d\'experience', c: '#93C1AF' },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div>
    <!-- Hero -->
    <UiScrollExpandHero
      media-type="image"
      :media-src="HERO_IMAGE"
      :bg-image-src="HERO_BG"
      title="Construisons l'Avenir"
      subtitle="Prado Itineraires"
      scroll-hint="Scrollez pour decouvrir"
    >
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-[#FB6223] text-sm mb-4 tracking-wide">Remobilisation des jeunes en vulnerabilite -- Lyon</p>
        <h2
          class="text-3xl md:text-4xl text-prado-text mb-6 italic"
          :style="{ lineHeight: 1.2, fontFamily: 'Poppins' }"
        >
          Actions culturelles et educatives pour les
          <span class="text-[#FB6223]">12-21 ans</span>
        </h2>
        <p class="text-prado-text-muted text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Portees par Prado Itineraires, association de la Fondation du Prado, nos actions accompagnent les jeunes vers l'autonomie a travers la culture, l'education et l'insertion professionnelle.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink to="/connexion" class="px-7 py-3 rounded-full border border-prado-border-medium text-prado-text hover:bg-prado-surface-hover transition-colors">
            Se connecter
          </NuxtLink>
          <NuxtLink to="/connexion?mode=register" class="px-7 py-3 rounded-full bg-[#CF006C] text-white hover:bg-[#CF006C]/90 transition-colors">
            Creer un compte
          </NuxtLink>
        </div>
      </div>
    </UiScrollExpandHero>

    <!-- 4 piliers -->
    <section class="py-20 bg-prado-bg-deep">
      <div class="max-w-7xl mx-auto px-6">
        <p class="text-[#FB6223] text-sm mb-2 tracking-wide text-center">Nos domaines d'action</p>
        <h2 class="text-3xl md:text-4xl text-prado-text text-center mb-12 italic" :style="{ fontFamily: 'Poppins' }">Quatre leviers pour l'insertion</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <NuxtLink
            v-for="item in pillars"
            :key="item.title"
            :to="item.to"
            class="group bg-prado-surface rounded-2xl p-6 hover:brightness-110 transition-all duration-300 border border-prado-border hover:border-prado-border-light"
          >
            <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-4" :style="{ backgroundColor: item.color + '20' }">
              <component :is="item.icon" :size="20" :style="{ color: item.color }" />
            </div>
            <h3 class="text-prado-text mb-2">{{ item.title }}</h3>
            <p class="text-sm text-prado-text-muted leading-relaxed">{{ item.desc }}</p>
            <span class="inline-flex items-center gap-1 text-sm mt-4 group-hover:gap-2 transition-all" :style="{ color: item.color }">
              Decouvrir <ArrowRight :size="13" />
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Actualites -->
    <section class="py-20">
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

    <!-- Stats -->
    <section class="py-16 bg-prado-bg-deep">
      <div class="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div v-for="s in stats" :key="s.l">
          <div class="text-3xl md:text-4xl mb-1" :style="{ color: s.c, fontFamily: 'Poppins' }">{{ s.n }}</div>
          <div class="text-xs text-prado-text-muted">{{ s.l }}</div>
        </div>
      </div>
    </section>

    <!-- Partenaires -->
    <section class="py-16">
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
    <section class="py-16 bg-gradient-to-r from-[#CF006C] to-[#FB6223]">
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
