-- Migration 002: Modifier la table jeunes
-- Suppression des colonnes adresse et identite (liees a Veriff et aux donnees supprimees)
-- Ajout des nouvelles colonnes CDC v2 : sexe, QPV, accompagnement
-- Mise a jour de la colonne situation existante avec contrainte CHECK

ALTER TABLE jeunes DROP COLUMN IF EXISTS address;
ALTER TABLE jeunes DROP COLUMN IF EXISTS postal_code;
ALTER TABLE jeunes DROP COLUMN IF EXISTS city;
ALTER TABLE jeunes DROP COLUMN IF EXISTS identity_verified;
ALTER TABLE jeunes DROP COLUMN IF EXISTS veriff_session_id;

ALTER TABLE jeunes ADD COLUMN IF NOT EXISTS sex TEXT;
ALTER TABLE jeunes ADD COLUMN IF NOT EXISTS is_qpv BOOLEAN DEFAULT false;
ALTER TABLE jeunes ADD COLUMN IF NOT EXISTS accompagnement_type TEXT[] DEFAULT '{}';

-- Migrer les anciennes valeurs de situation vers les nouvelles
UPDATE jeunes SET situation = 'sans_emploi' WHERE situation IN ('neet', 'recherche-emploi');
UPDATE jeunes SET situation = 'scolarise_ordinaire' WHERE situation IN ('scolarise', 'decrochage');
UPDATE jeunes SET situation = 'emploi_formation' WHERE situation IN ('emploi', 'formation', 'service-civique', 'apprentissage');

-- Ajouter les contraintes CHECK
ALTER TABLE jeunes ADD CONSTRAINT jeunes_sex_check CHECK (sex IN ('homme', 'femme'));
ALTER TABLE jeunes ADD CONSTRAINT jeunes_situation_check CHECK (situation IN ('sans_emploi', 'scolarise_ordinaire', 'scolarise_medico_social', 'emploi_formation', 'autre'));
