import { delay } from '../../mocks/delay.js';
import { users } from './mockUsers.js';

// Un seul message pour tous les échecs : on ne révèle pas si l'adresse existe (NF04).
const LOGIN_ERROR = 'Email ou mot de passe incorrect.';

// Clé utilisée dans le sessionStorage. On n'y range QUE le numéro du compte :
// pas d'e-mail, pas de mot de passe, pas de jeton (règle : rien de sensible dans le navigateur).
// sessionStorage : survit à une actualisation, mais s'efface quand on ferme l'onglet.
const SESSION_KEY = 'gsb.userId';

// On ne renvoie jamais le mot de passe au reste de l'application.
function toPublicUser(user) {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

// Plus tard : un appel POST /api/auth/login vers Express. Les composants n'auront pas à changer.
export async function login(email, password) {
  await delay();

  const user = users.find((candidate) => candidate.email === email.trim().toLowerCase());
  if (!user || user.password !== password || !user.active) {
    throw new Error(LOGIN_ERROR);
  }

  saveSession(user.id);
  return toPublicUser(user);
}

export function logout() {
  clearSession();
}

// Retrouve l'utilisateur après une actualisation de la page (null si personne n'est connecté).
// Plus tard : un appel GET /api/auth/me, la session étant gardée par un cookie HttpOnly côté serveur.
export function restoreSession() {
  try {
    const savedId = Number(sessionStorage.getItem(SESSION_KEY));
    const user = users.find((candidate) => candidate.id === savedId && candidate.active);
    return user ? toPublicUser(user) : null;
  } catch {
    // Stockage indisponible (navigation privée stricte, cookies bloqués) : on redemande la connexion.
    return null;
  }
}

function saveSession(userId) {
  try {
    sessionStorage.setItem(SESSION_KEY, String(userId));
  } catch {
    // Stockage indisponible : la connexion marche quand même, elle ne survivra juste pas à une actualisation.
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Rien à effacer si le stockage est indisponible.
  }
}
