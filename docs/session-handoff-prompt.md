# Prompt de reprise — Refonte Homepage Prado Itinéraires

Copie-colle ce prompt dans ta nouvelle session Claude Code.

---

## Contexte du projet

Je travaille sur le projet **Prado Itinéraires** — un site Nuxt 3 + Prismic + Supabase pour une association qui accompagne les jeunes de 11-25 ans vers l'autonomie à Lyon.

**Repos :**
- Nuxt (actif) : `/Users/theodoreriant/Documents/04_Projets/01_Actifs/prado-nuxt` — https://github.com/TheodoreRiant/prado-nuxt
- React (ancien) : `/Users/theodoreriant/Documents/04_Projets/01_Actifs/prado-nextjs` — https://github.com/TheodoreRiant/Pradoitineraires

**Stack Nuxt :**
- Nuxt 3 + Vue 3 Composition API (`<script setup lang="ts">`)
- Tailwind CSS 4 avec design tokens Prado (theme.css : dark/light, prado-surface, prado-text, prado-border, etc.)
- @nuxtjs/prismic pour le contenu (actions, ressources)
- @nuxtjs/supabase pour l'auth (prescripteurs, jeunes, inscriptions)
- lucide-vue-next pour les icônes
- vue-sonner pour les toasts
- Déployé sur Vercel : https://prado-nuxt.vercel.app

**Prismic :** Repo `prado-nuxt` avec 142 actions + 187 ressources publiées. Dashboard : https://prado-nuxt.prismic.io

**Supabase :** Projet `vafbtwbsxdlefksonpyg`. Tables : prescripteurs, jeunes, inscriptions, actions, ressources.

---

## Ce qui a été fait dans la session précédente

1. Projet React déployé sur Vercel avec Supabase Auth, admin complet
2. Migration complète React → Nuxt 3 (16 pages/layouts portées)
3. Prismic intégré : 142 actions + 187 ressources avec contenu détaillé scrapé du site Prado original
4. Images locales dans public/images/ (94 actions + 183 ressources)
5. Synchronisation complète avec le site Prado (itineraires.le-prado.fr)
6. Descriptions enrichies (rich text multi-paragraphes) dans Prismic
7. Admin : dashboard, prescripteurs, inscriptions

---

## Tâche en cours : Refonte de la page d'accueil

On intègre un nouveau contenu pour la homepage. La spec complète est dans `docs/homepage-content-spec.md`.

**Méthode de contenu :** Hybride JTBD + Social Proof + They Ask You Answer
**Cible :** Tous publics (professionnels, familles, partenaires, donateurs)

### Structure des 10 sections

1. **HERO** — ScrollExpandHero (composant existant `UiScrollExpandHero`) avec nouveau contenu
2. **LES 4 PROGRAMMES** — À choisir : Bento Grid, Cards avec tabs, Accordion, ou Full-width stacked
3. **NOS MISSIONS** — À choisir : Two-column split, Timeline, ou Cards avec icônes
4. **CHIFFRES D'IMPACT** — À choisir : Counter band gradient, Floating stat cards, ou Circular progress
5. **COMMENT ÇA MARCHE** — À choisir : Stepper horizontal, Animated SVG path, ou Vertical timeline
6. **TÉMOIGNAGES** — À choisir : Carousel, Masonry, ou Quote spotlight
7. **FAQ** — À choisir : Accordion, Two-column, ou Cards grid
8. **PARTENAIRES** — À choisir : Infinite scroll band, Static grid, ou Logo cloud
9. **EN SAVOIR PLUS** — 4 cards horizontales
10. **CTA FINAL** — Full-width gradient band

### Approche validée

On fait **section par section** :
1. Proposer les types de section (options visuelles)
2. L'utilisateur choisit
3. Implémenter
4. Vérifier dans le navigateur
5. Valider et passer à la suivante

### Section 1 déjà choisie : ScrollExpandHero (option A)

Le composant `UiScrollExpandHero` existe déjà. Il faut mettre à jour le contenu dans `pages/index.vue` avec :
- Sur-titre : "Association de la Fondation du Prado — Lyon Métropole"
- H1 : "L'innovation sociale au service des jeunes et des familles"
- Texte descriptif (voir spec)
- CTA principal : "Découvrir nos actions" → /actions
- CTA secondaire : "Inscrire un jeune" → /connexion?mode=register

---

## Fichiers clés

- `pages/index.vue` — Homepage actuelle (à réécrire section par section)
- `docs/homepage-content-spec.md` — Spec complète du contenu
- `layouts/default.vue` — Layout avec header/footer
- `composables/useAuth.ts` — Auth composable
- `composables/useImages.ts` — Images locales
- `constants/categories.ts` — Catégories et couleurs
- `assets/css/theme.css` — Design tokens Prado
- `assets/css/tailwind.css` — Tailwind config

## Commandes utiles

```bash
cd /Users/theodoreriant/Documents/04_Projets/01_Actifs/prado-nuxt
npm run dev          # Dev server port 3000
npm run build        # Build prod
vercel deploy --prod # Deploy
```

## Commits

Faire un commit après chaque section validée. Format : `feat: homepage section X — [nom de la section]`

---

Commence par lire `docs/homepage-content-spec.md` et `pages/index.vue`, puis implémente la Section 1 (Hero) avec le ScrollExpandHero et le nouveau contenu.
