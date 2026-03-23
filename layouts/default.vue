<script setup lang="ts">
import {
  Menu, X, User, LogOut, Facebook, Instagram, Linkedin, Youtube, Sun, Moon,
} from 'lucide-vue-next'
import { Toaster } from 'vue-sonner'

const { user, isAdmin, logout } = useAuth()
const { theme, toggleTheme } = useTheme()
const route = useRoute()

const menuOpen = ref(false)

const navLinks = [
  { to: '/actions', label: 'Programmation' },
  { to: '/foodtruck', label: 'Foodtruck' },
  { to: '/fresque', label: 'Fresque' },
]

const socialIcons = [Facebook, Instagram, Linkedin, Youtube]

function isActive(to: string) {
  return route.path.startsWith(to)
}

function closeMenu() {
  menuOpen.value = false
}

async function handleLogout() {
  await logout()
  closeMenu()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-prado-bg">
    <Toaster position="top-right" rich-colors />

    <!-- Header -->
    <header class="sticky top-0 z-50 bg-prado-header-bg backdrop-blur-md border-b border-prado-border">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 relative">
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <img src="/images/logo.png" alt="Prado Itineraires" class="w-9 h-9 object-contain" />
          <span class="text-prado-text hidden sm:block text-sm tracking-wide">Prado Itineraires</span>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav class="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <NuxtLink
            v-for="l in navLinks"
            :key="l.to"
            :to="l.to"
            :class="[
              'px-3 py-1.5 rounded-md text-sm transition-colors',
              isActive(l.to)
                ? 'text-prado-text'
                : 'text-prado-text-secondary hover:text-prado-text',
            ]"
          >
            {{ l.label }}
          </NuxtLink>
        </nav>

        <!-- Desktop right -->
        <div class="hidden lg:flex items-center gap-2">
          <button
            class="p-2 rounded-full text-prado-text-secondary hover:text-prado-text hover:bg-prado-surface-hover transition-colors"
            aria-label="Changer de theme"
            @click="toggleTheme"
          >
            <Sun v-if="theme === 'dark'" :size="16" />
            <Moon v-else :size="16" />
          </button>
          <template v-if="user">
            <NuxtLink
              v-if="isAdmin"
              to="/admin"
              class="px-3 py-1.5 rounded-full bg-[#004657] text-white text-xs hover:bg-[#003545] transition-colors"
            >
              Admin
            </NuxtLink>
            <NuxtLink
              to="/mon-compte"
              class="flex items-center gap-2 px-4 py-1.5 rounded-full border border-prado-border-medium text-prado-text text-sm hover:bg-prado-surface-hover transition-colors"
            >
              <User :size="14" />
              <span>{{ user.name }}</span>
            </NuxtLink>
            <button
              class="p-2 rounded-full hover:bg-prado-surface-hover text-prado-text-muted hover:text-prado-text transition-colors"
              @click="logout()"
            >
              <LogOut :size="15" />
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/connexion"
              class="p-2 rounded-full border border-prado-border-medium text-prado-text-secondary hover:text-prado-text hover:bg-prado-surface-hover transition-colors"
            >
              <User :size="16" />
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile right -->
        <div class="lg:hidden flex items-center gap-1">
          <button
            class="p-2 text-prado-text-secondary"
            aria-label="Changer de theme"
            @click="toggleTheme"
          >
            <Sun v-if="theme === 'dark'" :size="20" />
            <Moon v-else :size="20" />
          </button>
          <button class="p-2 text-prado-text" @click="menuOpen = !menuOpen">
            <X v-if="menuOpen" :size="22" />
            <Menu v-else :size="22" />
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="menuOpen" class="lg:hidden border-t border-prado-border bg-prado-bg px-6 pb-6 pt-2">
        <NuxtLink
          v-for="l in navLinks"
          :key="l.to"
          :to="l.to"
          :class="[
            'block px-3 py-2.5 rounded-lg text-sm',
            isActive(l.to)
              ? 'text-prado-text bg-prado-surface-hover'
              : 'text-prado-text-secondary',
          ]"
          @click="closeMenu"
        >
          {{ l.label }}
        </NuxtLink>
        <div class="border-t border-prado-border mt-3 pt-3">
          <template v-if="user">
            <NuxtLink
              to="/mon-compte"
              class="block px-3 py-2.5 text-prado-text text-sm"
              @click="closeMenu"
            >
              Mon compte
            </NuxtLink>
            <button
              class="block px-3 py-2.5 text-red-400 text-sm"
              @click="handleLogout"
            >
              Deconnexion
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/connexion"
              class="flex items-center gap-2 px-3 py-2.5 text-prado-text-secondary text-sm"
              @click="closeMenu"
            >
              <User :size="16" /> Connexion
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-prado-bg-deep border-t border-prado-border">
      <div class="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div class="flex items-center gap-2.5 mb-4">
            <img src="/images/logo.png" alt="Prado Itineraires" class="w-8 h-8 object-contain" />
            <span class="text-prado-text text-sm">Prado Itineraires</span>
          </div>
          <p class="text-sm text-prado-text-muted leading-relaxed">
            Innovation sociale au service des jeunes et des familles en vulnerabilite. Lyon, France.
          </p>
        </div>
        <div>
          <h4 class="text-prado-text-secondary text-xs uppercase tracking-wider mb-4">Navigation</h4>
          <div class="flex flex-col gap-2">
            <NuxtLink
              v-for="l in navLinks"
              :key="l.to"
              :to="l.to"
              class="text-sm text-prado-text-muted hover:text-[#FB6223] transition-colors"
            >
              {{ l.label }}
            </NuxtLink>
          </div>
        </div>
        <div>
          <h4 class="text-prado-text-secondary text-xs uppercase tracking-wider mb-4">Contact</h4>
          <div class="space-y-2 text-sm text-prado-text-muted">
            <p>contact@prado-itineraires.fr</p>
            <p>04 72 XX XX XX</p>
            <p>Lyon 7e, France</p>
          </div>
        </div>
        <div>
          <h4 class="text-prado-text-secondary text-xs uppercase tracking-wider mb-4">Suivez-nous</h4>
          <div class="flex gap-2">
            <a
              v-for="(Icon, i) in socialIcons"
              :key="i"
              href="#"
              class="w-9 h-9 rounded-full bg-prado-tag-bg flex items-center justify-center text-prado-text-muted hover:bg-[#CF006C] hover:text-white transition-colors"
            >
              <component :is="Icon" :size="15" />
            </a>
          </div>
        </div>
      </div>
      <div class="border-t border-prado-border py-5 text-center text-xs text-prado-text-faint">
        &copy; 2026 Prado Itineraires -- Fondation du Prado. Tous droits reserves.
      </div>
    </footer>
  </div>
</template>
