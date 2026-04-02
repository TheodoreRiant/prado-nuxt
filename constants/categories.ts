export type ProgrammationCategory =
  | 'Bien-être'
  | 'Découverte & orientation'
  | 'Vie quotidienne'
  | 'Formations'
  | 'Rencontres/Visites'
  | 'Mobilité'
  | 'Emploi'
  | 'Numérique'
  | 'Formations & Ateliers'
  | 'Droits'
  | 'Bénévolat';

export const PROGRAMMATION_CATEGORIES: ProgrammationCategory[] = [
  'Bien-être', 'Découverte & orientation', 'Vie quotidienne', 'Formations',
  'Formations & Ateliers', 'Rencontres/Visites', 'Mobilité', 'Emploi',
  'Numérique', 'Droits', 'Bénévolat',
];

export const PROGRAMMATION_CATEGORY_COLORS: Record<ProgrammationCategory, string> = {
  'Bien-être': '#93C1AF',
  'Découverte & orientation': '#024266',
  'Vie quotidienne': '#93C1AF',
  'Formations': '#024266',
  'Formations & Ateliers': '#024266',
  'Rencontres/Visites': '#93C1AF',
  'Mobilité': '#024266',
  'Emploi': '#FB6223',
  'Numérique': '#93C1AF',
  'Droits': '#024266',
  'Bénévolat': '#93C1AF',
};

export type RessourceCategory =
  | 'Accompagnement/Insertion'
  | 'Acces aux droits'
  | 'Emploi/Formation'
  | 'Logement/Mobilite'
  | 'Sante';

export const RESSOURCE_CATEGORIES: RessourceCategory[] = [
  'Accompagnement/Insertion', 'Acces aux droits', 'Emploi/Formation',
  'Logement/Mobilite', 'Sante',
];

export const RESSOURCE_CATEGORY_COLORS: Record<RessourceCategory, string> = {
  'Accompagnement/Insertion': '#93C1AF',
  'Acces aux droits': '#024266',
  'Emploi/Formation': '#93C1AF',
  'Logement/Mobilite': '#024266',
  'Sante': '#93C1AF',
};
