<script setup lang="ts">
import { Loader2, Users } from 'lucide-vue-next'
import { MESURES_PROTECTION, LIEUX_HEBERGEMENT } from '~/lib/types/sante'
import type { JeuneSanteInput } from '~/lib/types/sante'

const props = defineProps<{
  saving: boolean
}>()

const emit = defineEmits<{
  save: []
}>()

const form = defineModel<JeuneSanteInput>({ required: true })

const inputClass = 'w-full px-3 py-2 rounded-xl bg-prado-input-bg border border-prado-border text-prado-text text-sm focus:outline-none focus:border-prado-border-medium'
const labelClass = 'text-sm text-prado-text-muted mb-1 block'
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-2 mb-2">
      <Users :size="16" class="text-[#FB6223]" />
      <h3 class="text-sm font-semibold text-prado-text">Situation familiale</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Mesure de protection -->
      <div>
        <label :class="labelClass">Mesure de protection</label>
        <select v-model="form.mesureProtection" :class="inputClass">
          <option v-for="m in MESURES_PROTECTION" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>

      <!-- Lieu d'hebergement -->
      <div>
        <label :class="labelClass">Lieu d'hebergement</label>
        <select v-model="form.lieuHebergement" :class="inputClass">
          <option v-for="l in LIEUX_HEBERGEMENT" :key="l.value" :value="l.value">{{ l.label }}</option>
        </select>
      </div>

      <!-- Referent ASE -->
      <div class="md:col-span-2">
        <label :class="labelClass">Referent ASE / PJJ</label>
        <input v-model="form.referentAse" :class="inputClass" placeholder="Nom, fonction, coordonnees du referent" />
      </div>

      <!-- Composition familiale -->
      <div class="md:col-span-2">
        <label :class="labelClass">Composition familiale</label>
        <textarea
          v-model="form.compositionFamiliale"
          :class="inputClass"
          rows="3"
          placeholder="Parents, fratrie, situation familiale..."
        />
      </div>

      <!-- Droits parentaux -->
      <div class="md:col-span-2">
        <label :class="labelClass">Droits parentaux</label>
        <textarea
          v-model="form.droitsParentaux"
          :class="inputClass"
          rows="2"
          placeholder="Autorite parentale, droits de visite, jugements en cours..."
        />
      </div>

      <!-- Notes confidentielles -->
      <div class="md:col-span-2">
        <label :class="labelClass">Notes confidentielles</label>
        <textarea
          v-model="form.notesConfidentielles"
          :class="inputClass"
          rows="3"
          placeholder="Informations supplementaires strictement confidentielles..."
        />
        <p class="text-[10px] text-prado-text-faint mt-1">
          Ces notes sont chiffrees et accessibles uniquement aux prescripteurs autorises.
        </p>
      </div>
    </div>

    <!-- Save -->
    <div class="flex justify-end pt-2">
      <button
        :disabled="saving"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#004657] text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        @click="emit('save')"
      >
        <Loader2 v-if="saving" :size="14" class="animate-spin" />
        Enregistrer la situation familiale
      </button>
    </div>
  </div>
</template>
