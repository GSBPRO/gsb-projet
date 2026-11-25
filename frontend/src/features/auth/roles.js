// Les trois profils du site (RG01) et la page d'accueil de chacun.
export const ROLES = {
  professional: 'Professionnel',
  supplier: 'Fournisseur',
  admin: 'Administrateur',
};

const HOME_PATHS = {
  [ROLES.professional]: '/accueil',
  [ROLES.supplier]: '/fournisseur/produits',
  [ROLES.admin]: '/admin/commandes',
};

// [ROLES.admin] entre crochets : la clé est la valeur « Administrateur », pas le mot « ROLES.admin ».
// ?? '/connexion' : si le rôle est inconnu, on renvoie vers la connexion plutôt que vers une page cassée.
export function homePathFor(role) {
  return HOME_PATHS[role] ?? '/connexion';
}

// Libellé affiché sous le nom, dans l'en-tête.
const ROLE_LABELS = {
  [ROLES.professional]: 'Professionnel de santé',
  [ROLES.supplier]: 'Fournisseur',
  [ROLES.admin]: 'Administrateur',
};

export function roleLabel(role) {
  return ROLE_LABELS[role] ?? role;
}
