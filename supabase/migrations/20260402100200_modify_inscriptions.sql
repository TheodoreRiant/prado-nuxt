-- Migration 003: Modifier la table inscriptions
-- Ajout des colonnes pour accompagnateurs, personne d'urgence, attestation, presence

ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS accompagnateur_present BOOLEAN DEFAULT false;
ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS noms_accompagnateurs TEXT;
ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS personne_urgence_nom TEXT;
ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS personne_urgence_tel TEXT;
ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS attestation_responsabilite BOOLEAN DEFAULT false;
ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS presence TEXT DEFAULT 'inscrit' CHECK (presence IN ('inscrit', 'present', 'absent'));
