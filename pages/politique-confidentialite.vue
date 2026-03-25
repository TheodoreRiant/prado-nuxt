<script setup lang="ts">
useHead({ title: 'Politique de confidentialité | Prado Itinéraires' })
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-20 text-prado-text">
    <h1 class="text-3xl font-bold mb-10 text-[#CF006C]" :style="{ fontFamily: 'Poppins' }">Politique de Confidentialité</h1>
    <div class="space-y-8 text-sm leading-relaxed text-prado-text-muted">
      <section>
        <h2 class="text-lg text-prado-text font-medium mb-2">1. Collecte des données</h2>
        <p>Nous collectons les données suivantes :</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>Informations d'inscription (nom, email, structure) via nos formulaires.</li>
          <li>Données de navigation via des cookies analytiques (Microsoft Clarity).</li>
          <li>Messages envoyés via le formulaire de contact.</li>
        </ul>
      </section>
      <section>
        <h2 class="text-lg text-prado-text font-medium mb-2">2. Utilisation des données</h2>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>Gérer vos inscriptions aux actions et programmes.</li>
          <li>Vous envoyer notre newsletter (si vous y avez consenti).</li>
          <li>Répondre à vos demandes de contact.</li>
          <li>Améliorer l'expérience utilisateur sur notre site.</li>
        </ul>
      </section>
      <section>
        <h2 class="text-lg text-prado-text font-medium mb-2">3. Conservation des données</h2>
        <p>Vos données personnelles sont conservées le temps nécessaire à l'accomplissement de l'objectif poursuivi, dans le respect du RGPD.</p>
      </section>
      <section>
        <h2 class="text-lg text-prado-text font-medium mb-2">4. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité. Contact : <a href="mailto:itineraires@le-prado.fr" class="text-[#FB6223] underline">itineraires@le-prado.fr</a>.</p>
      </section>
      <section>
        <h2 class="text-lg text-prado-text font-medium mb-2">5. Cookies et Tiers</h2>
        <p>Nous utilisons <strong>Supabase</strong> (données), <strong>Prismic</strong> (contenu) et <strong>Microsoft Clarity</strong> (analytics). Vous pouvez gérer vos préférences de cookies via le bandeau dédié.</p>
      </section>
    </div>
  </div>
</template>
