<script setup lang="ts">
import { ArrowRight, Rocket } from 'lucide-vue-next'

const { nextStep, showWidget, openPanel, completedCount, totalSteps } = useOnboarding()
</script>

<template>
  <div
    v-if="showWidget && nextStep"
    class="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[var(--prado-signature)]/15 border-2 border-[var(--prado-signature)]/40 mb-6 group cursor-pointer hover:border-[var(--prado-signature)]/60 hover:bg-[var(--prado-signature)]/20 transition-all"
    @click="openPanel"
  >
    <div class="w-10 h-10 rounded-xl bg-[var(--prado-signature)] flex items-center justify-center shrink-0">
      <Rocket :size="18" class="text-[#1a1a2e]" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-xs text-prado-text-muted font-medium">Prochaine etape ({{ completedCount }}/{{ totalSteps }})</p>
      <p class="text-sm text-prado-text font-semibold truncate">{{ nextStep.label }}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <span class="hidden sm:inline text-xs font-medium text-[var(--prado-signature-accent)]">Continuer</span>
      <ArrowRight
        :size="18"
        class="text-[var(--prado-signature-accent)] group-hover:translate-x-1 transition-transform"
      />
    </div>
  </div>
</template>
