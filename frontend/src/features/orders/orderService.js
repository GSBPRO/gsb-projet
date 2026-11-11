import { delay } from '../../mocks/delay.js';
import { cartTotals, priceWithTax } from '../../utils/price.js';
import { getCatalogue } from '../catalogue/productService.js';
import { MAX_QUANTITY } from '../cart/cartService.js';

// Les commandes sont gardées dans le navigateur, une liste par utilisateur (démonstration, sans serveur).
// Plus tard : POST /api/orders et GET /api/orders vers Express. Les composants n'auront pas à changer.
// Rappel : tout ce qui est contrôlé ici (stock, prix, propriétaire) se contourne depuis le navigateur.
// Le serveur devra refaire chaque contrôle : prix recalculés, stock décrémenté une seule fois (RG17), droits d'accès.

export const ADDRESS_MIN = 10;
export const ADDRESS_MAX = 255; // même limite que COMMANDE.adresse_livraison dans schema.sql

// Erreur avec un code : l'interface choisit son message selon le code, sans lire le texte.
// ADDRESS : adresse invalide, EMPTY : panier vide, STOCK : stock insuffisant, PAYMENT : paiement refusé.
export class OrderError extends Error {
  constructor(code, message, details = []) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

function storageKey(userId) {
  return `gsb.orders.${userId}`;
}

// Le stockage est modifiable par l'utilisateur : on ne garde que ce qui a la bonne forme.
function isValidOrder(order) {
  return (
    order &&
    Number.isInteger(order.id) &&
    typeof order.reference === 'string' &&
    typeof order.date === 'string' &&
    typeof order.status === 'string' &&
    typeof order.deliveryAddress === 'string' &&
    Array.isArray(order.lines) &&
    order.totals &&
    typeof order.totals.ttc === 'number'
  );
}

function readOrders(userId) {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey(userId)));
    return Array.isArray(raw) ? raw.filter(isValidOrder) : [];
  } catch {
    // Stockage indisponible ou illisible : aucune commande.
    return [];
  }
}

function writeOrders(userId, orders) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(orders));
  } catch {
    // Stockage indisponible : la commande est créée mais ne survivra pas à une actualisation.
  }
}

// Référence du type GSB-20261111-K7M2QX. Alphabet sans caractères qu'on confond (O/0, I/1, L).
const REFERENCE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function generateReference(date, existingReferences) {
  const day = date.toISOString().slice(0, 10).replaceAll('-', '');
  let reference;
  do {
    // crypto.getRandomValues : aléatoire de meilleure qualité que Math.random.
    const random = crypto.getRandomValues(new Uint8Array(6));
    const suffix = [...random].map((value) => REFERENCE_ALPHABET[value % REFERENCE_ALPHABET.length]).join('');
    reference = `GSB-${day}-${suffix}`;
  } while (existingReferences.has(reference));
  return reference;
}

// Crée une commande : contrôle l'adresse, le panier et le stock, simule le paiement, puis enregistre.
// items : [{ productId, quantity }] (le contenu du panier). Les prix et le stock sont relus dans le catalogue :
// on ne fait jamais confiance à un prix venu du panier ou du navigateur.
// simulateFailure : mode démonstration, le paiement simulé échoue et AUCUNE commande n'est créée.
export async function createOrder(userId, { items, address, simulateFailure = false }) {
  await delay();

  const deliveryAddress = String(address ?? '').trim();
  if (deliveryAddress.length < ADDRESS_MIN || deliveryAddress.length > ADDRESS_MAX) {
    throw new OrderError('ADDRESS', `L’adresse de livraison doit faire entre ${ADDRESS_MIN} et ${ADDRESS_MAX} caractères.`);
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new OrderError('EMPTY', 'Votre panier est vide.');
  }

  const { products } = await getCatalogue();
  const lines = [];
  const stockIssues = [];

  for (const item of items) {
    const product = products.find((candidate) => candidate.id === item.productId);
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new OrderError('EMPTY', 'Votre panier contient un produit ou une quantité invalide.');
    }
    if (quantity > product.stock) {
      stockIssues.push({ productId: product.id, name: product.name, available: product.stock });
    }
    // Les prix sont figés ici, à la date d'achat (F19) : même nom et mêmes prix pour toujours, quoi qu'il arrive au produit.
    lines.push({
      productId: product.id,
      name: product.name,
      format: product.format,
      quantity,
      priceHt: product.priceHt,
      vatRate: product.vatRate,
      priceTtc: priceWithTax(product.priceHt, product.vatRate),
    });
  }

  if (stockIssues.length > 0) {
    throw new OrderError('STOCK', 'Le stock ne couvre plus toute votre commande.', stockIssues);
  }

  // Paiement simulé : aucune donnée bancaire n'est demandée ni stockée (RG18).
  if (simulateFailure) {
    throw new OrderError('PAYMENT', 'Le paiement simulé a échoué : aucune commande n’a été créée.');
  }

  const orders = readOrders(userId);
  const now = new Date();
  const order = {
    id: orders.reduce((max, existing) => Math.max(max, existing.id), 0) + 1,
    reference: generateReference(now, new Set(orders.map((existing) => existing.reference))),
    date: now.toISOString(),
    status: 'En attente',
    deliveryAddress,
    lines,
    totals: cartTotals(lines),
  };

  writeOrders(userId, [...orders, order]);
  return order;
}

// Les commandes de CET utilisateur, la plus récente en premier (F20).
export async function listOrders(userId) {
  await delay();
  return readOrders(userId).sort((a, b) => b.date.localeCompare(a.date));
}

// Une commande par son numéro, seulement si elle appartient à cet utilisateur (F20).
// Une commande d'un autre compte donne le même résultat qu'un numéro qui n'existe pas : null.
export async function getOrder(userId, orderId) {
  await delay();
  return readOrders(userId).find((order) => order.id === Number(orderId)) ?? null;
}
