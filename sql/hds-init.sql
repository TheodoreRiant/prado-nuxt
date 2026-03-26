-- ============================================================
-- Prado Itineraires — HDS Database Init Script
-- A executer sur la base PostgreSQL Scalingo HDS
-- ============================================================

-- Extension pour generation d'UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Table principale : donnees de sante & situation familiale ───

CREATE TABLE IF NOT EXISTS jeune_sante (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jeune_id uuid NOT NULL UNIQUE,     -- Reference vers la table jeunes sur Supabase (pas de FK cross-DB)

  -- Sante
  allergies text DEFAULT '',
  handicap text DEFAULT '',
  taux_invalidite text DEFAULT '',
  suivi_psychologique text DEFAULT '',
  suivi_medical text DEFAULT '',
  traitements_en_cours text DEFAULT '',
  regime_alimentaire text DEFAULT '',
  contacts_urgence text DEFAULT '[]', -- JSON array: [{nom, telephone, lien}]
  medecin_traitant text DEFAULT '',

  -- Situation familiale
  mesure_protection text DEFAULT '',
  referent_ase text DEFAULT '',
  composition_familiale text DEFAULT '',
  lieu_hebergement text DEFAULT '',
  droits_parentaux text DEFAULT '',

  -- Meta
  notes_confidentielles text DEFAULT '',
  derniere_mise_a_jour timestamptz DEFAULT now(),
  mis_a_jour_par uuid,               -- prescripteur_id (reference logique, pas FK)
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE jeune_sante IS 'Donnees de sante et situation familiale des jeunes — hebergees sur infra HDS certifiee.';
COMMENT ON COLUMN jeune_sante.jeune_id IS 'UUID du jeune sur Supabase. Unicite garantie par UNIQUE constraint.';
COMMENT ON COLUMN jeune_sante.contacts_urgence IS 'JSON array: [{nom: string, telephone: string, lien: string}]';

CREATE INDEX IF NOT EXISTS idx_jeune_sante_jeune_id ON jeune_sante(jeune_id);

-- ─── Table audit : traçabilite des acces aux donnees sensibles ───

CREATE TABLE IF NOT EXISTS audit_sante (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jeune_id uuid NOT NULL,
  action text NOT NULL,               -- 'read', 'create', 'update', 'delete', 'export'
  user_id uuid NOT NULL,              -- prescripteur ou admin
  ip_address text,
  user_agent text,
  details jsonb,                      -- Champs modifies, raison de suppression, etc.
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE audit_sante IS 'Journal d audit des acces et modifications aux donnees de sante. Requis RGPD/HDS.';

CREATE INDEX IF NOT EXISTS idx_audit_sante_jeune_id ON audit_sante(jeune_id);
CREATE INDEX IF NOT EXISTS idx_audit_sante_user_id ON audit_sante(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_sante_created_at ON audit_sante(created_at);

-- ─── Permissions ───
-- Sur Scalingo, l'utilisateur PostgreSQL par defaut a deja tous les droits.
-- Si un utilisateur applicatif restreint est cree :
-- GRANT SELECT, INSERT, UPDATE, DELETE ON jeune_sante TO prado_app;
-- GRANT SELECT, INSERT ON audit_sante TO prado_app;
-- (pas de DELETE/UPDATE sur audit — immutable par design)
