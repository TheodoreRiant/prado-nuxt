<script setup lang="ts">
import { LogIn, UserPlus, Loader2, Lock, Mail, ArrowLeft } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const route = useRoute()
const { login, register, resetPassword, user, loading } = useAuth()

// Steps: 'login' | 'register-email' | 'magic-link-sent' | 'register-password' | 'profile' | 'welcome'
const step = ref<string>(
  route.query.step === 'profile' ? 'profile'
    : route.query.mode === 'register' ? 'register-email'
      : 'login',
)
const magicLinkEmail = ref('')
const forgotPassword = ref(false)
const forgotEmail = ref('')
const submitting = ref(false)

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({
  email: '', password: '', confirmPassword: '', name: '', structure: '', fonction: '', phone: '',
})

// Redirect if already logged in (with profile)
watch(user, (u) => {
  if (u && step.value !== 'profile' && step.value !== 'welcome') {
    // User logged in via magic link, needs profile completion?
    if (!u.name || u.name === '') {
      step.value = 'profile'
    } else if (step.value === 'login') {
      navigateTo('/mon-compte')
    }
  }
}, { immediate: true })

// Handle magic link callback (user arrives with ?step=profile after clicking email link)
onMounted(() => {
  if (route.query.step === 'profile') {
    step.value = 'profile'
  }
})

async function handleLogin() {
  submitting.value = true
  const result = await login(loginForm.value.email, loginForm.value.password)
  submitting.value = false
  if (result.error) {
    toast.error(result.error === 'Invalid login credentials' ? 'Email ou mot de passe incorrect' : result.error)
    return
  }
  toast.success('Connexion réussie !')
  navigateTo('/mon-compte')
}

async function handleRegisterWithPassword() {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas')
    return
  }
  if (registerForm.value.password.length < 6) {
    toast.error('Le mot de passe doit contenir au moins 6 caractères')
    return
  }
  submitting.value = true
  const result = await register(registerForm.value)
  submitting.value = false
  if (result.error) {
    toast.error(result.error)
    return
  }
  toast.success('Compte créé ! Vérifiez votre email pour confirmer.')
  step.value = 'magic-link-sent'
  magicLinkEmail.value = registerForm.value.email
}

function onMagicLinkSent(email: string) {
  magicLinkEmail.value = email
  step.value = 'magic-link-sent'
}

function onSwitchToPassword() {
  step.value = 'register-password'
}

function onProfileCompleted() {
  step.value = 'welcome'
}

async function handleForgotPassword() {
  submitting.value = true
  const result = await resetPassword(forgotEmail.value)
  submitting.value = false
  if (result.error) {
    toast.error(result.error)
    return
  }
  toast.success('Email de réinitialisation envoyé !')
  forgotPassword.value = false
}

const inputClass = 'w-full pl-10 pr-4 py-3 rounded-xl bg-prado-surface border border-prado-border text-prado-text placeholder:text-prado-text-faint focus:outline-none focus:border-[#CF006C]/50 transition-colors'
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-32">
    <Loader2 class="animate-spin text-prado-text-muted" :size="32" />
  </div>

  <div v-else class="max-w-md mx-auto px-6 py-16 min-h-[80vh] flex flex-col justify-center">

    <!-- Step: Login -->
    <template v-if="step === 'login' && !forgotPassword">
      <!-- Mode toggle -->
      <div class="flex rounded-full overflow-hidden bg-prado-surface p-1 mb-8">
        <button
          class="flex-1 py-2.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors bg-[#CF006C] text-white"
        >
          <LogIn :size="15" /> Se connecter
        </button>
        <button
          class="flex-1 py-2.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors text-prado-text-muted"
          @click="step = 'register-email'"
        >
          <UserPlus :size="15" /> Créer un compte
        </button>
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <h2 class="text-xl text-prado-text">Espace professionnel</h2>
        <p class="text-sm text-prado-text-muted mb-2">Connectez-vous pour inscrire des jeunes.</p>

        <div>
          <label class="text-sm text-prado-text-secondary mb-1.5 block">Email professionnel</label>
          <div class="relative">
            <Mail :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-prado-text-muted" />
            <input v-model="loginForm.email" type="email" required :class="inputClass" placeholder="votre@email-pro.fr" />
          </div>
        </div>
        <div>
          <label class="text-sm text-prado-text-secondary mb-1.5 block">Mot de passe</label>
          <div class="relative">
            <Lock :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-prado-text-muted" />
            <input v-model="loginForm.password" type="password" required :class="inputClass" placeholder="••••••••" />
          </div>
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="w-full py-3 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
        >
          <Loader2 v-if="submitting" :size="16" class="animate-spin" />
          Se connecter
        </button>
        <button type="button" class="text-sm text-[#FB6223]" @click="forgotPassword = true">
          Mot de passe oublié ?
        </button>
      </form>
    </template>

    <!-- Forgot password -->
    <template v-if="forgotPassword">
      <h2 class="text-xl text-prado-text mb-6">Mot de passe oublié</h2>
      <form class="space-y-4" @submit.prevent="handleForgotPassword">
        <div>
          <label class="text-sm text-prado-text-secondary mb-1.5 block">Email professionnel</label>
          <div class="relative">
            <Mail :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-prado-text-muted" />
            <input v-model="forgotEmail" type="email" required :class="inputClass" />
          </div>
        </div>
        <button
          type="submit"
          :disabled="submitting"
          class="w-full py-3 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Loader2 v-if="submitting" :size="16" class="animate-spin" />
          Réinitialiser
        </button>
        <button type="button" class="text-sm text-prado-text-faint" @click="forgotPassword = false">
          <ArrowLeft :size="12" class="inline mr-1" /> Retour
        </button>
      </form>
    </template>

    <!-- Step: Register - Email (magic link) -->
    <template v-if="step === 'register-email'">
      <!-- Mode toggle -->
      <div class="flex rounded-full overflow-hidden bg-prado-surface p-1 mb-8">
        <button
          class="flex-1 py-2.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors text-prado-text-muted"
          @click="step = 'login'"
        >
          <LogIn :size="15" /> Se connecter
        </button>
        <button
          class="flex-1 py-2.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors bg-[#CF006C] text-white"
        >
          <UserPlus :size="15" /> Créer un compte
        </button>
      </div>

      <OnboardingStep1
        @magic-link-sent="onMagicLinkSent"
        @switch-to-password="onSwitchToPassword"
      />
    </template>

    <!-- Step: Magic link sent confirmation -->
    <template v-if="step === 'magic-link-sent'">
      <div class="text-center space-y-6">
        <div class="w-16 h-16 rounded-full bg-[#93C1AF]/20 flex items-center justify-center mx-auto">
          <Mail :size="28" class="text-[#93C1AF]" />
        </div>
        <div>
          <h2 class="text-xl text-prado-text mb-3">Vérifiez votre boîte mail</h2>
          <p class="text-prado-text-secondary">
            Nous avons envoyé un lien de connexion à
            <span class="text-prado-text font-medium">{{ magicLinkEmail }}</span>.
          </p>
          <p class="text-sm text-prado-text-muted mt-3">
            Cliquez sur le lien dans l'email pour accéder à votre espace.
            Pensez à vérifier vos spams.
          </p>
        </div>
        <button
          class="text-sm text-prado-text-muted hover:text-prado-text transition-colors"
          @click="step = 'register-email'"
        >
          <ArrowLeft :size="12" class="inline mr-1" /> Changer d'email
        </button>
      </div>
    </template>

    <!-- Step: Register with password (fallback) -->
    <template v-if="step === 'register-password'">
      <button
        class="text-sm text-prado-text-muted mb-6 flex items-center gap-1"
        @click="step = 'register-email'"
      >
        <ArrowLeft :size="14" /> Retour
      </button>

      <div class="space-y-6">
        <div>
          <h2 class="text-xl text-prado-text mb-2">Créer un compte avec mot de passe</h2>
          <p class="text-sm text-prado-text-muted">Remplissez les informations ci-dessous.</p>
        </div>

        <OnboardingProgress :current="1" :total="3" />

        <form class="space-y-4" @submit.prevent="handleRegisterWithPassword">
          <div>
            <label class="text-sm text-prado-text-secondary mb-1.5 block">Nom complet *</label>
            <input v-model="registerForm.name" type="text" required :class="inputClass.replace('pl-10', 'pl-4')" />
          </div>
          <div>
            <label class="text-sm text-prado-text-secondary mb-1.5 block">Email professionnel *</label>
            <input v-model="registerForm.email" type="email" required :class="inputClass.replace('pl-10', 'pl-4')" />
          </div>
          <div>
            <label class="text-sm text-prado-text-secondary mb-1.5 block">Structure *</label>
            <input v-model="registerForm.structure" type="text" required :class="inputClass.replace('pl-10', 'pl-4')" />
          </div>
          <div>
            <label class="text-sm text-prado-text-secondary mb-1.5 block">Mot de passe *</label>
            <input v-model="registerForm.password" type="password" required :class="inputClass.replace('pl-10', 'pl-4')" placeholder="6 caractères minimum" />
          </div>
          <div>
            <label class="text-sm text-prado-text-secondary mb-1.5 block">Confirmer *</label>
            <input v-model="registerForm.confirmPassword" type="password" required :class="inputClass.replace('pl-10', 'pl-4')" />
          </div>
          <button
            type="submit"
            :disabled="submitting"
            class="w-full py-3 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
          >
            <Loader2 v-if="submitting" :size="16" class="animate-spin" />
            Créer mon compte
          </button>
        </form>
      </div>
    </template>

    <!-- Step: Complete profile (after magic link) -->
    <template v-if="step === 'profile'">
      <OnboardingStep2
        :email="user?.email ?? magicLinkEmail"
        @completed="onProfileCompleted"
      />
    </template>

    <!-- Step: Welcome -->
    <template v-if="step === 'welcome'">
      <OnboardingStep3 />
    </template>
  </div>
</template>
