<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref('')
const tags = ref(['Sport', 'Culture', 'Nature'])

function removeTag(index: number) {
  tags.value = tags.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div style="padding: 2rem; font-family: 'Poppins', sans-serif; background: var(--prado-bg); color: var(--prado-text); min-height: 100vh;">
    <h1 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 2rem;">
      Prado UI - Playground
    </h1>

    <!-- Buttons -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Buttons</h2>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <PrButton variant="primary">Primary</PrButton>
        <PrButton variant="secondary">Secondary</PrButton>
        <PrButton variant="outline">Outline</PrButton>
        <PrButton variant="ghost">Ghost</PrButton>
        <PrButton variant="destructive">Destructive</PrButton>
        <PrButton variant="primary" loading>Loading</PrButton>
        <PrButton variant="primary" disabled>Disabled</PrButton>
        <PrButton variant="primary" size="sm">Small</PrButton>
        <PrButton variant="primary" size="lg">Large</PrButton>
        <PrButton variant="primary" to="/somewhere">Link</PrButton>
      </div>
    </section>

    <!-- Badges -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Badges</h2>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
        <PrBadge>Default</PrBadge>
        <PrBadge variant="success">Success</PrBadge>
        <PrBadge variant="warning">Warning</PrBadge>
        <PrBadge variant="error">Error</PrBadge>
        <PrBadge variant="info">Info</PrBadge>
        <PrBadge variant="success" size="sm">Small</PrBadge>
      </div>
    </section>

    <!-- Tags -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Tags</h2>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
        <PrTag v-for="(tag, i) in tags" :key="tag" removable @remove="removeTag(i)">
          {{ tag }}
        </PrTag>
        <PrTag color="#FB6223">Custom Color</PrTag>
      </div>
    </section>

    <!-- Avatars -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Avatars</h2>
      <div style="display: flex; gap: 0.75rem; align-items: center;">
        <PrAvatar size="sm" fallback="AB" />
        <PrAvatar size="md" fallback="CD" />
        <PrAvatar size="lg" fallback="EF" />
        <PrAvatar size="xl" fallback="GH" />
        <PrAvatar size="lg" src="https://i.pravatar.cc/150?u=demo" alt="Demo user" fallback="DU" />
      </div>
    </section>

    <!-- Card -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Card</h2>
      <div style="max-width: 400px;">
        <PrCard hoverable>
          <PrCardHeader>
            <h3 style="font-size: 1rem; font-weight: 600;">Titre de la carte</h3>
            <template #actions>
              <PrBadge variant="success">Actif</PrBadge>
            </template>
          </PrCardHeader>
          <PrCardContent>
            <p style="font-size: 0.875rem; color: var(--prado-text-secondary);">
              Contenu de la carte avec des informations utiles pour le jeune.
            </p>
          </PrCardContent>
          <PrCardFooter>
            <PrButton variant="ghost" size="sm">Annuler</PrButton>
            <PrButton variant="primary" size="sm">Confirmer</PrButton>
          </PrCardFooter>
        </PrCard>
      </div>
    </section>

    <!-- Divider -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Divider</h2>
      <PrDivider />
      <div style="height: 0.75rem;" />
      <PrDivider label="ou" />
    </section>

    <!-- Input -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Input</h2>
      <div style="max-width: 400px; display: flex; flex-direction: column; gap: 1rem;">
        <PrInput
          v-model="inputValue"
          label="Nom complet"
          placeholder="Jean Dupont"
          help="Entrez votre nom et prenom"
          required
        />
        <PrInput
          model-value=""
          label="Email"
          type="email"
          placeholder="jean@exemple.fr"
          error="Ce champ est obligatoire"
          required
        />
        <PrInput
          model-value=""
          label="Champ desactive"
          placeholder="Non modifiable"
          disabled
        />
      </div>
    </section>
  </div>
</template>
