/**
 * Liste des structures partenaires connues.
 * Utilisée pour l'autocomplete dans le formulaire d'inscription.
 * Source : site itineraires.le-prado.fr
 */
export const STRUCTURES_PARTENAIRES = [
  'ACOLEA',
  'ALYNEA',
  'Apprentis d\'Auteuil',
  'CAPSO',
  'Centre Départemental de l\'Enfance et de la Famille',
  'CDEF',
  'Département de l\'Ain',
  'Département de l\'Isère',
  'Département du Rhône',
  'Entraide Pierre Valdo',
  'Fondation AJD Maurice de Protestants',
  'Fondation du Prado',
  'Foyer Notre Dame',
  'IME Les Primevères',
  'La Sauvegarde 69',
  'Le MAS',
  'Le Prado',
  'Les PEP 69/ML',
  'Maison d\'Enfants du Rhône',
  'MECS Boisset',
  'MECS La Bâtie',
  'MECS Saint-Vincent',
  'Mission Locale de Lyon',
  'Mission Locale Villefranche',
  'Œuvre de Saint-Fons',
  'OVE',
  'PEP SRA',
  'PJJ — DTPJJ du Rhône',
  'PJJ — STEMOI',
  'PJJ — UEMO Lyon',
  'PJJ — UEMO Villefranche',
  'Prado Itinéraires',
  'Résidence Saint-Michel',
  'SAFED',
  'SOS Villages d\'Enfants',
  'SPEMO',
  'Vivre et Devenir',
] as const

export type StructurePartenaire = (typeof STRUCTURES_PARTENAIRES)[number]

/**
 * Domaines email connus → structure auto-détectée
 */
export const DOMAIN_TO_STRUCTURE: Record<string, string> = {
  'le-prado.fr': 'Fondation du Prado',
  'prado-itineraires.fr': 'Prado Itinéraires',
  'rhone.fr': 'Département du Rhône',
  'ain.fr': 'Département de l\'Ain',
  'isere.fr': 'Département de l\'Isère',
  'grandlyon.com': 'Métropole de Lyon',
  'sauvegarde69.fr': 'La Sauvegarde 69',
  'missionlocalelyon.fr': 'Mission Locale de Lyon',
  'apprentis-auteuil.org': 'Apprentis d\'Auteuil',
}
