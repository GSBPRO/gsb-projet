// Vérification côté navigateur pour aider l'utilisateur.
// Elle ne protège rien : le serveur devra refaire ces contrôles (NF03).
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
