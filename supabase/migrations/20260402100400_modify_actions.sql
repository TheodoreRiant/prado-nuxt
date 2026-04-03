-- Migration 005: Modifier la table actions
-- Ajout cout, recurrence, et lien vers etablissement

ALTER TABLE actions ADD COLUMN IF NOT EXISTS cost DECIMAL(10,2);
ALTER TABLE actions ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;
ALTER TABLE actions ADD COLUMN IF NOT EXISTS etablissement_id UUID REFERENCES etablissements(id);
