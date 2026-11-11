# Commandes (`features/orders`)

Passer une commande depuis le panier (adresse de livraison, paiement simulé) et, plus tard, consulter son historique (F17 à F20).
Les commandes sont gardées dans le navigateur (`localStorage`), une liste par utilisateur. `orderService.js` sera branché sur l'API Express.

| Fichier | Rôle |
|---|---|
| `orderService.js` | crée une commande (contrôle de l'adresse, du panier et du stock, paiement simulé, prix figés, référence unique), liste et lit les commandes **de l'utilisateur connecté** |
| `orderStatus.js` | les statuts (En attente, Validée, Annulée) : libellé et couleur |
| `useOrders.js` | `useOrders()` (liste) et `useOrder(id)` (une commande), avec chargement / erreur / succès |
| `useCheckoutForm.js` | la logique de la page de validation : valeurs, erreurs, envoi, redirection |
| `CheckoutPage.jsx` + `.css` | la page `/commande` : récapitulatif, adresse, paiement simulé |
| `ConfirmationPage.jsx` + `.css` | `/commande/confirmation/:id` : la référence de la commande (F18) |
| `OrdersPage.jsx` | `/commandes` : l'historique de ses commandes (F20) |
| `OrderDetailPage.jsx` + `.css` | `/commandes/:id` : lignes, totaux, adresse, statut, suivi |
| `OrderStatusBadge.jsx` | la pastille de statut |
| `DeliveryTracking.jsx` + `.css` | le suivi de livraison fictif : En préparation, Expédiée, Livrée (F36, F37) |

L'administrateur lit et met à jour les commandes avec `listAllOrders` et `updateOrder` (voir `features/admin`).

## À savoir
- Le stock baisse à la création de la commande et remonte si l'administrateur l'annule (RG17).
- Les prix, le nom et la TVA de chaque ligne sont **figés** à l'achat : modifier un produit plus tard ne change pas les anciennes commandes (F19).
- Aucune donnée bancaire n'est demandée ni conservée, même en démonstration (RG18). Le « mode démonstration » permet seulement de simuler un échec.
- L'adresse est affichée en texte simple, jamais en HTML.
- Tous les contrôles ici (stock, prix, propriétaire) se contournent depuis le navigateur : **le serveur devra les refaire**, et décrémenter le stock une seule fois (RG17).

## Données personnelles (RGPD)
| Donnée | Pourquoi | Combien de temps | Qui y accède |
|---|---|---|---|
| Adresse de livraison | livrer et suivre la commande | tant que la commande existe (à définir avec le serveur) | l'utilisateur ; plus tard l'administrateur |
