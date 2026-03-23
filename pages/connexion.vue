<script setup lang="ts">
import { LogIn, UserPlus, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const route = useRoute()
const { login, register, resetPassword, user, loading } = useAuth()

const mode = ref<'login' | 'register'>(
  route.query.mode === 'register' ? 'register' : 'login'
)
const loginForm = ref({ email: '', password: '' })
const registerForm = ref({
  email: '', password: '', confirmPassword: '', name: '', structure: '', phone: '',
})
const forgotPassword = ref(false)
const forgotEmail = ref('')
const submitting = ref(false)

watch(user, (newUser) => {
  if (newUser) navigateTo('/mon-compte')
}, { immediate: true })

async function handleLogin() {
  submitting.value = true
  const result = await login(loginForm.value.email, loginForm.value.password)
  submitting.value = false
  if (result.error) {
    toast.error(
      result.error === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect'
        : result.error
    )
    return
  }
  toast.success('Connexion reussie !')
  setTimeout(() => navigateTo('/mon-compte'), 300)
}

async function handleRegister() {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    toast.error('Mots de passe differents')
    return
  }
  if (registerForm.value.password.length < 6) {
    toast.error('Le mot de passe doit contenir au moins 6 caracteres')
    return
  }
  submitting.value = true
  const result = await register(registerForm.value)
  submitting.value = false
  if (result.error) {
    toast.error(result.error)
    return
  }
  toast.success('Compte cree ! Verifiez votre email pour confirmer.')
}

async function handleForgotPassword() {
  submitting.value = true
  const result = await resetPassword(forgotEmail.value)
  submitting.value = false
  if (result.error) {
    toast.error(result.error)
    return
  }
  toast.success('Email de reinitialisation envoye !')
  forgotPassword.value = false
}

const registerFields = [
  { label: 'Nom complet', key: 'name', type: 'text' },
  { label: 'Email professionnel', key: 'email', type: 'email' },
  { label: 'Structure / Etablissement', key: 'structure', type: 'text' },
  { label: 'Telephone', key: 'phone', type: 'text' },
  { label: 'Mot de passe', key: 'password', type: 'password' },
  { label: 'Confirmer le mot de passe', key: 'confirmPassword', type: 'password' },
]

const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-prado-surface border border-prado-border text-prado-text placeholder:text-prado-text-faint focus:outline-none focus:border-prado-border-medium'
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-32">
    <Loader2 class="animate-spin text-prado-text-muted" :size="32" />
  </div>

  <div v-else class="max-w-md mx-auto px-6 py-20">
    <!-- Forgot password -->
    <div v-if="forgotPassword">
      <h1 class="text-2xl text-prado-text mb-6 italic" :style="{ fontFamily: 'Poppins' }">
        Mot de passe oublie
      </h1>
      <form class="space-y-4" @submit.prevent="handleForgotPassword">
        <div>
          <label class="text-sm text-prado-text-secondary mb-1.5 block">Email professionnel</label>
          <input v-model="forgotEmail" type="email" required :class="inputClass" />
        </div>
        <button
          type="submit"
          :disabled="submitting"
          class="w-full py-2.5 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Loader2 v-if="submitting" :size="16" class="animate-spin" />
          Reinitialiser
        </button>
        <button
          type="button"
          class="text-sm text-prado-text-faint underline"
          @click="forgotPassword = false"
        >
          Retour
        </button>
      </form>
    </div>

    <!-- Login / Register -->
    <template v-else>
      <div class="flex rounded-full overflow-hidden bg-prado-surface p-1 mb-10">
        <button
          :class="[
            'flex-1 py-2.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors',
            mode === 'login' ? 'bg-[#CF006C] text-white' : 'text-prado-text-muted',
          ]"
          @click="mode = 'login'"
        >
          <LogIn :size="15" /> Se connecter
        </button>
        <button
          :class="[
            'flex-1 py-2.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors',
            mode === 'register' ? 'bg-[#CF006C] text-white' : 'text-prado-text-muted',
          ]"
          @click="mode = 'register'"
        >
          <UserPlus :size="15" /> Creer un compte
        </button>
      </div>

      <!-- Login form -->
      <form v-if="mode === 'login'" class="space-y-4" @submit.prevent="handleLogin">
        <h2 class="text-xl text-prado-text italic" :style="{ fontFamily: 'Poppins' }">
          Espace prescripteur
        </h2>
        <p class="text-sm text-prado-text-muted mb-2">
          Connectez-vous pour inscrire des jeunes.
        </p>
        <div>
          <label class="text-sm text-prado-text-secondary mb-1.5 block">Email professionnel</label>
          <input
            v-model="loginForm.email"
            type="email"
            required
            :class="inputClass"
            placeholder="votre@email-pro.fr"
          />
        </div>
        <div>
          <label class="text-sm text-prado-text-secondary mb-1.5 block">Mot de passe</label>
          <input
            v-model="loginForm.password"
            type="password"
            required
            :class="inputClass"
            placeholder="--------"
          />
        </div>
        <button
          type="submit"
          :disabled="submitting"
          class="w-full py-2.5 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Loader2 v-if="submitting" :size="16" class="animate-spin" />
          Se connecter
        </button>
        <button
          type="button"
          class="text-sm text-[#FB6223] underline"
          @click="forgotPassword = true"
        >
          Mot de passe oublie ?
        </button>
      </form>

      <!-- Register form -->
      <form v-else class="space-y-4" @submit.prevent="handleRegister">
        <h2 class="text-xl text-prado-text italic" :style="{ fontFamily: 'Poppins' }">
          Creer un compte
        </h2>
        <p class="text-sm text-prado-text-muted mb-2">
          Votre compte sera valide par l'association.
        </p>
        <div v-for="f in registerFields" :key="f.key">
          <label class="text-sm text-prado-text-secondary mb-1.5 block">{{ f.label }}</label>
          <input
            :type="f.type"
            :value="(registerForm as Record<string, string>)[f.key]"
            :required="f.key !== 'phone'"
            :class="inputClass"
            @input="(registerForm as Record<string, string>)[f.key] = ($event.target as HTMLInputElement).value"
          />
        </div>
        <button
          type="submit"
          :disabled="submitting"
          class="w-full py-2.5 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Loader2 v-if="submitting" :size="16" class="animate-spin" />
          Creer mon compte
        </button>
      </form>
    </template>
  </div>
</template>
