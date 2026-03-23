<script setup lang="ts">
import { Send, Heart, Mail, Facebook, Instagram, Linkedin, Youtube } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const form = ref({ name: '', email: '', subject: '', message: '' })
const newsletter = ref('')

const socialIcons = [Facebook, Instagram, Linkedin, Youtube]

const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-prado-surface border border-prado-border text-prado-text placeholder:text-prado-text-faint focus:outline-none focus:border-prado-border-medium'

function handleSubmit() {
  toast.success('Message envoye ! Nous vous repondrons sous 48h.')
  form.value = { name: '', email: '', subject: '', message: '' }
}

function handleNewsletter() {
  toast.success('Inscription a la newsletter confirmee !')
  newsletter.value = ''
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-14">
    <div class="mb-12">
      <p class="text-[#FB6223] text-sm mb-2 tracking-wide">Nous ecrire</p>
      <h1 class="text-4xl text-prado-text italic mb-3" :style="{ fontFamily: 'Poppins' }">Contact</h1>
      <p class="text-prado-text-muted max-w-lg">Une question, une demande de partenariat ? N'hesitez pas.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div class="lg:col-span-2">
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-prado-text-secondary mb-1.5 block">Nom complet</label>
              <input v-model="form.name" required :class="inputClass" placeholder="Votre nom" />
            </div>
            <div>
              <label class="text-sm text-prado-text-secondary mb-1.5 block">Email</label>
              <input v-model="form.email" type="email" required :class="inputClass" placeholder="votre@email.fr" />
            </div>
          </div>
          <div>
            <label class="text-sm text-prado-text-secondary mb-1.5 block">Sujet</label>
            <input v-model="form.subject" required :class="inputClass" placeholder="Objet" />
          </div>
          <div>
            <label class="text-sm text-prado-text-secondary mb-1.5 block">Message</label>
            <textarea
              v-model="form.message"
              required
              :rows="5"
              class="w-full px-4 py-2.5 rounded-xl bg-prado-surface border border-prado-border text-prado-text placeholder:text-prado-text-faint resize-none focus:outline-none focus:border-prado-border-medium"
              placeholder="Votre message..."
            />
          </div>
          <button type="submit" class="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] transition-colors">
            <Send :size="15" /> Envoyer
          </button>
        </form>
      </div>

      <div class="space-y-5">
        <div class="bg-prado-surface rounded-2xl p-6 border border-prado-border">
          <h3 class="text-prado-text mb-3 flex items-center gap-2"><Mail :size="16" class="text-[#FB6223]" /> Newsletter</h3>
          <p class="text-sm text-prado-text-muted mb-3">Recevez nos actualites.</p>
          <form class="flex gap-2" @submit.prevent="handleNewsletter">
            <input
              v-model="newsletter"
              type="email"
              required
              class="flex-1 px-3 py-2 rounded-full bg-prado-input-bg border border-prado-border text-prado-text text-sm placeholder:text-prado-text-faint focus:outline-none"
              placeholder="votre@email.fr"
            />
            <button type="submit" class="px-4 py-2 rounded-full bg-[#FB6223] text-white text-sm hover:bg-[#e5571f]">OK</button>
          </form>
        </div>

        <div class="bg-prado-surface rounded-2xl p-6 border border-prado-border">
          <h3 class="text-prado-text mb-3">S'engager</h3>
          <div class="space-y-2">
            <a href="#" class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#93C1AF] text-white text-sm hover:bg-[#7dab98] transition-colors w-full">
              <Heart :size="14" /> Devenir benevole
            </a>
            <a href="#" class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FB6223] text-white text-sm hover:bg-[#e5571f] transition-colors w-full">
              <Heart :size="14" /> Faire un don
            </a>
          </div>
        </div>

        <div class="bg-prado-surface rounded-2xl p-6 border border-prado-border">
          <h3 class="text-prado-text mb-3">Reseaux sociaux</h3>
          <div class="flex gap-2">
            <a
              v-for="(Icon, i) in socialIcons"
              :key="i"
              href="#"
              class="w-10 h-10 rounded-full bg-prado-tag-bg text-prado-text-muted flex items-center justify-center hover:bg-[#CF006C] hover:text-white transition-colors"
            >
              <component :is="Icon" :size="16" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
