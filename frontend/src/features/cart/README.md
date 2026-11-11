# Panier (`features/cart`)

Le panier du professionnel connecté : ajout depuis la fiche produit, quantités, suppression, totaux HT / TVA / TTC
et contrôle de stock avant validation (F13 à F16).
Il est gardé dans le navigateur (`localStorage`), un panier par utilisateur. `cartService.js` sera branché sur l'API Express.

| Fichier | Rôle |
|---|---|
| `cartService.js` | lit et écrit le panier (clé `gsb.cart.<id>`), nettoie les données lues, contrôle de stock simulé |
| `CartContext.jsx` | `CartProvider` : l'état du panier et ses actions (`addItem`, `setQuantity`, `removeItem`, `clear`, `replaceItems`) |
| `useCart.js` | raccourci pour lire le panier dans un composant |
| `CartPage.jsx` + `.css` | la page `/panier` : associe les lignes aux produits du catalogue, calcule les totaux, gère chargement / erreur / vide |
| `CartLine.jsx` + `.css` | une ligne : image, prix unitaire, quantité, total, suppression, avertissement de stock |
| `CartSummary.jsx` + `.css` | le récapitulatif : totaux, alerte de stock, « Passer commande » (inactif pour l'instant), « Vider le panier » avec confirmation |

## À savoir
- On ne stocke que `{ productId, quantity }` : **jamais de prix**. Prix et stock sont relus dans le catalogue à chaque affichage.
- Le contenu du navigateur est modifiable par l'utilisateur : `cartService.js` ne garde que les lignes valides (ids entiers, quantités de 1 à 99).
- Le contrôle de stock et les prix affichés servent à l'interface. **Le serveur devra refaire ses propres calculs et contrôles** au moment de la commande.
- Les calculs de prix sont dans `src/utils/price.js` (`lineAmounts`, `cartTotals`), partagés avec les futures commandes.
