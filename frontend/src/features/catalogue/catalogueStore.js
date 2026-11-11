import { categories as mockCategories, laboratories, products as mockProducts } from './mockCatalogue.js';

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

let state = null;
const listeners = new Set();

function load() {
  if (state) return state;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    state = isValidState(saved) ? saved : initialState();
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
