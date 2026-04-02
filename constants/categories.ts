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
  'Bien-être': '#024266',
  'Découverte & orientation': '#FD6223',
  'Vie quotidienne': '#93C1AF',
  'Formations': '#FD6223',
  'Formations & Ateliers': '#FD6223',
  'Rencontres/Visites': 'var(--prado-teal)',
  'Mobilité': '#93C1AF',
  'Emploi': '#FD6223',
  'Numérique': 'var(--prado-teal)',
  'Droits': '#FD6223',
  'Bénévolat': '#024266',
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
  'Accompagnement/Insertion': '#FD6223',
  'Acces aux droits': '#FD6223',
  'Emploi/Formation': '#93C1AF',
  'Logement/Mobilite': '#024266',
  'Sante': 'var(--prado-teal)',
};
