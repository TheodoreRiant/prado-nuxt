<script setup lang="ts">
import { ExternalLink, BookOpen } from 'lucide-vue-next'

const IMAGES = {
  creative: 'https://images.unsplash.com/photo-1752649935124-f5a7ac531a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlb3BsZSUyMGNyZWF0aXZlJTIwYXJ0JTIwd29ya3Nob3B8ZW58MXx8fHwxNzc0Mjc0NTE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
}
</script>

<template>
  <div>
    <div class="relative h-[40vh] min-h-[300px] flex items-end">
      <div class="absolute inset-0">
        <img :src="IMAGES.creative" alt="Educolab" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-prado-bg via-prado-bg/60 to-transparent" />
      </div>
      <div class="relative z-10 max-w-7xl mx-auto px-6 pb-10 w-full">
        <p class="text-[#93C1AF] text-sm mb-2 tracking-wide">Competences parentales</p>
        <h1 class="text-4xl md:text-5xl text-prado-text italic" :style="{ fontFamily: 'Poppins' }">Educolab</h1>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-16 text-center">
      <div class="bg-prado-surface rounded-2xl p-10 border border-prado-border">
        <div class="w-16 h-16 rounded-2xl bg-[#93C1AF]/15 flex items-center justify-center mx-auto mb-6">
          <BookOpen :size="30" class="text-[#93C1AF]" />
        </div>
        <h2 class="text-2xl text-prado-text mb-4">Programmes educatifs</h2>
        <p class="text-prado-text-muted mb-4 leading-relaxed">
          Educolab regroupe les programmes de renforcement des competences parentales, a destination des familles et professionnels de l'education et de la petite enfance.
        </p>
        <p class="text-prado-text-muted mb-8 leading-relaxed">
          Ce volet dispose de son propre site internet avec toutes les informations sur les programmes, formations et ressources.
        </p>
        <a
          href="https://educolab.le-prado.fr"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#93C1AF] text-white hover:bg-[#7dab98] transition-colors"
        >
          Visiter le site Educolab <ExternalLink :size="15" />
        </a>
      </div>
    </div>
  </div>
</template>
