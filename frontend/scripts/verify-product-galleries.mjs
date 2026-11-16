import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { baseProducts, categories, products } from '../src/features/catalogue/mockCatalogue.js';

// Vérification en mémoire : ne lit ni ne modifie les données du navigateur de Rezki.
assert.equal(products.length, 40);
assert.deepEqual(products.slice(0, 7), baseProducts.slice(0, 7));
const delivered = products.filter(product => product.galleryVersion);
if (process.argv.includes('--all')) assert.equal(delivered.length, 33);
let checkedFiles = 0;
for (const product of delivered) {
  assert.ok(product.description.trim(), `Description produit manquante : ${product.name}`);
  assert.equal(product.extraImages.length, 4, product.name);
  assert.equal(product.ambiance, null);
  assert.equal(product.blurredAmbiance, false);
  assert.equal(product.views360, null);
  const urls = [product.image, product.imageThumb];
  for (const image of product.extraImages) {
    assert.equal(image.afterMain, true);
    assert.equal(image.replacesMain, false);
    assert.ok(image.label.length > 0);
    urls.push(image.src, image.thumbSrc);
  }
  for (const url of urls) {
    assert.ok(url.startsWith('/produits/'));
    const path = fileURLToPath(new URL('../public' + url, import.meta.url));
    assert.ok(existsSync(path), path);
    checkedFiles += 1;
  }
}

const original = baseProducts.find(product => product.id === 8);
const latest = products.find(product => product.id === 8);
assert.ok(latest.galleryVersion, 'Rhinaris doit être livré avant ce contrôle.');

async function readSaved(saved, key) {
  const storage = new Map([['gsb.catalogue', JSON.stringify(saved)]]);
  globalThis.localStorage = {
    getItem: name => storage.get(name) ?? null,
    setItem: (name, value) => storage.set(name, value),
  };
  const { readCatalogue } = await import('../src/features/catalogue/catalogueStore.js?test=' + key);
  return readCatalogue();
}

const editedProduct = { ...structuredClone(original), stock: 17, priceHt: 12.34 };
const saved = {
  products: [editedProduct],
  categories: structuredClone(categories),
  stockMovements: [{ id: 1, productId: 8, quantity: -3, reason: 'Démonstration' }],
};
const migrated = await readSaved(saved, 'ancienne-photo');
assert.equal(migrated.products[0].image, latest.image);
assert.equal(migrated.products[0].stock, 17);
assert.equal(migrated.products[0].priceHt, 12.34);
assert.deepEqual(migrated.stockMovements, saved.stockMovements);

const custom = structuredClone(saved);
Object.assign(custom.products[0], {
  image: 'data:image/png;base64,photo-administrateur',
  imageThumb: latest.imageThumb,
  galleryVersion: latest.galleryVersion,
  format: 'Format personnalisé',
  description: 'Description personnalisée',
});
const preserved = await readSaved(custom, 'photo-personnalisee');
assert.equal(preserved.products[0].image, custom.products[0].image);
assert.equal(preserved.products[0].imageThumb, undefined);
assert.equal(preserved.products[0].format, 'Format personnalisé');
assert.equal(preserved.products[0].description, 'Description personnalisée');
assert.equal(preserved.products[0].stock, 17);
assert.equal(preserved.products[0].priceHt, 12.34);

// Remplacement d'une photo dans la session courante : la miniature doit suivre immédiatement.
const editStorage = new Map([['gsb.catalogue', JSON.stringify({
  products: [{ ...structuredClone(latest), stock: 17, priceHt: 12.34 }],
  categories: structuredClone(categories),
  stockMovements: structuredClone(saved.stockMovements),
})]]);
globalThis.localStorage = {
  getItem: name => editStorage.get(name) ?? null,
  setItem: (name, value) => editStorage.set(name, value),
};
const { getProductForEdit, updateProduct } = await import('../src/features/catalogue/productManagementService.js');
const beforeEdit = structuredClone(await getProductForEdit(latest.id));
const admin = { role: 'Administrateur' };
const unchanged = await updateProduct(latest.id, beforeEdit, admin);
assert.equal(unchanged.imageThumb, latest.imageThumb, 'La même photo conserve sa miniature.');
const withoutNewImage = await updateProduct(latest.id, { ...beforeEdit, image: undefined }, admin);
assert.equal(withoutNewImage.image, latest.image);
assert.equal(withoutNewImage.imageThumb, latest.imageThumb, 'Sans nouvelle photo, la miniature reste disponible.');
const uploadedImage = 'data:image/png;base64,aW1hZ2U=';
const replaced = await updateProduct(latest.id, { ...beforeEdit, image: uploadedImage }, admin);
assert.equal(replaced.image, uploadedImage);
assert.equal(replaced.imageThumb, undefined, 'La miniature livrée doit être invalidée sans rechargement.');
assert.equal(replaced.stock, 17);
assert.equal(replaced.priceHt, 12.34);
const persistedEdit = JSON.parse(editStorage.get('gsb.catalogue'));
assert.equal(persistedEdit.products[0].image, uploadedImage);
assert.equal(persistedEdit.products[0].imageThumb, undefined);
assert.equal(persistedEdit.products[0].stock, 17);
assert.equal(persistedEdit.products[0].priceHt, 12.34);
assert.deepEqual(persistedEdit.stockMovements, saved.stockMovements);
delete globalThis.localStorage;
console.log(JSON.stringify({ products: products.length, existingGalleriesPreserved: 7,
  newGalleriesChecked: delivered.length, checkedFiles, migrationPreservesEdits: true,
  photoReplacementInvalidatesThumbnail: true }));
