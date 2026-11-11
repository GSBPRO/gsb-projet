// Vérifications côté navigateur pour aider l'utilisateur.
// Elles ne protègent rien : le serveur devra refaire ces contrôles (NF03).
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export const PASSWORD_MIN = 8;

// Règle de mot de passe : 8 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.
// Renvoie le message d'erreur, ou '' si le mot de passe convient.
export function passwordError(value) {
  if (value.length < PASSWORD_MIN) {
    return `Le mot de passe doit contenir au moins ${PASSWORD_MIN} caractères.`;
  }
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
    return 'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.';
  }
  return '';
}

// Téléphone facultatif : chiffres, espaces, points, tirets, + et parenthèses (6 à 20 caractères).
export function isValidPhone(value) {
  return value.trim() === '' || /^[\d\s.+()-]{6,20}$/.test(value.trim());
}
