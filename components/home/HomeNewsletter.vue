<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
</script>

<template>
  <section class="py-16 border-y border-prado-border">
    <div class="max-w-3xl mx-auto px-6">
      <div class="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <!-- Left: text -->
        <div class="flex-1 text-center md:text-left">
          <div class="flex items-center gap-2 justify-center md:justify-start mb-2">
            <Mail :size="18" class="text-prado-orange" />
            <h3 class="text-prado-text font-medium">Restez informé·e</h3>
          </div>
          <p class="text-sm text-prado-text-muted">
            Recevez les actualités, nouvelles actions et événements de Prado Itinéraires. 1 email par mois, désabonnement en 1 clic.
          </p>
        </div>

        <!-- Right: form -->
        <div class="w-full md:w-auto md:min-w-[320px]">
          <UiNewsletterForm show-structure source="homepage" />
        </div>
      </div>
    </div>
  </section>
</template>
