-- Migration 001: Supprimer la table jeune_sante (donnees de sante HDS)
-- Les donnees de sante ne sont plus gerees dans l'application.

DROP TABLE IF EXISTS audit_sante;
DROP TABLE IF EXISTS jeune_sante;
