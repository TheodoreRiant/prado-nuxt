<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'

const { steps, progress, showChecklist, dismiss } = useOnboarding()
</script>

<template>
  <div
    v-if="showChecklist"
    class="bg-prado-surface rounded-2xl border border-prado-border p-6 mb-8"
  >
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-prado-text font-medium">Démarrage rapide</h3>
        <p class="text-sm text-prado-text-muted">Complétez ces étapes pour être opérationnel·le</p>
      </div>
      <button
        class="text-prado-text-faint hover:text-prado-text-muted transition-colors"
        title="Masquer"
        @click="dismiss"
      >
        <X :size="16" />
      </button>
    </div>

    <!-- Progress bar -->
    <div class="h-2 rounded-full bg-prado-bg-deep overflow-hidden mb-5">
      <div
        class="h-full rounded-full bg-gradient-to-r from-[#CF006C] to-[#FB6223] transition-all duration-700 ease-out"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <!-- Steps -->
    <ul class="space-y-2">
      <li
        v-for="step in steps"
        :key="step.key"
        class="flex items-center gap-3 py-1"
      >
        <div
          class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors"
          :class="step.done
            ? 'bg-[#93C1AF]'
            : 'border border-prado-border-medium'"
        >
          <Check v-if="step.done" :size="12" class="text-white" />
        </div>
        <span
          class="text-sm transition-colors"
          :class="step.done ? 'text-prado-text-muted line-through' : 'text-prado-text'"
        >
          {{ step.label }}
        </span>
      </li>
    </ul>
  </div>
</template>
