<script setup lang="ts">
import {
  LayoutDashboard, Users, ClipboardList, LogOut, Menu, X,
} from 'lucide-vue-next'
import { Toaster } from 'vue-sonner'

const { user, logout } = useAuth()
const route = useRoute()

const sidebarOpen = ref(false)

const navItems = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { to: '/admin/prescripteurs', label: 'Prescripteurs', icon: Users, exact: false },
  { to: '/admin/inscriptions', label: 'Inscriptions', icon: ClipboardList, exact: false },
]

function isNavActive(to: string, exact: boolean) {
  if (exact) return route.path === to
  return route.path.startsWith(to)
}

async function handleLogout() {
  await logout()
  navigateTo('/connexion')
}
</script>

<template>
  <div class="min-h-screen flex bg-prado-bg">
    <Toaster position="top-right" rich-colors />

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-prado-surface',
        'border-r border-prado-border flex flex-col',
        'transform transition-transform duration-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <div class="h-16 flex items-center px-6 border-b border-prado-border">
        <span class="text-prado-text font-semibold tracking-wide text-sm">
          Administration Prado
        </span>
      </div>

      <nav class="flex-1 py-4 px-3 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
            isNavActive(item.to, item.exact)
              ? 'bg-[#CF006C] text-white'
              : 'text-prado-text-secondary hover:text-prado-text hover:bg-prado-surface-hover',
          ]"
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-prado-border">
        <button
          class="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-prado-text-muted hover:text-red-400 hover:bg-prado-surface-hover transition-colors"
          @click="handleLogout"
        >
          <LogOut :size="18" />
          <span>Deconnexion</span>
        </button>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top bar -->
      <header class="h-16 flex items-center justify-between px-6 border-b border-prado-border bg-prado-surface">
        <button
          class="lg:hidden p-2 rounded-lg text-prado-text hover:bg-prado-surface-hover"
          @click="sidebarOpen = !sidebarOpen"
        >
          <X v-if="sidebarOpen" :size="20" />
          <Menu v-else :size="20" />
        </button>

        <div class="hidden lg:block text-sm text-prado-text-secondary">
          Administration Prado
        </div>

        <div class="flex items-center gap-4">
          <span class="text-sm text-prado-text">{{ user?.name }}</span>
          <button
            class="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-prado-text-muted hover:text-red-400 border border-prado-border hover:border-red-400/30 transition-colors"
            @click="handleLogout"
          >
            <LogOut :size="14" />
            Quitter
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
