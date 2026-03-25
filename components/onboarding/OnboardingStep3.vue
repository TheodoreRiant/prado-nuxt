<script setup lang="ts">
import { BookOpen, FileText, UserPlus, ArrowRight, PartyPopper, ShieldCheck, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const { user } = useAuth()
const { startVerification, verifying, status, error: veriffError } = useVeriff()

const firstName = computed(() => user.value?.name?.split(' ')[0] ?? '')

const cards = [
  {
    icon: UserPlus,
    title: 'Ajouter votre premier jeune',
    desc: 'Créez une fiche pour inscrire un jeune à une action.',
    to: '/espace/jeunes',
    color: '#93C1AF',
  },
  {
    icon: BookOpen,
    title: 'Parcourir les 89 actions',
    desc: 'Ateliers, formations, stages — découvrez l\'offre complète.',
    to: '/espace',
    color: '#CF006C',
  },
  {
    icon: FileText,
    title: 'Consulter les 183 ressources',
    desc: 'Guides pratiques, fiches dispositifs, outils pédagogiques.',
    to: '/espace',
    color: '#FB6223',
  },
]

async function handleVerify() {
  const [first, ...rest] = (user.value?.name ?? '').split(' ')
  await startVerification(first, rest.join(' '))
}

watch(status, (val) => {
  if (val === 'submitted') {
    toast.success('Vérification soumise ! Vous serez notifié du résultat.')
  }
  if (val === 'canceled') {
    toast.info('Vérification annulée. Vous pouvez réessayer plus tard depuis vos paramètres.')
  }
})

watch(veriffError, (val) => {
  if (val) toast.error(val)
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <div class="inline-flex items-center gap-2 text-[#93C1AF] mb-4">
        <PartyPopper :size="20" />
        <span class="text-sm font-medium">Compte créé avec succès</span>
      </div>
      <h1 class="text-2xl md:text-3xl text-prado-text mb-3">
        Bienvenue{{ firstName ? ` ${firstName}` : '' }} !
      </h1>
      <p class="text-prado-text-secondary">
        Votre compte est actif. Voici ce que vous pouvez faire dès maintenant.
      </p>
    </div>

    <!-- Progress -->
    <OnboardingProgress :current="2" :total="3" />

    <!-- 3 action cards -->
    <div class="space-y-3">
      <NuxtLink
        v-for="card in cards"
        :key="card.title"
        :to="card.to"
        class="group flex items-center gap-4 p-4 rounded-xl bg-prado-surface border border-prado-border hover:border-prado-border-light transition-all"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          :style="{ backgroundColor: card.color + '15' }"
        >
          <component :is="card.icon" :size="22" :style="{ color: card.color }" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-prado-text font-medium">{{ card.title }}</div>
          <div class="text-sm text-prado-text-muted">{{ card.desc }}</div>
        </div>
        <ArrowRight
          :size="16"
          class="text-prado-text-muted group-hover:text-prado-text group-hover:translate-x-1 transition-all shrink-0"
        />
      </NuxtLink>
    </div>

    <!-- Identity verification -->
    <div
      v-if="!user?.identityVerified && status !== 'submitted'"
      class="bg-[#004657]/10 rounded-xl p-4 border border-[#004657]/20"
    >
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#004657]/15 flex items-center justify-center shrink-0">
          <ShieldCheck :size="20" class="text-[#004657]" />
        </div>
        <div class="flex-1">
          <p class="text-prado-text font-medium mb-1">Vérifiez votre identité</p>
          <p class="text-sm text-prado-text-secondary mb-3">
            Renforcez la confiance en vérifiant votre identité avec une pièce d'identité. Rapide et sécurisé.
          </p>
          <button
            :disabled="verifying"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#004657] text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            @click="handleVerify"
          >
            <Loader2 v-if="verifying" :size="14" class="animate-spin" />
            <ShieldCheck v-else :size="14" />
            {{ verifying ? 'Lancement...' : 'Vérifier mon identité' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Verification submitted -->
    <div
      v-else-if="status === 'submitted'"
      class="bg-[#93C1AF]/10 rounded-xl p-4 border border-[#93C1AF]/20"
    >
      <div class="flex items-center gap-3">
        <ShieldCheck :size="20" class="text-[#93C1AF]" />
        <div>
          <p class="text-[#93C1AF] font-medium">Vérification en cours</p>
          <p class="text-sm text-prado-text-secondary">
            Votre identité est en cours de vérification. Vous serez notifié du résultat.
          </p>
        </div>
      </div>
    </div>

    <!-- Already verified badge -->
    <div
      v-else-if="user?.identityVerified"
      class="bg-[#93C1AF]/10 rounded-xl p-4 border border-[#93C1AF]/20"
    >
      <div class="flex items-center gap-3">
        <ShieldCheck :size="20" class="text-[#93C1AF]" />
        <p class="text-[#93C1AF] font-medium">Identité vérifiée</p>
      </div>
    </div>

    <!-- Info banner -->
    <div class="bg-[#FB6223]/10 rounded-xl p-4 text-sm">
      <p class="text-[#FB6223] font-medium mb-1">En attente de validation</p>
      <p class="text-prado-text-secondary">
        Votre compte sera validé par notre équipe sous 24h. En attendant, vous pouvez naviguer librement et préparer vos inscriptions.
      </p>
    </div>

    <!-- Go to dashboard -->
    <NuxtLink
      to="/espace"
      class="block w-full py-3 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] transition-colors text-center font-medium"
    >
      Accéder à mon espace
    </NuxtLink>
  </div>
</template>
