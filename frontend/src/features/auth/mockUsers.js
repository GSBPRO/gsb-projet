/*
  Comptes fictifs pour la démonstration.
  ATTENTION : mots de passe en clair uniquement parce que c'est une maquette.
  Ce fichier est visible par tout le monde dans le navigateur. Le vrai back-end
  comparera un mot de passe haché avec bcrypt (NF01), jamais stocké en clair.
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
    mustChangePassword: false,
    active: true,
  },
];
