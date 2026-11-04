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
