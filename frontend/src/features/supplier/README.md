# Espace fournisseur (`features/supplier`)

Un fournisseur propose et suit SES produits (F28 à F30, F32). Réservé au rôle **Fournisseur**.

| Fichier | Rôle |
|---|---|
| `SupplierProductsPage.jsx` | `/fournisseur/produits` : ses produits uniquement, avec le statut En attente / Accepté / Refusé et le motif d'un refus (F28, F32) |
| `SupplierProductFormPage.jsx` | `/fournisseur/produits/nouveau` (proposition avec image, F29) et `/:id` (modification, F30) |
| `SupplierPages.css` | styles de ces pages |

Le formulaire (`ProductForm`) et les services (`productManagementService.js`) sont dans `features/catalogue/` : l'administrateur s'en sert aussi.

## À savoir
- Une proposition est créée **En attente** et n'apparaît au catalogue qu'une fois acceptée par un administrateur (RG08).
- Modifier le nom, la description, le conditionnement, la catégorie, le prix, la TVA ou l'image remet le produit en attente (F30).
- Un fournisseur ne voit ni ne modifie les produits d'un autre : le service filtre sur son identifiant. **Le serveur devra refaire ce contrôle** (NF02).
- L'image est contrôlée (type, 3 Mo) puis réduite par le navigateur ; le serveur devra la contrôler aussi.
