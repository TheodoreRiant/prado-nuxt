<script setup lang="ts">
const HERO_IMAGE = '/images/hero-jeunes.jpg'
const HERO_BG = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1920&auto=format&fit=crop'
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

    <!-- Section 6 — Témoignages -->
    <div id="temoignages">
      <HomeTestimonials />
    </div>

    <!-- Section 7 — FAQ -->
    <div id="faq">
      <HomeFaq />
    </div>

    <!-- Section 8 — Partenaires -->
    <div id="partenaires">
      <HomePartenaires />
    </div>

    <!-- Section 9 — En savoir plus -->
    <div id="en-savoir-plus">
      <HomeEnSavoirPlus />
    </div>

    <!-- Section 10 — CTA Final -->
    <div id="cta">
      <HomeCtaFinal />
    </div>
  </div>
</template>
