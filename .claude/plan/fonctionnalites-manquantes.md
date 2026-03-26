# Fonctionnalites manquantes et opportunites

> Analyse exhaustive des fonctionnalites non implementees ou non prevues,
> classees par pertinence pour une plateforme socio-educative (prescripteurs + jeunes + admin).

---

## PRIORITE HAUTE — Forte valeur metier

### 1. Suivi des presences

**Probleme :** Aujourd'hui, on inscrit un jeune a une action, mais on ne sait pas s'il y a reellement participe.

**Perimetre :**
- Table `presences` (inscription_id, present/absent/excuse, date, note)
- Interface prescripteur : cocher les presences apres chaque session
- Interface admin : vue consolidee du taux de participation
- Statistiques : taux de presence par action, par prescripteur, par jeune
- Export CSV des presences

**Charge estimee :** 3 j

---

### 2. Evaluations / questionnaires post-action

**Probleme :** Aucun retour structure sur la qualite des actions. Indispensable pour le reporting aux financeurs.

**Perimetre :**
- Formulaires d'evaluation configurables par action (satisfaction, acquis, remarques)
- Evaluation par le prescripteur (qualite de l'action)
- Evaluation par le jeune (si applicable, formulaire simplifie)
- Synthese des evaluations dans le panel admin
- Export pour les rapports d'activite

**Charge estimee :** 4 j

---

### 3. Liste d'attente

**Probleme :** Quand une action est complete, le prescripteur ne peut rien faire. Pas de visibilite sur la demande reelle.

**Perimetre :**
- Bouton "Rejoindre la liste d'attente" quand places_max atteint
- Notification automatique quand une place se libere
- Gestion de la file dans le panel admin (ordre, priorite)
- Statistiques sur les actions les plus demandees

**Charge estimee :** 2 j

---

### 4. Generation de documents (attestations, bilans)

**Probleme :** Pas de trace formelle de participation. Necessaire pour les parcours d'insertion.

**Perimetre :**
- Generation PDF d'attestation de participation (par jeune, par action)
- Bilan individuel du jeune (historique des actions suivies, presences, evaluations)
- Bilan global par action (participants, presences, evaluations)
- Templates personnalisables avec logo Prado

**Charge estimee :** 3 j

---

### 5. Historique / timeline par jeune

**Probleme :** Pas de vision longitudinale du parcours d'un jeune dans le dispositif.

**Perimetre :**
- Timeline visuelle : inscriptions, participations, evaluations, documents
- Vue prescripteur : suivi de ses jeunes
- Vue admin : parcours complet tous prescripteurs confondus
- Indicateurs de progression (nombre d'actions suivies, assiduite)

**Charge estimee :** 2 j

---

## PRIORITE MOYENNE — Amelioration de l'experience

### 6. Vue calendrier des actions

**Probleme :** Les actions sont presentees en liste/grille. Pas de vision temporelle.

**Perimetre :**
- Composant calendrier (mois/semaine) sur la page actions
- Filtrage par categorie, lieu, disponibilite
- Vue calendrier dans l'espace prescripteur (mes inscriptions)
- Vue calendrier admin (toutes les actions)

**Charge estimee :** 2.5 j

---

### 7. Cartographie interactive

**Probleme :** L'endpoint `/api/actions/map` existe mais ne retourne pas de donnees geo. Pas de carte.

**Perimetre :**
- Integration Leaflet ou Mapbox
- Carte interactive sur la page actions (markers par lieu)
- Popup avec resume de l'action + lien vers le detail
- Filtre geographique (rayon autour d'une adresse)
- Geocodage des adresses des actions

**Charge estimee :** 2.5 j

---

### 8. Notifications in-app

**Probleme :** Seuls les emails informent les utilisateurs. Pas de centre de notifications.

**Perimetre :**
- Centre de notifications (cloche dans le header)
- Notifications temps reel : inscription validee, action modifiee, rappel, nouveau message admin
- Marquage lu/non-lu
- Preferences de notification (email vs in-app vs les deux)
- Badge de compteur sur l'icone

**Charge estimee :** 3 j

---

### 9. Messagerie interne (admin <-> prescripteur)

**Probleme :** Aucun canal de communication dans la plateforme. Tout passe par email externe.

**Perimetre :**
- Boite de reception dans l'espace prescripteur
- Interface d'envoi dans le panel admin (individuel ou groupe)
- Historique des echanges
- Notification email a la reception d'un message
- Pieces jointes (optionnel)

**Charge estimee :** 4 j

---

### 10. Import CSV en masse

**Probleme :** L'export CSV fonctionne partout, mais aucun import. Chronophage pour les prescripteurs avec beaucoup de jeunes.

**Perimetre :**
- Import CSV de jeunes (template fourni, validation, preview avant import)
- Import CSV d'inscriptions en masse
- Gestion des doublons et erreurs
- Historique des imports

**Charge estimee :** 2 j

---

### 11. Statistiques et reporting avance

**Probleme :** Le dashboard admin montre 6 KPIs basiques. Pas de graphiques d'evolution ni de bilans exportables.

**Perimetre :**
- Graphiques d'evolution (inscriptions, presences, nouveaux prescripteurs par mois)
- Filtrage par periode, par categorie, par structure
- Comparaison inter-periodes
- Export PDF des bilans (pour les financeurs, le CA)
- Dashboard prescripteur enrichi (graphiques de suivi de ses jeunes)

**Charge estimee :** 4 j

---

## PRIORITE BASSE — Nice to have

### 12. PWA (Progressive Web App)

**Probleme :** Pas d'experience mobile native. Les prescripteurs terrain pourraient beneficier d'un acces hors-ligne.

**Perimetre :**
- Manifest + service worker
- Installation sur ecran d'accueil (mobile)
- Cache offline des donnees consultees recemment
- Synchronisation au retour en ligne

**Charge estimee :** 1.5 j

---

### 13. Accessibilite RGAA / WCAG 2.1 AA

**Probleme :** Accessibilite minimale. Pas conforme au RGAA (obligatoire pour les structures recevant des fonds publics).

**Perimetre :**
- Audit RGAA des pages principales
- Corrections : labels ARIA, navigation clavier, contrastes, lecteur d'ecran
- Skip links, focus visible, alternatives textuelles
- Page "Declaration d'accessibilite"

**Charge estimee :** 3 j

---

### 14. Multi-langue (i18n)

**Probleme :** Tout est en francais en dur. Si le dispositif s'etend a d'autres regions/pays.

**Perimetre :**
- Integration @nuxtjs/i18n
- Extraction des chaines dans des fichiers de traduction
- Switcher de langue
- Traduction Prismic (champs multilingues)

**Charge estimee :** 3 j

---

### 15. Signature electronique

**Probleme :** Les documents contractuels (conventions, autorisations) necessitent des signatures.

**Perimetre :**
- Integration service tiers (Yousign, DocuSign ou equivalent)
- Signature des conventions de stage / participation
- Suivi des signatures dans le panel admin
- Archivage legal des documents signes

**Charge estimee :** 3 j

---

### 16. Systeme de relance automatique

**Probleme :** Prescripteurs inactifs, profils incomplets, inscriptions non finalisees — aucune relance.

**Perimetre :**
- Relance prescripteurs inactifs (pas de connexion depuis X jours)
- Relance profils incomplets
- Relance inscriptions abandonnees
- Configuration des delais et contenus dans le panel admin

**Charge estimee :** 1.5 j

---

## Recapitulatif

| # | Fonctionnalite | Priorite | Charge |
|---|---------------|----------|--------|
| 1 | Suivi des presences | Haute | 3 j |
| 2 | Evaluations post-action | Haute | 4 j |
| 3 | Liste d'attente | Haute | 2 j |
| 4 | Generation de documents PDF | Haute | 3 j |
| 5 | Historique / timeline jeune | Haute | 2 j |
| 6 | Vue calendrier | Moyenne | 2.5 j |
| 7 | Cartographie interactive | Moyenne | 2.5 j |
| 8 | Notifications in-app | Moyenne | 3 j |
| 9 | Messagerie interne | Moyenne | 4 j |
| 10 | Import CSV en masse | Moyenne | 2 j |
| 11 | Statistiques avancees | Moyenne | 4 j |
| 12 | PWA | Basse | 1.5 j |
| 13 | Accessibilite RGAA | Basse | 3 j |
| 14 | Multi-langue | Basse | 3 j |
| 15 | Signature electronique | Basse | 3 j |
| 16 | Relances automatiques | Basse | 1.5 j |
| | | | |
| | **Total priorite haute** | | **14 j** |
| | **Total priorite moyenne** | | **18 j** |
| | **Total priorite basse** | | **12 j** |
| | **Total general** | | **44 j** |

---

## QUICK WINS — Implementes le 2026-03-25

| # | Fonctionnalite | Statut |
|---|---------------|--------|
| QW1 | Notes internes sur un jeune | Fait |
| QW2 | Duplication d'action (admin) | Fait |
| QW3 | Detection de conflits horaires | Fait |
| QW4 | Bouton partage d'action | Fait |
| QW5 | Archivage automatique des actions passees | Fait |

---

## NOUVELLES IDEES — Non encore planifiees (brainstorming 2026-03-25)

### Gestion des jeunes — enrichissements

| # | Fonctionnalite | Description | Impact | Charge est. |
|---|---------------|-------------|--------|-------------|
| 17 | Portail jeune autonome | Espace dedie ou le jeune (14-25 ans) consulte ses actions, son parcours, donne son avis | Fort | 5 j |
| 18 | Auto-inscription du jeune | Le jeune s'inscrit lui-meme aux actions (avec validation prescripteur) | Moyen | 2 j |
| 19 | Profil de competences | Tracker les competences acquises par action (savoir-faire cuisine, communication...) | Fort | 3 j |
| 20 | Recommandations d'actions | Suggerer des actions basees sur le profil, l'historique et les interets du jeune | Moyen | 2.5 j |
| 21 | Consentement parental digital | Workflow de signature pour les mineurs (<18 ans) | Fort | 2 j |
| 22 | Archivage automatique des jeunes | Archiver les jeunes qui depassent 25 ans ou inactifs depuis X mois | Moyen | 1 j |

### Operations & logistique

| # | Fonctionnalite | Description | Impact | Charge est. |
|---|---------------|-------------|--------|-------------|
| 23 | Gestion des intervenants | Profils des animateurs/formateurs, affectation aux actions, disponibilite | Fort | 3 j |
| 24 | Gestion des lieux/salles | Base de lieux avec capacite, equipements, disponibilite | Moyen | 2 j |
| 25 | Recurrence d'actions | Creer des actions recurrentes (tous les mardis, mensuel...) | Fort | 2 j |
| 26 | Detection de conflits horaires | Alerter si un jeune est inscrit a 2 actions simultanees | Moyen | Fait (QW3) |
| 27 | QR Code check-in | Le jeune scanne un QR a l'entree pour confirmer sa presence | Fort | 2 j |

### Communication avancee

| # | Fonctionnalite | Description | Impact | Charge est. |
|---|---------------|-------------|--------|-------------|
| 28 | Notifications SMS | Rappels par SMS en plus de l'email (taux d'ouverture >> email) | Fort | 2 j |
| 29 | Notes internes sur un jeune | Commentaires prives du prescripteur sur un jeune | Fort | Fait (QW1) |
| 30 | Fil d'actualite prescripteur | Feed dans l'espace montrant les dernieres actualites pertinentes | Faible | 1.5 j |

### Analytics & intelligence

| # | Fonctionnalite | Description | Impact | Charge est. |
|---|---------------|-------------|--------|-------------|
| 31 | Rapports automatises par email | Envoi mensuel automatique d'un resume d'activite | Moyen | 2 j |
| 32 | Scoring d'engagement jeune | Score calcule sur la participation, l'assiduite, les evaluations | Fort | 2.5 j |
| 33 | Alertes jeune "a risque" | Detection automatique : pas de participation depuis X semaines | Fort | 1.5 j |
| 34 | Benchmark entre structures | Comparer les KPI entre differentes structures prescriptrices | Moyen | 2 j |
| 35 | Exports personnalisables | Choisir les colonnes, la periode, le format (CSV/Excel/PDF) | Moyen | 2 j |
| 36 | Tableaux croises dynamiques | Croiser actions x demographie x resultats dans l'admin | Moyen | 3 j |

### Administration & gouvernance

| # | Fonctionnalite | Description | Impact | Charge est. |
|---|---------------|-------------|--------|-------------|
| 37 | Roles granulaires | Au-dela de prescripteur/admin : coordinateur, directeur, observateur... | Fort | 3 j |
| 38 | Multi-structure / multi-tenant | Supporter plusieurs antennes Prado avec des donnees separees | Fort | 5 j |
| 39 | Audit trail complet | Log de toutes les actions (qui a fait quoi, quand) consultable en admin | Fort | 2.5 j |
| 40 | Gestion des permissions | Droits fins par role (lecture seule, modification, suppression...) | Moyen | 2 j |

### Integrations externes

| # | Fonctionnalite | Description | Impact | Charge est. |
|---|---------------|-------------|--------|-------------|
| 41 | Sync calendrier | Export iCal / sync Google Calendar-Outlook pour les actions | Moyen | 1.5 j |
| 42 | API publique | Endpoints REST documentes pour integration avec d'autres systemes | Moyen | 3 j |
| 43 | FranceConnect SSO | SSO via FranceConnect pour les prescripteurs | Fort | 3 j |
| 44 | Import depuis logiciels ASE/Solis | Import de donnees depuis les logiciels metier de l'aide sociale | Fort | 4 j |

### RGPD & conformite avancee

| # | Fonctionnalite | Description | Impact | Charge est. |
|---|---------------|-------------|--------|-------------|
| 45 | Duree de conservation auto | Suppression automatique des donnees apres la duree legale | Fort | 2 j |
| 46 | Registre des traitements | Page admin listant tous les traitements RGPD | Moyen | 1 j |
| 47 | Consentement granulaire | Consentements separes par finalite (contact, newsletter, analytics...) | Moyen | 1.5 j |

### Mobile & terrain

| # | Fonctionnalite | Description | Impact | Charge est. |
|---|---------------|-------------|--------|-------------|
| 48 | Mode tablette optimise | Interface adaptee pour utilisation terrain (educateurs en deplacement) | Moyen | 2 j |
| 49 | Pieces jointes / photos | Attacher des documents ou photos aux profils jeunes | Moyen | 2 j |
| 50 | Mode hors-ligne avec sync | Au-dela de la PWA : editer des donnees offline et synchroniser | Fort | 4 j |

---

## Recommandation

**Phase 2 recommandee (post-livraison MVP) :**
Fonctionnalites 1 a 5 (priorite haute) = **14 j**
Ces fonctionnalites repondent aux besoins de reporting et de suivi qui sont essentiels pour une structure financee sur fonds publics.

**Phase 3 (amelioration UX) :**
Fonctionnalites 6 a 11 (priorite moyenne) = **18 j**
A arbitrer selon les retours terrain des prescripteurs apres quelques mois d'utilisation.

**Phase 4+ (nouvelles idees a arbitrer) :**
Fonctionnalites 17 a 50 — a prioriser selon les retours terrain et les objectifs strategiques du Prado.
