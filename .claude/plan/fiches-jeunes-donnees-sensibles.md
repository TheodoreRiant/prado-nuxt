# Plan : Fiches jeunes — Donnees de sante & situation familiale

## Contexte

La Fondation du Prado souhaite enrichir les fiches jeunes avec des donnees de sante (allergies, handicap, suivi psychologique...) et de situation familiale (mesure de protection, referent ASE, composition familiale...). Ces donnees sont **sensibles au sens du RGPD** (article 9) et declenchent des obligations legales specifiques.

## Cadre legal

### 1. RGPD + Loi Informatique et Libertes

- **Article 9 RGPD** : Les donnees de sante sont interdites de traitement sauf exceptions (consentement explicite, interet vital, mission d'interet public)
- **CNIL Referentiel Protection de l'Enfance** (Deliberation 2022-008, 20 janvier 2022) : referentiel dedie aux structures comme le Prado — applicable directement
- **AIPD (DPIA)** obligatoire avant mise en production
- Mineurs < 15 ans : consentement parental requis en complement

### 2. Hebergement de Donnees de Sante (HDS)

**Verdict : OUI, HDS est obligatoire.**

L'article L1111-8 du Code de la sante publique couvre explicitement les donnees collectees lors d'activites de **"suivi social et medico-social"** — ce qui correspond exactement a l'activite du Prado. L'hebergeur tiers DOIT etre certifie HDS.

Sanctions : jusqu'a 5 ans d'emprisonnement + 300 000 EUR d'amende + amendes CNIL jusqu'a 4% du CA.

**HDS 2.0** (depuis nov. 2024) : impose l'hebergement physique dans l'EEE. Tous les hebergeurs doivent s'y conformer d'ici mai 2026.

---

## Architecture recommandee : Hybride

```
SUPABASE CLOUD (standard)              SCALINGO HDS (PostgreSQL)
================================       ===========================
- Auth / comptes prescripteurs         - Donnees de sante
- Actions, inscriptions                - Situation familiale
- Ressources, actualites               - Suivi psychologique
- Contacts, newsletter                 - Infos medicales
- Donnees administratives jeunes       - Notes medico-sociales
  (nom, prenom, date naissance,        - Historique de soin
   adresse, situation globale)
- Notes internes (non-medicales)
```

### Pourquoi cette architecture ?

1. **Conformite legale** : seules les donnees de sante vont sur l'hebergeur HDS
2. **Cout maitrise** : Scalingo PostgreSQL HDS a partir de ~14 EUR/mois (1 GB RAM, 20 GB)
3. **Pas de migration totale** : on garde Supabase pour tout le reste (auth, RLS, realtime)
4. **Separation des responsabilites** : en cas de fuite, les donnees sensibles sont isolees

### Alternative : Self-host Supabase sur OVHcloud HDS

- VPS OVHcloud HDS (~30-60 EUR/mois) avec Supabase Docker
- Avantage : tout sur une infra, on garde les features Supabase
- Inconvenient : maintenance DevOps (mises a jour, backups, monitoring)

---

## Modele de donnees

### Option A : Tables separees sur Scalingo HDS (RECOMMANDEE)

```sql
-- Table sur Scalingo HDS
CREATE TABLE jeune_sante (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jeune_id uuid NOT NULL,           -- Reference vers jeunes sur Supabase
  -- Sante
  allergies text DEFAULT '',
  handicap text DEFAULT '',
  taux_invalidite text DEFAULT '',
  suivi_psychologique text DEFAULT '',
  suivi_medical text DEFAULT '',
  traitements_en_cours text DEFAULT '',
  regime_alimentaire text DEFAULT '',
  contacts_urgence text DEFAULT '', -- JSON: [{nom, tel, lien}]
  medecin_traitant text DEFAULT '',
  -- Situation familiale
  mesure_protection text DEFAULT '',    -- ASE, PJJ, tutelle...
  referent_ase text DEFAULT '',
  composition_familiale text DEFAULT '',
  lieu_hebergement text DEFAULT '',     -- Foyer, famille d'accueil, autonome...
  droits_parentaux text DEFAULT '',
  -- Meta
  notes_confidentielles text DEFAULT '',
  derniere_mise_a_jour timestamptz DEFAULT now(),
  mis_a_jour_par uuid,              -- prescripteur_id
  created_at timestamptz DEFAULT now()
);

-- Chiffrement au niveau colonne pour les champs les plus sensibles
-- Utiliser pgcrypto pour chiffrer allergies, suivi_psychologique, traitements

CREATE INDEX idx_jeune_sante_jeune_id ON jeune_sante(jeune_id);
```

### Option B : Extension de la table jeunes existante sur Supabase

**NON RECOMMANDE** — Supabase Cloud n'est pas HDS-certifie. Stocker des donnees de sante sur un hebergeur non-HDS est illegal.

---

## Chiffrement

### Couche 1 : Chiffrement au repos (infrastructure)

Scalingo HDS fournit le chiffrement au repos par defaut (disques chiffres, ISO 27001).

### Couche 2 : Chiffrement au niveau colonne (pgcrypto)

```sql
-- Sur la base Scalingo HDS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Chiffrement des champs les plus sensibles
-- La cle de chiffrement est stockee dans une variable d'environnement serveur
-- Elle n'est JAMAIS exposee cote client

INSERT INTO jeune_sante (jeune_id, allergies, suivi_psychologique)
VALUES (
  $1,
  pgp_sym_encrypt($2, current_setting('app.encryption_key')),
  pgp_sym_encrypt($3, current_setting('app.encryption_key'))
);

SELECT
  jeune_id,
  pgp_sym_decrypt(allergies::bytea, current_setting('app.encryption_key')) as allergies,
  pgp_sym_decrypt(suivi_psychologique::bytea, current_setting('app.encryption_key')) as suivi_psycho
FROM jeune_sante
WHERE jeune_id = $1;
```

### Couche 3 (optionnelle) : Chiffrement client-side

Pour une protection maximale (zero-knowledge), chiffrer cote client avant envoi :

```typescript
// Utiliser Web Crypto API
async function encryptField(plaintext: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(plaintext)
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded,
  )
  // Combiner IV + ciphertext en base64
  const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), iv.length)
  return btoa(String.fromCharCode(...combined))
}
```

**Trade-off** : les champs chiffres cote client ne peuvent pas etre recherches/filtres en base. Acceptable pour des notes medicales, mais pas pour des filtres admin.

**Recommandation** : pgcrypto (couche 2) suffit pour la conformite. Le chiffrement client-side est un bonus pour les champs les plus sensibles (notes confidentielles, suivi psychologique).

---

## Implementation — Etapes

### Phase 1 : Infrastructure HDS (3 jours)

**Etape 1.1 : Creer le compte Scalingo HDS**
- Souscrire a Scalingo avec l'option HDS
- Creer une base PostgreSQL dediee "prado-sante"
- Configurer pgcrypto + cle de chiffrement

**Etape 1.2 : API proxy cote serveur**
- Creer un module serveur Nuxt qui se connecte a Scalingo HDS
- Les routes API Nuxt servent de proxy entre le client et la base HDS
- Le client ne se connecte JAMAIS directement a la base HDS

**Fichiers a creer :**
```
server/utils/hds-client.ts          -- Client PostgreSQL vers Scalingo HDS
server/api/jeunes/[id]/sante.get.ts -- Lire les donnees de sante
server/api/jeunes/[id]/sante.put.ts -- Mettre a jour les donnees de sante
```

**Etape 1.3 : Variables d'environnement**
```env
HDS_DATABASE_URL=postgresql://user:pass@host:5432/prado-sante?sslmode=require
HDS_ENCRYPTION_KEY=<cle-aleatoire-64-chars>
```

### Phase 2 : Modele de donnees & API (2 jours)

**Etape 2.1 : Migration Scalingo**
- Creer la table `jeune_sante` (voir schema ci-dessus)
- Activer pgcrypto
- Configurer la cle de chiffrement

**Etape 2.2 : Types TypeScript**
```typescript
// lib/types/sante.ts
export interface JeuneSante {
  id: string
  jeuneId: string
  // Sante
  allergies: string
  handicap: string
  tauxInvalidite: string
  suiviPsychologique: string
  suiviMedical: string
  traitementsEnCours: string
  regimeAlimentaire: string
  contactsUrgence: ContactUrgence[]
  medecinTraitant: string
  // Situation familiale
  mesureProtection: string
  referentAse: string
  compositionFamiliale: string
  lieuHebergement: string
  droitsParentaux: string
  // Meta
  notesConfidentielles: string
  derniereMiseAJour: string
  misAJourPar: string
}

export interface ContactUrgence {
  nom: string
  telephone: string
  lien: string  // pere, mere, tuteur, educateur...
}
```

**Etape 2.3 : Endpoints API**

| Methode | Route | Description |
|---------|-------|-------------|
| GET | `/api/jeunes/[id]/sante` | Lire la fiche sante (auth + ownership check) |
| PUT | `/api/jeunes/[id]/sante` | Creer/mettre a jour la fiche sante |
| DELETE | `/api/jeunes/[id]/sante` | Supprimer la fiche sante (RGPD) |

Chaque endpoint verifie :
1. L'utilisateur est authentifie
2. Le jeune appartient au prescripteur (ou l'utilisateur est admin)
3. La requete est loguee dans un audit trail

### Phase 3 : Interface utilisateur (4 jours)

**Etape 3.1 : Composant FicheSante.vue**

Creer un composant a onglets integre dans la page `pages/espace/jeunes/[id].vue` :

```
[Infos generales] [Sante] [Situation familiale] [Documents]
```

**Onglet Sante :**
- Allergies (textarea)
- Handicap / taux d'invalidite (text + select)
- Suivi psychologique (textarea, chiffre)
- Suivi medical (textarea)
- Traitements en cours (textarea, chiffre)
- Regime alimentaire (select: standard, vegetarien, halal, sans gluten, autre + precision)
- Contacts d'urgence (liste dynamique : nom, tel, lien)
- Medecin traitant (text)

**Onglet Situation familiale :**
- Mesure de protection (select: ASE, PJJ, tutelle, curatelle, aucune, autre)
- Referent ASE (text: nom + coordonnees)
- Composition familiale (textarea)
- Lieu d'hebergement (select: foyer, famille d'accueil, famille, autonome, autre)
- Droits parentaux (textarea)

**Onglet Documents :**
- Reserve pour Phase 4 (pieces jointes)

**Etape 3.2 : Indicateurs visuels**

Sur la page jeune detail et dans la liste des jeunes, afficher :
- Badge "Fiche sante remplie" (vert) / "Fiche sante incomplete" (orange)
- Icone allergie si allergies renseignees (utile pour les actions avec repas)
- Badge mesure de protection si applicable

**Etape 3.3 : Admin — Vue transversale**

Ajouter dans `/admin/jeunes` :
- Colonne "Fiche sante" (oui/non)
- Colonne "Mesure protection" (type)
- Filtres par mesure de protection, handicap
- Export CSV avec donnees sante (acces admin uniquement, logue)

### Phase 4 : Securite & conformite (2 jours)

**Etape 4.1 : Audit trail**
```sql
-- Sur Scalingo HDS
CREATE TABLE audit_sante (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jeune_id uuid NOT NULL,
  action text NOT NULL,       -- 'read', 'create', 'update', 'delete', 'export'
  user_id uuid NOT NULL,      -- prescripteur ou admin
  ip_address text,
  user_agent text,
  details jsonb,              -- champs modifies
  created_at timestamptz DEFAULT now()
);
```

**Etape 4.2 : AIPD (DPIA)**
- Documenter l'analyse d'impact
- Identifier les risques et mesures d'attenuation
- A valider avec le DPO du Prado avant mise en production

**Etape 4.3 : Consentement**
- Ajouter un ecran de consentement explicite avant la premiere saisie de donnees de sante
- Stocker la preuve de consentement (date, IP, texte exact)
- Permettre le retrait du consentement (suppression des donnees sante)

**Etape 4.4 : Duree de conservation**
- Donnees de sante : supprimees automatiquement 2 ans apres la fin de la prise en charge
- Ou sur demande du jeune/representant legal
- Cron job de purge mensuel

**Etape 4.5 : Export RGPD**
- Mettre a jour l'endpoint `/api/export-data` pour inclure les donnees sante
- L'export est chiffre (ZIP protege par mot de passe)

---

## Fichiers a creer/modifier

| Fichier | Operation | Description |
|---------|-----------|-------------|
| `server/utils/hds-client.ts` | Creer | Client PostgreSQL vers Scalingo HDS |
| `server/api/jeunes/[id]/sante.get.ts` | Creer | Lire fiche sante |
| `server/api/jeunes/[id]/sante.put.ts` | Creer | Creer/mettre a jour fiche sante |
| `server/api/jeunes/[id]/sante.delete.ts` | Creer | Supprimer fiche sante (RGPD) |
| `lib/types/sante.ts` | Creer | Types TypeScript |
| `composables/useSante.ts` | Creer | Composable pour les donnees sante |
| `components/jeune/FicheSante.vue` | Creer | Onglet sante |
| `components/jeune/FicheFamille.vue` | Creer | Onglet situation familiale |
| `components/jeune/ContactsUrgence.vue` | Creer | Liste contacts d'urgence |
| `components/jeune/ConsentementSante.vue` | Creer | Ecran de consentement |
| `pages/espace/jeunes/[id].vue` | Modifier | Ajouter navigation par onglets |
| `pages/admin/jeunes.vue` | Modifier | Colonnes sante + filtres |
| `server/api/export-data.get.ts` | Modifier | Inclure donnees sante |
| `server/api/cron/purge-sante.ts` | Creer | Purge automatique des donnees expirees |
| `nuxt.config.ts` | Modifier | Ajouter variables HDS |

---

## Hebergeurs HDS compares

| Critere | Scalingo | OVHcloud VPS | Clever Cloud |
|---------|----------|-------------|-------------|
| **Certifie HDS** | Oui (6 activites) | Oui | Oui |
| **PostgreSQL manage** | Oui | Non (self-managed) | Oui |
| **Prix /mois** | 14-29 EUR | 30-60 EUR | ~15-30 EUR |
| **Maintenance** | Zero (PaaS) | Totale (IaaS) | Zero (PaaS) |
| **Localisation** | France (Outscale) | France | France |
| **Backup auto** | Oui | Manuel | Oui |
| **HDS 2.0 conforme** | Oui (deadline mai 2026) | Oui | Oui |

**Recommandation : Scalingo** — PaaS, zero maintenance, PostgreSQL gere, HDS inclus, prix accessible.

---

## Risques et mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Latence double-base (Supabase + Scalingo) | Moyen | Les donnees sante sont chargees a la demande (onglet), pas sur chaque page |
| Desynchronisation jeune_id entre les 2 bases | Haut | Supprimer les donnees sante en cascade quand un jeune est supprime sur Supabase |
| Fuite de cle de chiffrement | Critique | Cle dans Vercel env vars, rotation annuelle, audit d'acces |
| Non-conformite HDS | Critique | Utiliser UNIQUEMENT un hebergeur certifie, verifier la liste ANS |
| Complexite de maintenance | Moyen | Scalingo PaaS minimise la charge ops |
| Consentement invalide (mineur) | Haut | Verifier l'age, exiger le consentement parental si < 15 ans |

---

## Estimation de charge

| Phase | Charge | Dependances |
|-------|--------|-------------|
| Phase 1 : Infrastructure HDS | 3 jours | Compte Scalingo, variables env Vercel |
| Phase 2 : Modele de donnees & API | 2 jours | Phase 1 |
| Phase 3 : Interface utilisateur | 4 jours | Phase 2 |
| Phase 4 : Securite & conformite | 2 jours | Phase 3 |
| **Total** | **11 jours** | |

**Pre-requis non-techniques :**
- Validation du DPO Prado sur l'AIPD
- Decision sur l'hebergeur HDS (Scalingo recommande)
- Redaction du texte de consentement avec le service juridique

---

## SESSION_ID
- CODEX_SESSION: N/A (analyse directe)
- GEMINI_SESSION: N/A (analyse directe)
