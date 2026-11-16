import { baseProducts, categories as mockCategories, laboratories, products as mockProducts } from './mockCatalogue.js';

// La « base de données » du catalogue pour la démonstration : produits, catégories et historique de stock.
// Elle part des données fictives, puis les modifications (admin, fournisseur, commandes) sont gardées dans le
// localStorage pour survivre à une actualisation. Rien de sensible ici : pas de mot de passe ni de donnée perso.
// Plus tard, tout ceci vit dans MySQL et ce fichier disparaît : seuls les services appellent l'API.

const STORAGE_KEY = 'gsb.catalogue';

function initialState() {
  return {
    products: structuredClone(mockProducts),
    categories: structuredClone(mockCategories),
    stockMovements: [],
  };
}

// Le stockage est modifiable par l'utilisateur : on ne le garde que s'il a la bonne forme.
function isValidState(state) {
  return (
    state &&
    Array.isArray(state.products) &&
    Array.isArray(state.categories) &&
    Array.isArray(state.stockMovements) &&
    state.products.every((product) => Number.isInteger(product?.id) && typeof product.name === 'string')
  );
}

// Un catalogue enregistré avant l'ajout des photos d'ambiance ne les connaît pas :
// on les reprend des données fictives, sans toucher au reste (stock, prix modifiés…).
function addMissingVisuals(saved) {
  saved.products.forEach((product) => {
    if (product.ambiance === undefined) {
      product.ambiance = mockProducts.find((mock) => mock.id === product.id)?.ambiance ?? null;
    }
    // Les visuels en plus ne se modifient pas dans l'appli : on reprend toujours la liste à jour des données fictives.
    const mock = mockProducts.find((item) => item.id === product.id);
    const original = baseProducts.find((item) => item.id === product.id);
    if (mock?.galleryVersion) {
      // Mettre à jour les images livrées sans écraser une photo importée par l'administrateur.
      const deliveredFolder = mock.image.slice(0, mock.image.lastIndexOf('/') + 1);
      if (product.image === original?.image || (typeof product.image === 'string' && product.image.startsWith(deliveredFolder))) {
        product.image = mock.image;
        product.imageThumb = mock.imageThumb;
      } else {
        product.imageThumb = undefined;
      }
      // Corriger un ancien format fictif uniquement s'il n'a pas été modifié dans l'application.
      if (product.format === original?.format) product.format = mock.format;
      if (product.description === original?.description) product.description = mock.description;
      product.galleryVersion = mock.galleryVersion;
      product.ambiance = null;
    }
    product.extraImages = mock?.extraImages ?? product.extraImages ?? [];
    // Pareil pour la vue 360° : elle peut avoir été retirée d'un produit depuis l'enregistrement.
    if (mock) product.views360 = mock.views360;
    product.blurredAmbiance = mock?.blurredAmbiance ?? product.blurredAmbiance ?? false;
  });
  return saved;
}

let state = null;
const listeners = new Set();

function load() {
  if (state) return state;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    state = isValidState(saved) ? addMissingVisuals(saved) : initialState();
  } catch {
    state = initialState();
  }
  return state;
}

// Appelle fn quand le catalogue change (le service du catalogue y vide sa mémoire).
export function onCatalogueChange(listener) {
  listeners.add(listener);
}

// Modifie le catalogue : « change » reçoit l'état et le modifie directement, puis on enregistre.
export function updateCatalogue(change) {
  const current = load();
  change(current);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Stockage plein ou indisponible (une image trop lourde, par exemple) : la modification reste
    // en mémoire jusqu'à l'actualisation de la page.
  }
  listeners.forEach((listener) => listener());
}

export function readCatalogue() {
  return load();
}

export function nextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

export { laboratories };
