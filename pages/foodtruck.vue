<script setup lang="ts">
import { MapPin, Utensils, Phone, Users, ChefHat, Heart } from 'lucide-vue-next'

const tournee = [
  {
    jour: 'Mardi',
    details: [
      { lieu: 'Siege de Lyon Metropole Habitat (Lyon 3e)', precision: '1er mardi du mois' },
      { lieu: 'Green Campus Park (Venissieux)', precision: 'Les autres mardis' },
    ],
  },
  {
    jour: 'Mercredi',
    details: [
      { lieu: 'Parc Neuville Industries', precision: 'En alternance' },
      { lieu: 'Les Cles de l\'Atelier (La Mulatiere)', precision: '1er mercredi du mois' },
    ],
  },
  {
    jour: 'Jeudi',
    details: [
      { lieu: 'Centre de Formation Simon Rousseau (Fontaines-sur-Saone)', precision: 'En alternance' },
      { lieu: 'Centre de Formation Arfrips (Lyon Vaise)', precision: 'En alternance' },
      { lieu: 'Direction Generale (Fontaines-Saint-Martin)', precision: 'En alternance' },
    ],
  },
]

const highlights = [
  { icon: ChefHat, label: 'Stage d\'une semaine', desc: 'Cuisine & vente' },
  { icon: Users, label: 'Accompagnement', desc: 'Educateur specialise' },
  { icon: Heart, label: 'Solidaire', desc: 'Distributions gratuites' },
]

const plats = [
  { name: 'Choucroute traditionnelle', desc: 'Choucroute, pomme de terre, saucisse de Strasbourg, poitrine fumee, saucisse fumee et roti de porc' },
  { name: 'Choucroute de la mer', desc: 'Choucroute, pomme de terre, haddock, crevette, moule et filet de poisson (selon arrivage)' },
  { name: 'Choucroute vegetarienne', desc: 'Choucroute, pomme de terre, tofu fume, navet et courge rotis' },
]

const desserts = [
  { name: 'Salade de fruits de saison', desc: 'Jus de citron et fruits de saison' },
  { name: 'Strudel a la pomme', desc: 'Pate feuilletee, pomme, raisins secs, cannelle, sucre glace, amandes' },
]

const steps = [
  { step: '01', title: 'Le prescripteur nous contacte', desc: 'Par telephone ou via le formulaire de contact pour convenir d\'une semaine de stage.', color: '#FB6223' },
  { step: '02', title: 'Validation et preparation', desc: 'Un entretien est organise avec le jeune et son referent pour preparer le stage.', color: '#CF006C' },
  { step: '03', title: 'Semaine de stage', desc: 'Le jeune integre l\'equipe pendant une semaine : cuisine, vente, relation client.', color: '#93C1AF' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <div class="relative h-[50vh] min-h-[380px] flex items-end">
      <div class="absolute inset-0">
        <ImageWithFallback src="/images/foodtruck.png" alt="Les Saveurs d'Elise - Foodtruck solidaire" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-prado-bg via-prado-bg/70 to-transparent" />
      </div>
      <div class="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
        <p class="text-[#FB6223] text-sm mb-3 tracking-widest uppercase">Foodtruck solidaire</p>
        <h1 class="text-4xl md:text-5xl lg:text-6xl text-prado-text mb-3" :style="{ fontFamily: 'Poppins', lineHeight: 1.1 }">
          Les Saveurs d'Elise
        </h1>
        <p class="text-prado-text-muted text-lg md:text-xl max-w-lg">Apprendre &amp; Regaler !</p>
      </div>
    </div>

    <!-- Presentation -->
    <div class="max-w-7xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        <div class="lg:col-span-3 space-y-6">
          <h2 class="text-2xl md:text-3xl text-prado-text" :style="{ fontFamily: 'Poppins' }">Notre projet</h2>
          <p class="text-prado-text-muted leading-relaxed text-base">
            Concept pedagogique et inclusif, "Les Saveurs d'Elise" est une offre de restauration mobile qui favorise l'insertion socio-professionnelle des jeunes : accueillis en stage pendant une semaine dans la cuisine centrale et/ou en vente directe au public, les jeunes experimentent, rencontrent, se valorisent, tout en etant accompagnes par un educateur specialise.
          </p>
          <p class="text-prado-text-muted leading-relaxed text-base">
            Notre menu, de saison et peu cher, est une invitation a la rencontre avec nos jeunes cuisiniers d'un jour et des distributions solidaires sont organisees en marge de l'activite principale.
          </p>
          <p class="text-prado-text-muted text-sm italic border-l-2 border-[#FB6223] pl-4">
            Ce projet inclusif et solidaire est co-porte par le territoire Rhone et Saone de Prado Education et Prado Itineraires.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div v-for="item in highlights" :key="item.label" class="bg-prado-surface rounded-2xl p-5 border border-prado-border">
              <component :is="item.icon" :size="22" class="text-[#FB6223] mb-3" />
              <div class="text-prado-text text-sm mb-1">{{ item.label }}</div>
              <div class="text-prado-text-muted text-xs">{{ item.desc }}</div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 rounded-2xl overflow-hidden">
          <ImageWithFallback src="/images/foodtruck-cuisine.png" alt="Jeunes en stage cuisine dans le foodtruck" class="w-full h-full object-cover aspect-[4/5]" />
        </div>
      </div>
    </div>

    <div class="h-px bg-prado-border max-w-7xl mx-auto" />

    <!-- Menu + Tournee -->
    <div class="max-w-7xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Menu du mois -->
        <div>
          <h2 class="text-2xl text-prado-text mb-2 flex items-center gap-2.5" :style="{ fontFamily: 'Poppins' }">
            <Utensils :size="22" class="text-[#FB6223]" /> Menu du mois
          </h2>
          <p class="text-prado-text-muted text-sm mb-6">Menu de saison, a prix reduit. Mis a jour chaque mois.</p>

          <div class="bg-prado-surface rounded-2xl border border-prado-border p-6 space-y-5">
            <p class="text-center text-prado-text-secondary italic text-sm mb-4">"D'Lieb geht durich de Maawe"</p>

            <div>
              <h4 class="text-xs uppercase tracking-wider text-[#FB6223] mb-2">Entree</h4>
              <div class="bg-prado-bg rounded-xl p-3">
                <p class="text-prado-text text-sm">Carottes rappees</p>
                <p class="text-prado-text-faint text-xs">Carottes, jus de citron et vinaigrette</p>
              </div>
            </div>

            <div>
              <h4 class="text-xs uppercase tracking-wider text-[#FB6223] mb-2">Plats</h4>
              <div class="space-y-2">
                <div v-for="p in plats" :key="p.name" class="bg-prado-bg rounded-xl p-3">
                  <p class="text-prado-text text-sm">{{ p.name }}</p>
                  <p class="text-prado-text-faint text-xs">{{ p.desc }}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-xs uppercase tracking-wider text-[#FB6223] mb-2">Desserts</h4>
              <div class="space-y-2">
                <div v-for="d in desserts" :key="d.name" class="bg-prado-bg rounded-xl p-3">
                  <p class="text-prado-text text-sm">{{ d.name }}</p>
                  <p class="text-prado-text-faint text-xs">{{ d.desc }}</p>
                </div>
              </div>
            </div>

            <div class="border-t border-prado-border pt-4">
              <h4 class="text-xs uppercase tracking-wider text-[#93C1AF] mb-3">Tarifs</h4>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-prado-bg rounded-xl p-4 text-center">
                  <p class="text-[#93C1AF] text-xs uppercase tracking-wider mb-1">Prix solidaire</p>
                  <div class="space-y-1 text-sm">
                    <p class="text-prado-text">Menu : <span class="text-[#FB6223]">9</span></p>
                    <p class="text-prado-text">Plat seul : <span class="text-[#FB6223]">6</span></p>
                    <p class="text-prado-text">Dessert/Entree : <span class="text-[#FB6223]">3</span></p>
                  </div>
                </div>
                <div class="bg-prado-bg rounded-xl p-4 text-center">
                  <p class="text-prado-text-muted text-xs uppercase tracking-wider mb-1">Tarif normal</p>
                  <div class="space-y-1 text-sm">
                    <p class="text-prado-text">Menu : <span class="text-[#FB6223]">13</span></p>
                    <p class="text-prado-text">Plat : <span class="text-[#FB6223]">8</span></p>
                    <p class="text-prado-text">Dessert/Entree : <span class="text-[#FB6223]">3</span></p>
                  </div>
                </div>
              </div>
              <p class="text-prado-text-faint text-xs text-center mt-3">Boisson gratuite et a volonte</p>
            </div>
          </div>

          <div class="bg-gradient-to-r from-[#FB6223]/10 to-[#CF006C]/5 rounded-2xl p-5 border border-prado-border mt-6 flex items-start gap-4">
            <Phone :size="18" class="text-[#FB6223] mt-0.5 shrink-0" />
            <div>
              <p class="text-prado-text text-sm mb-1">Renseignements menus &amp; tournees</p>
              <p class="text-prado-text-muted text-sm">06 24 68 52 04 / 06 81 44 37 13</p>
            </div>
          </div>
        </div>

        <!-- Info tournee -->
        <div>
          <h2 class="text-2xl text-prado-text mb-2 flex items-center gap-2.5" :style="{ fontFamily: 'Poppins' }">
            <MapPin :size="22" class="text-[#93C1AF]" /> Info tournee
          </h2>
          <p class="text-prado-text-muted text-sm mb-6">A partir de septembre 2025</p>

          <div class="space-y-4">
            <div v-for="t in tournee" :key="t.jour" class="bg-prado-surface rounded-2xl border border-prado-border p-5">
              <div class="flex items-center gap-2 mb-3">
                <span class="px-3 py-1 rounded-full bg-[#93C1AF]/15 text-[#93C1AF] text-xs font-medium">{{ t.jour }}</span>
              </div>
              <div class="space-y-2.5">
                <div v-for="(d, i) in t.details" :key="i" class="flex items-start gap-3 text-sm">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#FB6223] mt-1.5 shrink-0" />
                  <div>
                    <span class="text-prado-text">{{ d.lieu }}</span>
                    <span class="text-prado-text-faint ml-2">-- {{ d.precision }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="h-px bg-prado-border max-w-7xl mx-auto" />

    <!-- Modalites -->
    <div class="max-w-7xl mx-auto px-6 py-16">
      <h2 class="text-2xl md:text-3xl text-prado-text mb-3 text-center" :style="{ fontFamily: 'Poppins' }">
        Modalites d'inscription
      </h2>
      <p class="text-prado-text-muted text-center max-w-2xl mx-auto mb-10">
        L'inscription au stage foodtruck se fait via un prescripteur (educateur, referent, conseiller mission locale...).
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div v-for="s in steps" :key="s.step" class="bg-prado-surface rounded-2xl p-6 border border-prado-border text-center">
          <div class="text-3xl mb-4" :style="{ color: s.color, fontFamily: 'Poppins' }">{{ s.step }}</div>
          <h3 class="text-prado-text text-sm mb-2">{{ s.title }}</h3>
          <p class="text-prado-text-muted text-xs leading-relaxed">{{ s.desc }}</p>
        </div>
      </div>

      <div class="text-center mt-10 flex flex-wrap justify-center gap-4">
        <NuxtLink to="/contact" class="px-8 py-3.5 rounded-full bg-[#FB6223] text-white hover:bg-[#e5571f] transition-colors">
          Nous contacter
        </NuxtLink>
        <a href="tel:0624685204" class="px-8 py-3.5 rounded-full border border-prado-border-medium text-prado-text hover:bg-prado-surface-hover transition-colors flex items-center gap-2">
          <Phone :size="16" /> 06 24 68 52 04
        </a>
      </div>
    </div>
  </div>
</template>
