// Le panier est gardé dans le navigateur, un par utilisateur.
// On n'y range QUE { productId, quantity } : jamais de prix (ils sont relus dans le catalogue à l'affichage,
// donc impossible d'afficher un prix périmé ou falsifié) et rien de sensible.
// Plus tard : GET/PUT /api/cart vers Express. Les composants n'auront pas à changer.

export const MAX_QUANTITY = 99;

// Une clé par utilisateur : deux personnes sur le même poste ne partagent pas leur panier.
function storageKey(userId) {
  return `gsb.cart.${userId}`;
}

// Le stockage est modifiable par n'importe qui depuis les outils du navigateur : on ne lui fait pas confiance.
// On ne garde que les lignes bien formées, avec une quantité entière entre 1 et MAX_QUANTITY.
function sanitize(rawItems) {
  if (!Array.isArray(rawItems)) return [];

  const byProduct = new Map();
  for (const item of rawItems) {
    const productId = Number(item?.productId);
    const quantity = Number(item?.quantity);
    if (!Number.isInteger(productId) || productId <= 0) continue;
    if (!Number.isInteger(quantity) || quantity <= 0) continue;
    byProduct.set(productId, Math.min(quantity, MAX_QUANTITY));
  }
  return [...byProduct].map(([productId, quantity]) => ({ productId, quantity }));
}

export function loadCart(userId) {
  try {
    return sanitize(JSON.parse(localStorage.getItem(storageKey(userId))));
  } catch {
    // Stockage indisponible (navigation privée stricte) ou contenu illisible : panier vide.
    return [];
  }
}

export function saveCart(userId, items) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(items));
  } catch {
    // Stockage indisponible : le panier marche quand même, il ne survivra juste pas à une actualisation.
  }
}

// Contrôle de stock avant validation (F16). Pour l'instant il est simulé ici, avec le stock du catalogue.
// Plus tard : c'est le SERVEUR qui refera ce contrôle au moment de la commande (le navigateur se contourne).
// lines : [{ product, quantity }]. Renvoie les lignes dont la quantité dépasse le stock, avec ce qui reste.
export function findStockIssues(lines) {
  return lines
    .filter((line) => line.quantity > line.product.stock)
    .map((line) => ({ productId: line.product.id, name: line.product.name, available: line.product.stock }));
}
