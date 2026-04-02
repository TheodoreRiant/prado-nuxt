<script setup lang="ts">
import { ref } from 'vue'

// Form state
const inputValue = ref('')
const textareaValue = ref('Contenu initial du textarea.')
const selectValue = ref('')
const checkboxValue = ref(false)
const radioValue = ref('option1')
const switchValue = ref(true)
const phoneValue = ref('')
const dateValue = ref('')
const tagsValue = ref(['Sport', 'Culture', 'Nature'])
const multiSelectValue = ref<string[]>(['web'])

// Navigation state
const activeTab = ref('general')
const currentPage = ref(1)

// Dialog state
const dialogOpen = ref(false)
const destructiveDialogOpen = ref(false)

// Progress
const progressValue = ref(65)

function removeTag(index: number) {
  tagsValue.value = tagsValue.value.filter((_, i) => i !== index)
}

const selectOptions = [
  { value: 'lyon', label: 'Lyon' },
  { value: 'paris', label: 'Paris' },
  { value: 'marseille', label: 'Marseille' },
]

const radioOptions = [
  { value: 'option1', label: 'Option A', description: 'Description de la premiere option' },
  { value: 'option2', label: 'Option B', description: 'Description de la deuxieme option' },
  { value: 'option3', label: 'Option C' },
]

const multiSelectOptions = [
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'iot', label: 'IoT' },
] as const

const tabItems = [
  { value: 'general', label: 'General' },
  { value: 'securite', label: 'Securite' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'avance', label: 'Avance', disabled: true },
]

const breadcrumbItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Actions', to: '/actions' },
  { label: 'Foodtruck' },
]

const tableColumns = [
  { key: 'nom', label: 'Nom', sortable: true },
  { key: 'email', label: 'Email', sortable: true, hiddenBelow: 'md' as const },
  { key: 'role', label: 'Role' },
  { key: 'statut', label: 'Statut' },
]

const tableRows = [
  { nom: 'Jean Dupont', email: 'jean@example.fr', role: 'Admin', statut: 'Actif' },
  { nom: 'Marie Martin', email: 'marie@example.fr', role: 'Editeur', statut: 'Actif' },
  { nom: 'Pierre Durand', email: 'pierre@example.fr', role: 'Lecteur', statut: 'Inactif' },
  { nom: 'Sophie Bernard', email: 'sophie@example.fr', role: 'Admin', statut: 'Actif' },
  { nom: 'Luc Petit', email: 'luc@example.fr', role: 'Editeur', statut: 'Actif' },
]

const dropdownItems = [
  { label: 'Modifier', value: 'edit' },
  { label: 'Dupliquer', value: 'duplicate' },
  { label: '', value: '', separator: true },
  { label: 'Supprimer', value: 'delete' },
]
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
        <PrTag v-for="(tag, i) in tagsValue" :key="tag" removable @remove="removeTag(i)">
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

    <!-- Textarea -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Textarea</h2>
      <div style="max-width: 400px; display: flex; flex-direction: column; gap: 1rem;">
        <PrTextarea
          v-model="textareaValue"
          label="Description"
          placeholder="Decrivez votre action..."
          help="255 caracteres maximum"
          :rows="4"
        />
        <PrTextarea
          model-value=""
          label="Avec erreur"
          error="La description est obligatoire"
          required
        />
      </div>
    </section>

    <!-- Select -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Select</h2>
      <div style="max-width: 400px;">
        <PrSelect
          v-model="selectValue"
          label="Ville"
          :options="selectOptions"
          placeholder="Choisir une ville..."
          help="Selectionnez votre ville de rattachement"
        />
      </div>
    </section>

    <!-- Checkbox -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Checkbox</h2>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <PrCheckbox
          v-model="checkboxValue"
          label="J'accepte les conditions"
          description="En cochant cette case, vous acceptez nos CGU."
        />
        <PrCheckbox
          :model-value="true"
          label="Toujours coche"
          disabled
        />
      </div>
    </section>

    <!-- Radio -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Radio</h2>
      <PrRadio
        v-model="radioValue"
        :options="radioOptions"
        name="demo-radio"
      />
    </section>

    <!-- Switch -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Switch</h2>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <PrSwitch
          v-model="switchValue"
          label="Notifications"
          description="Recevez des notifications par email"
        />
        <PrSwitch
          :model-value="false"
          label="Mode sombre"
          disabled
        />
      </div>
    </section>

    <!-- FormField -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">FormField wrapper</h2>
      <div style="max-width: 400px;">
        <PrFormField label="Champ custom" help="Ce wrapper ajoute label + help/error autour d'un slot" required>
          <input
            type="text"
            placeholder="N'importe quel input..."
            style="width: 100%; padding: 0.5rem; border-radius: 0.75rem; border: 1px solid var(--prado-border); background: var(--prado-input-bg); color: var(--prado-text); font-size: 0.875rem;"
          />
        </PrFormField>
      </div>
    </section>

    <!-- Phone Input -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Phone Input</h2>
      <div style="max-width: 400px;">
        <PrPhoneInput
          v-model="phoneValue"
          label="Telephone"
          help="Format: 06 12 34 56 78"
        />
      </div>
    </section>

    <!-- Date Picker -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Date Picker</h2>
      <div style="max-width: 400px;">
        <PrDatePicker
          v-model="dateValue"
          label="Date de naissance"
          help="Selectionnez votre date de naissance"
        />
      </div>
    </section>

    <!-- TagInput -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Tag Input</h2>
      <div style="max-width: 400px;">
        <PrTagInput
          v-model="tagsValue"
          :suggestions="['Sport', 'Culture', 'Nature', 'Cuisine', 'Musique', 'Art']"
          placeholder="Ajouter un tag..."
        />
      </div>
    </section>

    <!-- MultiSelect -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Multi Select</h2>
      <PrMultiSelect
        v-model="multiSelectValue"
        :options="multiSelectOptions"
        label="Plateformes"
      />
    </section>

    <!-- Alerts -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Alerts</h2>
      <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 500px;">
        <PrAlert variant="info" title="Information">
          Votre inscription est en cours de validation.
        </PrAlert>
        <PrAlert variant="success" title="Succes">
          L'action a ete ajoutee avec succes.
        </PrAlert>
        <PrAlert variant="warning" title="Attention" closable>
          Certaines informations sont incompletes.
        </PrAlert>
        <PrAlert variant="error" title="Erreur">
          Impossible de sauvegarder les modifications.
        </PrAlert>
      </div>
    </section>

    <!-- Skeleton -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Skeleton</h2>
      <div style="display: flex; gap: 1.5rem; align-items: flex-start;">
        <PrSkeleton variant="circle" width="3rem" height="3rem" />
        <PrSkeleton variant="rect" width="200px" height="1.5rem" />
        <div style="flex: 1; max-width: 300px;">
          <PrSkeleton variant="text" :lines="3" />
        </div>
      </div>
    </section>

    <!-- Progress -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Progress</h2>
      <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 400px;">
        <PrProgress :value="progressValue" size="sm" />
        <PrProgress :value="progressValue" size="md" />
        <PrProgress :value="100" size="lg" variant="success" />
        <PrProgress indeterminate size="md" />
      </div>
    </section>

    <!-- EmptyState -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Empty State</h2>
      <div style="max-width: 400px; border: 1px solid var(--prado-border); border-radius: 1rem;">
        <PrEmptyState
          title="Aucune action"
          description="Vous n'avez pas encore cree d'action. Commencez maintenant !"
          cta-label="Creer une action"
          cta-to="/actions/new"
        />
      </div>
    </section>

    <!-- Dialog -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Dialog</h2>
      <div style="display: flex; gap: 0.75rem;">
        <PrButton variant="outline" @click="dialogOpen = true">Ouvrir dialog</PrButton>
        <PrButton variant="destructive" @click="destructiveDialogOpen = true">Dialog destructif</PrButton>
      </div>
      <PrDialog
        v-model:open="dialogOpen"
        title="Confirmer l'action"
        description="Etes-vous sur de vouloir poursuivre cette action ?"
      />
      <PrDialog
        v-model:open="destructiveDialogOpen"
        title="Supprimer cet element"
        description="Cette action est irreversible. L'element sera definitivement supprime."
        variant="destructive"
        confirm-label="Supprimer"
      />
    </section>

    <!-- Tabs -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Tabs</h2>
      <div style="max-width: 500px;">
        <PrTabs v-model="activeTab" :items="tabItems">
          <template #tab-general>
            <p style="font-size: 0.875rem; color: var(--prado-text-secondary);">
              Contenu de l'onglet General avec parametres principaux.
            </p>
          </template>
          <template #tab-securite>
            <p style="font-size: 0.875rem; color: var(--prado-text-secondary);">
              Contenu de l'onglet Securite pour gerer mot de passe et 2FA.
            </p>
          </template>
          <template #tab-notifications>
            <p style="font-size: 0.875rem; color: var(--prado-text-secondary);">
              Contenu de l'onglet Notifications.
            </p>
          </template>
        </PrTabs>
      </div>
    </section>

    <!-- Accordion -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Accordion</h2>
      <div style="max-width: 500px;">
        <PrAccordion>
          <PrAccordionItem title="C'est pour qui ?" default-open>
            Les actions s'adressent aux jeunes de 11 a 25 ans beneficiant d'un accompagnement educatif.
          </PrAccordionItem>
          <PrAccordionItem title="C'est gratuit ?">
            Oui, entierement. Toutes les actions sont 100% gratuites.
          </PrAccordionItem>
          <PrAccordionItem title="Comment participer ?">
            Vous pouvez orienter des jeunes vers nos actions en creant un compte prescripteur.
          </PrAccordionItem>
        </PrAccordion>
      </div>
    </section>

    <!-- Breadcrumb -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Breadcrumb</h2>
      <PrBreadcrumb :items="breadcrumbItems" />
    </section>

    <!-- Pagination -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Pagination</h2>
      <div style="max-width: 500px;">
        <PrPagination v-model="currentPage" :total="150" :page-size="10" />
      </div>
    </section>

    <!-- Tooltip -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Tooltip</h2>
      <div style="display: flex; gap: 1.5rem; align-items: center;">
        <PrTooltip content="Info en haut" position="top">
          <PrButton variant="outline" size="sm">Top</PrButton>
        </PrTooltip>
        <PrTooltip content="Info en bas" position="bottom">
          <PrButton variant="outline" size="sm">Bottom</PrButton>
        </PrTooltip>
        <PrTooltip content="Info a gauche" position="left">
          <PrButton variant="outline" size="sm">Left</PrButton>
        </PrTooltip>
        <PrTooltip content="Info a droite" position="right">
          <PrButton variant="outline" size="sm">Right</PrButton>
        </PrTooltip>
      </div>
    </section>

    <!-- Dropdown -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Dropdown</h2>
      <PrDropdown :items="dropdownItems">
        <template #trigger>
          <PrButton variant="outline" size="sm">Actions</PrButton>
        </template>
      </PrDropdown>
    </section>

    <!-- Table -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Table</h2>
      <PrTable
        :columns="tableColumns"
        :rows="tableRows"
        :page-size="3"
        search-placeholder="Rechercher un utilisateur..."
      >
        <template #cell-statut="{ value }">
          <PrBadge :variant="value === 'Actif' ? 'success' : 'warning'" size="sm">
            {{ value }}
          </PrBadge>
        </template>
        <template #actions="{ row }">
          <PrButton variant="ghost" size="sm">Voir</PrButton>
        </template>
      </PrTable>
    </section>

    <!-- StatCard -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Stat Card</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem; max-width: 600px;">
        <PrStatCard :value="89" label="Actions programmees" animated />
        <PrStatCard :value="500" suffix="+" label="Jeunes accompagnes" animated />
        <PrStatCard :value="50" suffix="+" label="Structures partenaires" animated />
      </div>
    </section>

    <!-- ImageWithFallback -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Image With Fallback</h2>
      <div style="display: flex; gap: 1rem; align-items: center;">
        <PrImageWithFallback
          src="https://i.pravatar.cc/100?u=test"
          alt="Photo valide"
          class="w-24 h-24 rounded-xl object-cover"
        />
        <PrImageWithFallback
          src="https://broken-url.invalid/image.jpg"
          alt="Image cassee"
          class="w-24 h-24 rounded-xl object-cover"
        />
      </div>
    </section>

    <!-- DocumentDownload -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Document Download</h2>
      <div style="max-width: 500px;">
        <PrDocumentDownload
          title="Guide du prescripteur"
          description="Tout ce qu'il faut savoir pour orienter un jeune vers nos actions."
          category="Guide"
          file-url="#"
          file-size="2.4 Mo"
        />
      </div>
    </section>

    <!-- Newsletter Form -->
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Newsletter Form</h2>
      <div style="max-width: 400px;">
        <PrNewsletterForm show-structure />
      </div>
    </section>
  </div>
</template>
