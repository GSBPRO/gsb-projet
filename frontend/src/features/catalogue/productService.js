import { delay } from '../../mocks/delay.js';
import { categories, laboratories, products } from './mockCatalogue.js';

// Un produit n'est proposé à la vente que s'il est actif ET validé par l'administrateur (F12, RG08).
function isSellable(product) {
  return product.active && product.validationStatus === 'Accepté';
}

async function loadCatalogue() {
  await delay();
  return {
    products: products.filter(isSellable),
    categories,
    laboratories,
  };
}

// On garde la réponse en mémoire : le menu du catalogue et la page catalogue utilisent les mêmes données,
// inutile de les recharger à chaque ouverture. En cas d'échec, on oublie pour pouvoir réessayer.
let cataloguePromise = null;

// Tout ce dont le catalogue a besoin, en un seul appel.
// Plus tard : GET /api/catalogue vers Express. C'est le SERVEUR qui fera le tri des produits vendables (F12) :
// ici, un utilisateur pourrait voir les produits cachés en lisant le code du navigateur.
export function getCatalogue() {
  if (!cataloguePromise) {
    cataloguePromise = loadCatalogue().catch((error) => {
      cataloguePromise = null;
      throw error;
    });
  }
  return cataloguePromise;
}
