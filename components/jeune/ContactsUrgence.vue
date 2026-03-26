<script setup lang="ts">
import { Plus, Trash2 } from 'lucide-vue-next'
import type { ContactUrgence } from '~/lib/types/sante'
import { LIENS_CONTACT } from '~/lib/types/sante'

const contacts = defineModel<ContactUrgence[]>({ required: true })

function addContact() {
  contacts.value = [...contacts.value, { nom: '', telephone: '', lien: '' }]
}

function removeContact(index: number) {
  contacts.value = contacts.value.filter((_, i) => i !== index)
}

function updateContact(index: number, field: keyof ContactUrgence, value: string) {
  contacts.value = contacts.value.map((c, i) =>
    i === index ? { ...c, [field]: value } : c,
  )
}

const inputClass = 'w-full px-3 py-2 rounded-lg bg-prado-input-bg border border-prado-border text-prado-text text-sm focus:outline-none focus:border-prado-border-medium'
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="(contact, index) in contacts"
      :key="index"
      class="bg-prado-bg rounded-xl p-3 space-y-2"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-prado-text-muted">Contact {{ index + 1 }}</span>
        <button
          class="p-1 rounded-lg hover:bg-red-500/10 text-prado-text-faint hover:text-red-400 transition-colors"
          @click="removeContact(index)"
        >
          <Trash2 :size="13" />
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          :value="contact.nom"
          :class="inputClass"
          placeholder="Nom"
          @input="updateContact(index, 'nom', ($event.target as HTMLInputElement).value)"
        />
        <input
          :value="contact.telephone"
          :class="inputClass"
          placeholder="Telephone"
          type="tel"
          @input="updateContact(index, 'telephone', ($event.target as HTMLInputElement).value)"
        />
        <select
          :value="contact.lien"
          :class="inputClass"
          @change="updateContact(index, 'lien', ($event.target as HTMLSelectElement).value)"
        >
          <option value="" disabled>Lien</option>
          <option v-for="l in LIENS_CONTACT" :key="l.value" :value="l.value">{{ l.label }}</option>
        </select>
      </div>
    </div>

    <button
      class="inline-flex items-center gap-1.5 text-xs text-[#004657] hover:underline"
      @click="addContact"
    >
      <Plus :size="12" /> Ajouter un contact d'urgence
    </button>
  </div>
</template>
