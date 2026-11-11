# Espace administrateur (`features/admin`)

Tout ce que fait l'administrateur : commandes, produits, stock, validation, catégories et comptes (F01, F21 à F27, F31, F33).
Réservé au rôle **Administrateur** (`ProtectedRoute roles=…` dans `App.jsx`). Données fictives, en attendant l'API Express.

| Fichier | Rôle |
|---|---|
| `AdminOrdersPage.jsx` | `/admin/commandes` : toutes les commandes, filtre, changement de statut et de livraison (F24, F25, F36) |
| `AdminProductsPage.jsx` | `/admin/produits` : tous les produits avec leur stock, activer / désactiver, supprimer sans historique (F23, F27, F33) |
| `AdminProductFormPage.jsx` | `/admin/produits/nouveau` et `/admin/produits/:id` : création et modification (réutilise `catalogue/ProductForm`) |
| `StockPanel.jsx` | ajustement du stock avec motif et historique des mouvements (F26, F27) |
| `AdminValidationPage.jsx` | `/admin/validation` : accepter ou refuser (avec motif) les produits proposés par les fournisseurs (F31) |
| `AdminCategoriesPage.jsx` | `/admin/categories` : ajouter, renommer, désactiver (F22) |
| `AdminAccountsPage.jsx` + `UserForm.jsx` | `/admin/comptes` : créer, modifier, activer / désactiver un compte (F01, F21) |
| `adminCatalogueService.js` | stock, suppression, validation, catégories |
| `adminUserService.js` | comptes utilisateurs |
| `validationTones.js` | couleur de la pastille selon le statut de validation (aussi utilisé par `supplier`) |
| `AdminPages.css` | styles communs aux pages admin |

## À savoir
- **Tous ces contrôles se contournent depuis le navigateur** : le serveur devra vérifier le rôle sur chaque route (NF02) et refaire chaque validation.
- Un produit présent dans une commande ne peut pas être supprimé, seulement désactivé (F27).
- Une commande annulée est définitive et remet les produits en stock ; le stock baisse une seule fois, à la création de la commande (RG17).
- L'administrateur ne peut pas désactiver son propre compte.
- Les mots de passe provisoires sont en clair en démonstration seulement ; le serveur les stockera hachés (NF01).

## Données personnelles (RGPD)
| Donnée | Pourquoi | Combien de temps | Qui y accède |
|---|---|---|---|
| Nom, email, fonction des comptes | gérer les accès | tant que le compte existe (à définir avec le serveur) | administrateurs |
