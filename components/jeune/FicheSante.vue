<script setup lang="ts">
import { Loader2, Heart } from 'lucide-vue-next'
import { REGIMES_ALIMENTAIRES } from '~/lib/types/sante'
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
      <Heart :size="16" class="text-[#CF006C]" />
      <h3 class="text-sm font-semibold text-prado-text">Informations de sante</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Allergies -->
      <div class="md:col-span-2">
        <label :class="labelClass">Allergies</label>
        <textarea
          v-model="form.allergies"
          :class="inputClass"
          rows="2"
          placeholder="Allergies connues (alimentaires, medicamenteuses, autres...)"
        />
      </div>

      <!-- Handicap -->
      <div>
        <label :class="labelClass">Handicap</label>
        <input v-model="form.handicap" :class="inputClass" placeholder="Type de handicap (si applicable)" />
      </div>

      <!-- Taux d'invalidite -->
      <div>
        <label :class="labelClass">Taux d'invalidite</label>
        <input v-model="form.tauxInvalidite" :class="inputClass" placeholder="Ex: 80%, MDPH en cours..." />
      </div>

      <!-- Regime alimentaire -->
      <div>
        <label :class="labelClass">Regime alimentaire</label>
        <select v-model="form.regimeAlimentaire" :class="inputClass">
          <option v-for="r in REGIMES_ALIMENTAIRES" :key="r.value" :value="r.value">{{ r.label }}</option>
        </select>
      </div>

      <!-- Medecin traitant -->
      <div>
        <label :class="labelClass">Medecin traitant</label>
        <input v-model="form.medecinTraitant" :class="inputClass" placeholder="Nom et coordonnees" />
      </div>

      <!-- Suivi medical -->
      <div class="md:col-span-2">
        <label :class="labelClass">Suivi medical</label>
        <textarea
          v-model="form.suiviMedical"
          :class="inputClass"
          rows="2"
          placeholder="Suivi medical en cours, specialistes..."
        />
      </div>

      <!-- Suivi psychologique -->
      <div class="md:col-span-2">
        <label :class="labelClass">Suivi psychologique</label>
        <textarea
          v-model="form.suiviPsychologique"
          :class="inputClass"
          rows="2"
          placeholder="Suivi psychologique en cours, frequence..."
        />
      </div>

      <!-- Traitements en cours -->
      <div class="md:col-span-2">
        <label :class="labelClass">Traitements en cours</label>
        <textarea
          v-model="form.traitementsEnCours"
          :class="inputClass"
          rows="2"
          placeholder="Medicaments, posologie, duree..."
        />
      </div>

      <!-- Contacts d'urgence -->
      <div class="md:col-span-2">
        <label :class="labelClass">Contacts d'urgence</label>
        <JeuneContactsUrgence v-model="form.contactsUrgence" />
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
        Enregistrer la fiche sante
      </button>
    </div>
  </div>
</template>
