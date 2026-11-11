import { delay } from '../../mocks/delay.js';
import { users } from '../auth/mockUsers.js';
import { ROLES } from '../auth/roles.js';
import { isValidEmail, passwordError } from '../auth/validators.js';
import { laboratories } from '../catalogue/catalogueStore.js';
import { AdminError } from './adminCatalogueService.js';

// Gestion des comptes par l'administrateur (F01, F21). Seul l'administrateur crée des comptes : pas d'inscription (F02).
// Plus tard : routes /api/admin/users vers Express, avec mots de passe hachés (NF01) et rôle vérifié (NF02).

// On ne renvoie jamais le mot de passe à l'interface.
function toPublic(user) {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export async function listUsers() {
  await delay();
  return { users: users.map(toPublic), laboratories };
}

const TITLES = ['M.', 'Mme', 'Dr', 'Pr'];

// Vérifie les champs d'un compte. temporaryPassword n'est demandé qu'à la création.
export function validateUser(input, { isNew, existingId = null }) {
  const found = {};
  const text = (value) => String(value ?? '').trim();

  if (!text(input.firstName)) found.firstName = 'Saisissez le prénom.';
  if (!text(input.lastName)) found.lastName = 'Saisissez le nom.';
  if (!TITLES.includes(input.title)) found.title = 'Choisissez une civilité.';
  if (!Object.values(ROLES).includes(input.role)) found.role = 'Choisissez un profil.';
  if (input.role === ROLES.supplier && !laboratories.some((laboratory) => laboratory.id === Number(input.supplierId))) {
    found.supplierId = 'Un compte fournisseur doit être rattaché à un fournisseur (RG01).';
  }
  if (isNew) {
    if (!isValidEmail(text(input.email))) found.email = 'Saisissez une adresse email valide.';
    else if (users.some((user) => user.id !== existingId && user.email === text(input.email).toLowerCase())) {
      found.email = 'Un compte utilise déjà cette adresse.';
    }
    const rule = passwordError(String(input.temporaryPassword ?? ''));
    if (rule) found.temporaryPassword = rule;
  }
  return found;
}

export class UserError extends AdminError {
  constructor(code, message, fields = {}) {
    super(code, message);
    this.fields = fields;
  }
}

// Création : le mot de passe est provisoire, la personne devra le changer à sa première connexion (F04, RG04).
export async function createUser(input) {
  await delay();
  const fields = validateUser(input, { isNew: true });
  if (Object.keys(fields).length > 0) throw new UserError('VALIDATION', 'Le formulaire contient des erreurs.', fields);

  const user = {
    id: users.reduce((max, existing) => Math.max(max, existing.id), 0) + 1,
    email: String(input.email).trim().toLowerCase(),
    password: input.temporaryPassword,
    firstName: String(input.firstName).trim(),
    lastName: String(input.lastName).trim(),
    title: input.title,
    role: input.role,
    profession: String(input.profession ?? '').trim().slice(0, 80),
    phone: '',
    mustChangePassword: true,
    active: true,
  };
  if (input.role === ROLES.supplier) user.supplierId = Number(input.supplierId);
  users.push(user);
  return toPublic(user);
}

// Modification (F21) : l'e-mail ne change pas (il sert d'identifiant).
export async function updateUser(userId, input) {
  await delay();
  const fields = validateUser(input, { isNew: false, existingId: userId });
  if (Object.keys(fields).length > 0) throw new UserError('VALIDATION', 'Le formulaire contient des erreurs.', fields);

  const user = users.find((candidate) => candidate.id === userId);
  if (!user) throw new UserError('NOT_FOUND', 'Compte introuvable.');
  user.firstName = String(input.firstName).trim();
  user.lastName = String(input.lastName).trim();
  user.title = input.title;
  user.profession = String(input.profession ?? '').trim().slice(0, 80);
  user.role = input.role;
  if (input.role === ROLES.supplier) user.supplierId = Number(input.supplierId);
  else delete user.supplierId;
  return toPublic(user);
}

// Activer / désactiver un compte (F21). On ne désactive pas son propre compte : on s'enfermerait dehors.
export async function setUserActive(userId, active, currentAdminId) {
  await delay();
  if (userId === currentAdminId && !active) {
    throw new UserError('SELF', 'Vous ne pouvez pas désactiver votre propre compte.');
  }
  const user = users.find((candidate) => candidate.id === userId);
  if (!user) throw new UserError('NOT_FOUND', 'Compte introuvable.');
  user.active = Boolean(active);
}
