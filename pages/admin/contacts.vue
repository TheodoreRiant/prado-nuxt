<script setup lang="ts">
import { Loader2, Mail, CheckCircle, Circle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

definePageMeta({ middleware: ['auth', 'admin'] })

interface ContactMessage {
  id: string; created_at: string; name: string; email: string;
  subject: string; message: string; is_read: boolean;
}

const contacts = ref<ContactMessage[]>([])
const loading = ref(true)
const expandedId = ref<string | null>(null)

onMounted(async () => {
  try {
    contacts.value = await $fetch<ContactMessage[]>('/api/admin/contacts')
  } catch { toast.error('Erreur chargement contacts') }
  finally { loading.value = false }
})

async function toggleRead(msg: ContactMessage) {
  try {
    await $fetch('/api/admin/contacts', { method: 'PATCH', body: { id: msg.id, is_read: !msg.is_read } })
    msg.is_read = !msg.is_read
  } catch { toast.error('Erreur') }
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-10 space-y-6">
    <h1 class="text-xl font-semibold text-prado-text">Messages de contact</h1>

    <div v-if="loading" class="flex justify-center py-20">
      <Loader2 class="animate-spin text-prado-text-muted" :size="32" />
    </div>

    <div v-else class="bg-prado-surface rounded-2xl border border-prado-border overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-prado-border text-prado-text-secondary">
            <th class="text-left px-4 py-3 font-medium w-10" />
            <th class="text-left px-4 py-3 font-medium">Date</th>
            <th class="text-left px-4 py-3 font-medium">Auteur</th>
            <th class="text-left px-4 py-3 font-medium">Sujet</th>
            <th class="text-left px-4 py-3 font-medium w-20" />
          </tr>
        </thead>
        <tbody>
          <template v-for="msg in contacts" :key="msg.id">
            <tr
              class="border-b border-prado-border last:border-0 hover:bg-prado-surface-hover cursor-pointer"
              :class="{ 'font-medium': !msg.is_read }"
              @click="expandedId = expandedId === msg.id ? null : msg.id"
            >
              <td class="px-4 py-3"><div class="w-2 h-2 rounded-full" :class="msg.is_read ? 'bg-transparent' : 'bg-[#CF006C]'" /></td>
              <td class="px-4 py-3 text-prado-text-muted">{{ new Date(msg.created_at).toLocaleDateString('fr-FR') }}</td>
              <td class="px-4 py-3 text-prado-text">{{ msg.name }} <br><span class="text-xs text-prado-text-faint">{{ msg.email }}</span></td>
              <td class="px-4 py-3 text-prado-text">{{ msg.subject }}</td>
              <td class="px-4 py-3">
                <button @click.stop="toggleRead(msg)" class="p-2 hover:text-[#93C1AF]">
                  <CheckCircle v-if="msg.is_read" :size="18" class="text-[#93C1AF]" />
                  <Circle v-else :size="18" class="text-prado-text-muted" />
                </button>
              </td>
            </tr>
            <tr v-if="expandedId === msg.id" class="bg-prado-bg-deep/30 border-b border-prado-border">
              <td colspan="5" class="px-6 py-4">
                <div class="p-4 rounded-xl bg-prado-surface border border-prado-border text-prado-text text-sm whitespace-pre-wrap">{{ msg.message }}</div>
                <a :href="`mailto:${msg.email}`" class="inline-flex items-center gap-2 mt-3 text-xs text-[#FB6223] hover:underline"><Mail :size="12" /> Répondre</a>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
