// ─── Types pour les donnees de sante & situation familiale ───
// Stockees sur la base HDS (Scalingo), separees des donnees Supabase.

export interface ContactUrgence {
  nom: string
  telephone: string
  lien: string // pere, mere, tuteur, educateur, autre
}

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

export type JeuneSanteInput = Omit<JeuneSante, 'id' | 'jeuneId' | 'derniereMiseAJour' | 'misAJourPar'>

// ─── Constantes pour les selects ───

export const MESURES_PROTECTION = [
  { value: '', label: 'Non renseigné' },
  { value: 'ase', label: 'ASE (Aide Sociale à l\'Enfance)' },
  { value: 'pjj', label: 'PJJ (Protection Judiciaire de la Jeunesse)' },
  { value: 'tutelle', label: 'Tutelle' },
  { value: 'curatelle', label: 'Curatelle' },
  { value: 'aemo', label: 'AEMO (Action Éducative en Milieu Ouvert)' },
  { value: 'aucune', label: 'Aucune' },
  { value: 'autre', label: 'Autre' },
] as const

export const REGIMES_ALIMENTAIRES = [
  { value: '', label: 'Non renseigné' },
  { value: 'standard', label: 'Standard' },
  { value: 'vegetarien', label: 'Végétarien' },
  { value: 'vegetalien', label: 'Végétalien' },
  { value: 'halal', label: 'Halal' },
  { value: 'casher', label: 'Casher' },
  { value: 'sans-gluten', label: 'Sans gluten' },
  { value: 'sans-lactose', label: 'Sans lactose' },
  { value: 'autre', label: 'Autre' },
] as const

export const LIEUX_HEBERGEMENT = [
  { value: '', label: 'Non renseigné' },
  { value: 'foyer', label: 'Foyer / MECS' },
  { value: 'famille-accueil', label: 'Famille d\'accueil' },
  { value: 'famille', label: 'Famille (domicile parental)' },
  { value: 'autonome', label: 'Logement autonome' },
  { value: 'hebergement-urgence', label: 'Hébergement d\'urgence' },
  { value: 'sans-domicile', label: 'Sans domicile fixe' },
  { value: 'autre', label: 'Autre' },
] as const

export const LIENS_CONTACT = [
  { value: 'pere', label: 'Père' },
  { value: 'mere', label: 'Mère' },
  { value: 'tuteur', label: 'Tuteur légal' },
  { value: 'educateur', label: 'Éducateur référent' },
  { value: 'famille', label: 'Autre membre de la famille' },
  { value: 'autre', label: 'Autre' },
] as const

// ─── Mapper DB row → TypeScript ───

export function toJeuneSante(row: Record<string, unknown>): JeuneSante {
  let contacts: ContactUrgence[] = []
  try {
    const raw = row.contacts_urgence
    if (typeof raw === 'string' && raw) contacts = JSON.parse(raw)
    else if (Array.isArray(raw)) contacts = raw as ContactUrgence[]
  } catch { /* invalid JSON → empty */ }

  return {
    id: row.id as string,
    jeuneId: row.jeune_id as string,
    allergies: (row.allergies as string) ?? '',
    handicap: (row.handicap as string) ?? '',
    tauxInvalidite: (row.taux_invalidite as string) ?? '',
    suiviPsychologique: (row.suivi_psychologique as string) ?? '',
    suiviMedical: (row.suivi_medical as string) ?? '',
    traitementsEnCours: (row.traitements_en_cours as string) ?? '',
    regimeAlimentaire: (row.regime_alimentaire as string) ?? '',
    contactsUrgence: contacts,
    medecinTraitant: (row.medecin_traitant as string) ?? '',
    mesureProtection: (row.mesure_protection as string) ?? '',
    referentAse: (row.referent_ase as string) ?? '',
    compositionFamiliale: (row.composition_familiale as string) ?? '',
    lieuHebergement: (row.lieu_hebergement as string) ?? '',
    droitsParentaux: (row.droits_parentaux as string) ?? '',
    notesConfidentielles: (row.notes_confidentielles as string) ?? '',
    derniereMiseAJour: (row.derniere_mise_a_jour as string) ?? '',
    misAJourPar: (row.mis_a_jour_par as string) ?? '',
  }
}

// ─── Empty default for new fiches ───

export function emptySanteInput(): JeuneSanteInput {
  return {
    allergies: '',
    handicap: '',
    tauxInvalidite: '',
    suiviPsychologique: '',
    suiviMedical: '',
    traitementsEnCours: '',
    regimeAlimentaire: '',
    contactsUrgence: [],
    medecinTraitant: '',
    mesureProtection: '',
    referentAse: '',
    compositionFamiliale: '',
    lieuHebergement: '',
    droitsParentaux: '',
    notesConfidentielles: '',
  }
}
