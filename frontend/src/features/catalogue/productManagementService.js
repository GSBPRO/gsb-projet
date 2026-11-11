import { delay } from '../../mocks/delay.js';
import { laboratories, nextId, readCatalogue, updateCatalogue } from './catalogueStore.js';
import { isAcceptedImage } from './imageUpload.js';

// Création, modification et lecture de TOUS les produits (même cachés ou en attente), pour l'administrateur
// et pour les fournisseurs. Les fonctions réservées à l'administrateur (stock, suppression, validation)
// sont dans features/admin/adminCatalogueService.js.
// Plus tard : routes /api/products vers Express. Le serveur devra vérifier le rôle ET que le fournisseur
// ne touche qu'à SES produits (NF02) : ici, ce contrôle se contourne depuis le navigateur.

export const VAT_RATES = [2.1, 5.5, 10, 20];
export const LIMITS = { name: 120, format: 80, description: 1000, stock: 100000, priceHt: 100000 };

// Erreur avec un code et, pour VALIDATION, la liste des erreurs par champ.
export class ProductError extends Error {
  constructor(code, message, fields = {}) {
    super(message);
    this.code = code;
    this.fields = fields;
  }
}

// Contrôle les champs d'un produit. Renvoie un objet { champ: message } (vide si tout va bien).
export function validateProduct(input, { requireImage, validateStock }) {
  const found = {};
  const text = (value) => String(value ?? '').trim();
  const { categories } = readCatalogue();

  if (!text(input.name)) found.name = 'Saisissez le nom du produit.';
  else if (text(input.name).length > LIMITS.name) found.name = `${LIMITS.name} caractères maximum.`;
  if (!text(input.format)) found.format = 'Saisissez le conditionnement (ex. : Boîte de 16 comprimés).';
  else if (text(input.format).length > LIMITS.format) found.format = `${LIMITS.format} caractères maximum.`;
  if (!text(input.description)) found.description = 'Saisissez une description.';
  else if (text(input.description).length > LIMITS.description) found.description = `${LIMITS.description} caractères maximum.`;
  if (!categories.some((category) => category.id === Number(input.categoryId))) found.categoryId = 'Choisissez une catégorie.';

  const price = Number(input.priceHt);
  if (!Number.isFinite(price) || price <= 0 || price > LIMITS.priceHt) found.priceHt = 'Saisissez un prix HT supérieur à 0.';
  if (!VAT_RATES.includes(Number(input.vatRate))) found.vatRate = 'Choisissez un taux de TVA.';

  if (validateStock) {
    const stock = Number(input.stock);
    if (!Number.isInteger(stock) || stock < 0 || stock > LIMITS.stock) found.stock = 'Saisissez un stock entier, 0 ou plus.';
  }
  if (requireImage && !input.image) found.image = 'Ajoutez une image du produit.';
  if (input.image && !isAcceptedImage(input.image)) found.image = 'Image invalide.';
  return found;
}

// Copie propre : seuls les champs connus sont retenus (pas de champ glissé en plus).
function cleanFields(input) {
  return {
    name: String(input.name).trim(),
    format: String(input.format).trim(),
    description: String(input.description).trim(),
    categoryId: Number(input.categoryId),
    priceHt: Math.round(Number(input.priceHt) * 100) / 100,
    vatRate: Number(input.vatRate),
    image: input.image || undefined,
  };
}

export async function listAllProducts() {
  await delay();
  const { products, categories } = readCatalogue();
  return { products: [...products], categories, laboratories };
}

export async function getProductForEdit(productId) {
  await delay();
  return readCatalogue().products.find((product) => product.id === Number(productId)) ?? null;
}

// Création. Un administrateur crée un produit directement accepté ; la proposition d'un fournisseur
// attend la validation de l'administrateur (F29, RG08). « actor » dit qui agit : { role, supplierId }.
export async function createProduct(input, actor) {
  await delay();
  const isAdmin = actor.role === 'Administrateur';
  const fields = validateProduct(input, { requireImage: !isAdmin, validateStock: true });
  if (Object.keys(fields).length > 0) throw new ProductError('VALIDATION', 'Le formulaire contient des erreurs.', fields);

  const laboratoryId = isAdmin ? Number(input.laboratoryId) : actor.supplierId;
  if (!laboratories.some((laboratory) => laboratory.id === laboratoryId)) {
    throw new ProductError('VALIDATION', 'Fournisseur invalide.', { laboratoryId: 'Choisissez un fournisseur.' });
  }

  let created;
  updateCatalogue((catalogue) => {
    created = {
      id: nextId(catalogue.products),
      ...cleanFields(input),
      laboratoryId,
      stock: Number(input.stock),
      active: true,
      validationStatus: isAdmin ? 'Accepté' : 'En attente',
    };
    catalogue.products.push(created);
  });
  return created;
}

// Modification. Un fournisseur ne modifie que SES produits ; une modification importante (nom, description,
// conditionnement, catégorie, prix, TVA, image) remet le produit en attente de validation (F30, RG08).
export async function updateProduct(productId, input, actor) {
  await delay();
  const isAdmin = actor.role === 'Administrateur';
  const fields = validateProduct(input, { requireImage: false, validateStock: false });
  if (Object.keys(fields).length > 0) throw new ProductError('VALIDATION', 'Le formulaire contient des erreurs.', fields);

  let updated = null;
  updateCatalogue((catalogue) => {
    const product = catalogue.products.find((candidate) => candidate.id === Number(productId));
    // Produit d'un autre fournisseur = même réponse qu'un produit inexistant.
    if (!product || (!isAdmin && product.laboratoryId !== actor.supplierId)) return;

    const next = cleanFields(input);
    const isMajorChange = Object.keys(next).some((key) => key !== 'image' && next[key] !== product[key]) || (next.image && next.image !== product.image);
    Object.assign(product, next, { image: next.image ?? product.image });
    if (isAdmin && input.laboratoryId) product.laboratoryId = Number(input.laboratoryId);
    if (!isAdmin && isMajorChange) {
      product.validationStatus = 'En attente';
      delete product.refusalReason;
    }
    updated = { ...product };
  });
  if (!updated) throw new ProductError('NOT_FOUND', 'Produit introuvable.');
  return updated;
}

// Les produits d'UN fournisseur (F28) : jamais ceux d'un autre.
export async function listSupplierProducts(supplierId) {
  await delay();
  const { products, categories } = readCatalogue();
  return { products: products.filter((product) => product.laboratoryId === supplierId), categories };
}
