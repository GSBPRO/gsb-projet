// Calculs et affichage des prix, partagés par le catalogue, le panier et les commandes.
// Rappel : ces calculs servent à l'affichage. Le serveur refera les siens (RG07, RG20) :
// on ne fait jamais confiance à un prix calculé dans le navigateur.

// Prix TTC = prix HT + TVA, arrondi au centime (RG07).
// vatRate est un pourcentage : 20 pour 20 %.
export function priceWithTax(priceHt, vatRate) {
  return Math.round(priceHt * (1 + vatRate / 100) * 100) / 100;
}

// Intl.NumberFormat est fourni par le navigateur : « 12,5 » devient « 12,50 € ».
const euroFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export function formatPrice(amount) {
  return euroFormatter.format(amount);
}

// Taux de TVA à la française : 2.1 devient « 2,1 % ».
export function formatVatRate(vatRate) {
  return `${vatRate.toLocaleString('fr-FR')} %`;
}

// Montants d'une ligne (prix unitaire x quantité). Le TTC est le prix TTC unitaire (déjà arrondi) multiplié par
// la quantité : le total affiché est donc toujours égal au prix unitaire affiché x la quantité.
// L'arrondi final évite les erreurs de virgule flottante (0,1 + 0,2 donne 0,30000000000000004).
export function lineAmounts(priceHt, vatRate, quantity) {
  const ht = Math.round(priceHt * quantity * 100) / 100;
  const ttc = Math.round(priceWithTax(priceHt, vatRate) * quantity * 100) / 100;
  return { ht, vat: Math.round((ttc - ht) * 100) / 100, ttc };
}

// Totaux d'un panier à partir de lignes { priceHt, vatRate, quantity } : total HT, TVA par taux, total TTC.
// Les montants sont arrondis au centime à chaque addition (voir lineAmounts), donc HT + TVA = TTC toujours exact.
export function cartTotals(lines) {
  const round = (amount) => Math.round(amount * 100) / 100;
  let ht = 0;
  let ttc = 0;
  const vatByRate = new Map();

  for (const line of lines) {
    const amounts = lineAmounts(line.priceHt, line.vatRate, line.quantity);
    ht += amounts.ht;
    ttc += amounts.ttc;
    vatByRate.set(line.vatRate, (vatByRate.get(line.vatRate) ?? 0) + amounts.vat);
  }

  return {
    ht: round(ht),
    vat: round(ttc - ht),
    ttc: round(ttc),
    vatByRate: [...vatByRate]
      .map(([rate, amount]) => ({ rate, amount: round(amount) }))
      .sort((a, b) => a.rate - b.rate),
  };
}
