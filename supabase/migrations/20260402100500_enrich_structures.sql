-- Migration 006: Enrichir la table structures
-- Ajout indicateur Prado, type de structure, et localisation

ALTER TABLE structures ADD COLUMN IF NOT EXISTS is_prado BOOLEAN DEFAULT false;
ALTER TABLE structures ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE structures ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE structures ADD COLUMN IF NOT EXISTS city TEXT;
