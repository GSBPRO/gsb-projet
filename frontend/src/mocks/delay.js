// Simule le temps de réponse d'un vrai serveur, pour voir les états de chargement.
export function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
