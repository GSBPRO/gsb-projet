import { delay } from '../../mocks/delay.js';
import { nextId, readCatalogue, updateCatalogue } from '../catalogue/catalogueStore.js';
import { productHasOrders } from '../orders/orderService.js';

// Actions réservées à l'administrateur sur le catalogue : activation, suppression, stock, validation, catégories.
// Plus tard : routes /api/admin/... vers Express. Le serveur devra vérifier que l'appelant est administrateur (NF02) :
// ici, n'importe qui peut appeler ces fonctions depuis la console du navigateur.

export class AdminError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function findProduct(catalogue, productId) {
  const product = catalogue.products.find((candidate) => candidate.id === Number(productId));
  if (!product) throw new AdminError('NOT_FOUND', 'Produit introuvable.');
  return product;
}

// Activer / désactiver un produit (F23) : un produit désactivé disparaît du catalogue sans être supprimé.
export async function setProductActive(productId, active) {
  await delay();
  updateCatalogue((catalogue) => {
    findProduct(catalogue, productId).active = Boolean(active);
  });
}

// Suppression, seulement si le produit n'apparaît dans aucune commande (F27) : l'historique doit rester lisible.
export async function deleteProduct(productId) {
  await delay();
  if (productHasOrders(Number(productId))) {
    throw new AdminError('HAS_ORDERS', 'Ce produit figure dans des commandes : désactivez-le au lieu de le supprimer.');
  }
  updateCatalogue((catalogue) => {
    findProduct(catalogue, productId);
    catalogue.products = catalogue.products.filter((product) => product.id !== Number(productId));
  });
}

export const REASON_MAX = 200;

// Ajustement de stock avec motif obligatoire ; chaque ajustement laisse une trace (F26, F27).
// delta : nombre positif (entrée) ou négatif (sortie). Le stock ne peut pas passer sous zéro.
export async function adjustStock(productId, delta, reason, adminId) {
  await delay();
  const amount = Number(delta);
  const cleanReason = String(reason ?? '').trim();
  if (!Number.isInteger(amount) || amount === 0) {
    throw new AdminError('DELTA', 'Saisissez une quantité entière différente de 0 (négative pour retirer du stock).');
  }
  if (!cleanReason || cleanReason.length > REASON_MAX) {
    throw new AdminError('REASON', `Le motif est obligatoire (${REASON_MAX} caractères maximum).`);
  }

  updateCatalogue((catalogue) => {
    const product = findProduct(catalogue, productId);
    if (product.stock + amount < 0) {
      throw new AdminError('DELTA', `Le stock ne peut pas être négatif (stock actuel : ${product.stock}).`);
    }
    const before = product.stock;
    product.stock = before + amount;
    catalogue.stockMovements.push({
      id: nextId(catalogue.stockMovements),
      productId: product.id,
      delta: amount,
      stockAfter: product.stock,
      reason: cleanReason,
      adminId,
      date: new Date().toISOString(),
    });
  });
}

export async function listStockMovements(productId) {
  await delay();
  return readCatalogue()
    .stockMovements.filter((movement) => movement.productId === Number(productId))
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Validation d'un produit proposé par un fournisseur (F31). Un refus doit être motivé.
export async function reviewProduct(productId, decision, reason = '') {
  await delay();
  const cleanReason = String(reason).trim();
  if (decision === 'refuse' && !cleanReason) {
    throw new AdminError('REASON', 'Indiquez le motif du refus.');
  }
  updateCatalogue((catalogue) => {
    const product = findProduct(catalogue, productId);
    if (decision === 'accept') {
      product.validationStatus = 'Accepté';
      delete product.refusalReason;
    } else {
      product.validationStatus = 'Refusé';
      product.refusalReason = cleanReason.slice(0, REASON_MAX);
    }
  });
}

// ---- Catégories (F22) ----
const CATEGORY_NAME_MAX = 60;

function checkCategoryName(catalogue, name, ignoredId = null) {
  const clean = String(name ?? '').trim();
  if (!clean || clean.length > CATEGORY_NAME_MAX) {
    throw new AdminError('NAME', `Le nom est obligatoire (${CATEGORY_NAME_MAX} caractères maximum).`);
  }
  const exists = catalogue.categories.some((category) => category.id !== ignoredId && category.name.toLowerCase() === clean.toLowerCase());
  if (exists) throw new AdminError('NAME', 'Une catégorie porte déjà ce nom.');
  return clean;
}

export async function listCategories() {
  await delay();
  return [...readCatalogue().categories];
}

export async function createCategory(name) {
  await delay();
  updateCatalogue((catalogue) => {
    const clean = checkCategoryName(catalogue, name);
    catalogue.categories.push({ id: nextId(catalogue.categories), name: clean, tagline: '', color: '#9fc9dd', active: true });
  });
}

export async function renameCategory(categoryId, name) {
  await delay();
  updateCatalogue((catalogue) => {
    const category = catalogue.categories.find((candidate) => candidate.id === categoryId);
    if (!category) throw new AdminError('NOT_FOUND', 'Catégorie introuvable.');
    category.name = checkCategoryName(catalogue, name, categoryId);
  });
}

export async function setCategoryActive(categoryId, active) {
  await delay();
  updateCatalogue((catalogue) => {
    const category = catalogue.categories.find((candidate) => candidate.id === categoryId);
    if (!category) throw new AdminError('NOT_FOUND', 'Catégorie introuvable.');
    category.active = Boolean(active);
  });
}
