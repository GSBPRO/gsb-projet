import { ROLES } from '../auth/roles.js';

// Identifiant du menu déroulant du catalogue (réservé au professionnel).
export const CATALOGUE_MENU_ID = 'catalogue-menu';

// Les onglets de l'en-tête selon le profil. Chaque profil ne voit que ses pages (NF02, côté affichage).
const LINKS_BY_ROLE = {
  [ROLES.professional]: [
    { to: '/accueil', label: 'Accueil' },
    { to: '/catalogue', label: 'Catalogue', menuId: CATALOGUE_MENU_ID },
    { to: '/commandes', label: 'Mes commandes' },
  ],
  [ROLES.supplier]: [{ to: '/fournisseur/produits', label: 'Mes produits' }],
  [ROLES.admin]: [
    { to: '/admin/commandes', label: 'Commandes' },
    { to: '/admin/produits', label: 'Produits' },
    { to: '/admin/validation', label: 'Validation' },
    { to: '/admin/categories', label: 'Catégories' },
    { to: '/admin/comptes', label: 'Comptes' },
  ],
};

export function navLinksFor(role) {
  return LINKS_BY_ROLE[role] ?? [];
}
