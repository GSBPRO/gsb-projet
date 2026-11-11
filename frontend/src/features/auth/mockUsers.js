/*
  Comptes fictifs pour la démonstration.
  ATTENTION : mots de passe en clair uniquement parce que c'est une maquette.
  Ce fichier est visible par tout le monde dans le navigateur. Le vrai back-end
  comparera un mot de passe haché avec bcrypt (NF01), jamais stocké en clair.

  Comptes de démo (un par rôle) :
  - Professionnel : lina.martin@gsb-demo.fr / Demo2026!
  - Professionnel (1re connexion, doit changer son mot de passe, F04) : paul.durand@gsb-demo.fr / Premiere2026!
  - Fournisseur (Laboratoire Aster) : marc.dubois@aster-demo.fr / Fournisseur2026!
  - Administrateur : admin@gsb-demo.fr / Admin2026!

  supplierId : le laboratoire du fournisseur (mockCatalogue.js), seulement pour le rôle Fournisseur (RG01).
  Les modifications faites pendant la démo (mot de passe, profil, comptes créés) restent en mémoire :
  elles disparaissent à l'actualisation de la page. Le serveur les gardera dans MySQL.
*/
export const users = [
  {
    id: 1,
    email: 'lina.martin@gsb-demo.fr',
    password: 'Demo2026!',
    firstName: 'Lina',
    lastName: 'Martin',
    title: 'Dr',
    role: 'Professionnel',
    profession: 'Médecin généraliste',
    phone: '01 23 45 67 89',
    mustChangePassword: false,
    active: true,
  },
  {
    id: 2,
    email: 'paul.durand@gsb-demo.fr',
    password: 'Premiere2026!',
    firstName: 'Paul',
    lastName: 'Durand',
    title: 'M.',
    role: 'Professionnel',
    profession: 'Pharmacien',
    phone: '',
    mustChangePassword: true,
    active: true,
  },
  {
    id: 3,
    email: 'marc.dubois@aster-demo.fr',
    password: 'Fournisseur2026!',
    firstName: 'Marc',
    lastName: 'Dubois',
    title: 'M.',
    role: 'Fournisseur',
    supplierId: 1,
    profession: 'Responsable commercial',
    phone: '04 56 78 90 12',
    mustChangePassword: false,
    active: true,
  },
  {
    id: 4,
    email: 'admin@gsb-demo.fr',
    password: 'Admin2026!',
    firstName: 'Camille',
    lastName: 'Bernard',
    title: 'Mme',
    role: 'Administrateur',
    profession: 'Administratrice GSB',
    phone: '',
    mustChangePassword: false,
    active: true,
  },
];
