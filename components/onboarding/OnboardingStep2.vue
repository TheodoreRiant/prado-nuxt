<script setup lang="ts">
import { Loader2, User, Building, Briefcase, Phone } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { STRUCTURES_PARTENAIRES, DOMAIN_TO_STRUCTURE } from '~/constants/structures'

const emit = defineEmits<{
  completed: []
}>()

const props = defineProps<{
  email?: string
}>()

const { completeProfile } = useAuth()
const { complete } = useOnboarding()

const form = ref({
  name: '',
  fonction: '',
  structure: '',
  phone: '',
})
const submitting = ref(false)
const showStructureDropdown = ref(false)

const FONCTIONS = [
  'Éducateur·rice spécialisé·e',
  'Référent·e ASE',
  'Référent·e PJJ',
  'Conseiller·e en insertion',
  'Chef·fe de service',
  'Travailleur·se social·e',
  'Coordinateur·rice',
  'Autre',
]

// Auto-detect structure from email domain
onMounted(() => {
  if (props.email) {
    const domain = props.email.split('@')[1]?.toLowerCase()
    if (domain && DOMAIN_TO_STRUCTURE[domain]) {
      form.value.structure = DOMAIN_TO_STRUCTURE[domain]
    }
  }
})

const filteredStructures = computed(() => {
  const query = form.value.structure.toLowerCase()
  if (!query) return [...STRUCTURES_PARTENAIRES]
  return STRUCTURES_PARTENAIRES.filter(s =>
    s.toLowerCase().includes(query),
  )
})

function selectStructure(name: string) {
  form.value.structure = name
  showStructureDropdown.value = false
}

async function handleSubmit() {
  if (!form.value.name || !form.value.structure) {
    toast.error('Veuillez remplir les champs obligatoires')
    return
  }
  submitting.value = true
  const result = await completeProfile(form.value)
  submitting.value = false
  if (result.error) {
    toast.error(result.error)
    return
  }
  complete('accountCreated')
  complete('profileCompleted')
  toast.success('Profil complété !')
  emit('completed')
}

const inputClass = 'w-full pl-10 pr-4 py-3 rounded-xl bg-prado-surface border border-prado-border text-prado-text placeholder:text-prado-text-faint focus:outline-none focus:border-[#CF006C]/50 transition-colors'
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-2xl md:text-3xl text-prado-text mb-3">
        Votre profil professionnel
      </h1>
      <p class="text-prado-text-secondary">
        Ces informations nous permettent de valider votre compte.
      </p>
    </div>

    <!-- Progress -->
    <OnboardingProgress :current="1" :total="3" />

    <!-- Form -->
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Nom -->
      <div>
        <label class="text-sm text-prado-text-secondary mb-1.5 block">Nom complet *</label>
        <div class="relative">
          <User :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-prado-text-muted" />
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Prénom Nom"
            :class="inputClass"
          />
        </div>
      </div>

      <!-- Fonction -->
      <div>
        <label class="text-sm text-prado-text-secondary mb-1.5 block">Fonction</label>
        <div class="relative">
          <Briefcase :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-prado-text-muted" />
          <select
            v-model="form.fonction"
            :class="inputClass"
          >
            <option value="" disabled>Sélectionner votre fonction</option>
            <option v-for="f in FONCTIONS" :key="f" :value="f">{{ f }}</option>
          </select>
        </div>
      </div>

      <!-- Structure (autocomplete) -->
      <div class="relative">
        <label class="text-sm text-prado-text-secondary mb-1.5 block">Structure / Établissement *</label>
        <div class="relative">
          <Building :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-prado-text-muted" />
          <input
            v-model="form.structure"
            type="text"
            required
            placeholder="Tapez pour rechercher..."
            :class="inputClass"
            @focus="showStructureDropdown = true"
            @blur="setTimeout(() => showStructureDropdown = false, 200)"
          />
        </div>
        <!-- Dropdown -->
        <div
          v-if="showStructureDropdown && filteredStructures.length > 0"
          class="absolute z-20 w-full mt-1 max-h-48 overflow-y-auto bg-prado-surface border border-prado-border rounded-xl shadow-lg"
        >
          <button
            v-for="s in filteredStructures"
            :key="s"
            type="button"
            class="w-full text-left px-4 py-2.5 text-sm text-prado-text hover:bg-prado-surface-hover transition-colors first:rounded-t-xl last:rounded-b-xl"
            @mousedown.prevent="selectStructure(s)"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <!-- Téléphone -->
      <div>
        <label class="text-sm text-prado-text-secondary mb-1.5 block">Téléphone <span class="text-prado-text-faint">(optionnel)</span></label>
        <div class="relative">
          <Phone :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-prado-text-muted" />
          <input
            v-model="form.phone"
            type="tel"
            placeholder="06 XX XX XX XX"
            :class="inputClass"
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="submitting"
        class="w-full py-3 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
      >
        <Loader2 v-if="submitting" :size="16" class="animate-spin" />
        Continuer
      </button>
    </form>

    <!-- Testimonial -->
    <div class="bg-prado-surface rounded-xl p-4 border border-prado-border">
      <p class="text-sm text-prado-text-secondary italic leading-relaxed">
        « La plateforme simplifie énormément les inscriptions. »
      </p>
      <p class="text-xs text-prado-text-muted mt-2">
        — Marie D., éducatrice spécialisée
      </p>
    </div>
  </div>
</template>
