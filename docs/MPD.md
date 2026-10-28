# Modèle Physique de Données (MPD) — GSB

Cible : **MySQL 8.0+**, moteur InnoDB, jeu de caractères `utf8mb4`.
Script de création : [`database/schema.sql`](../database/schema.sql).
Point de départ : le MLD de [`GSB_Dictionnaire_de_donnees.drawio`](GSB_Dictionnaire_de_donnees.drawio) (page 03).

## Correspondance MLD → MPD

| Élément du MLD | Traduction MySQL |
|---|---|
| Clé primaire (souligné) | `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY` (tables d'entité) ou clé composite (associations) |
| Clé étrangère (`#`) | `FOREIGN KEY` nommée `fk_*` |
| Unicité `[UQ]` | `UNIQUE` nommée `uq_*` |
| Facultatif | colonne `NULL` |
| `BOOLEAN` | `BOOLEAN` (`TINYINT(1)`) |
| `ENUM` | `ENUM(...)` aux valeurs du dictionnaire |
| Prix, TVA | `DECIMAL(10,2)` pour les montants, `DECIMAL(5,2)` pour les taux |

## Choix de conception

- **Prix TTC non stocké** dans `PRODUIT` : calculé à l'affichage (RG07).
- **Figement à l'achat** dans `LIGNE_COMMANDE` : nom, prix HT, TVA et prix TTC unitaires sont copiés. Une modification ultérieure du produit n'altère pas les commandes passées.
- **Un seul fournisseur par produit** : `PRODUIT.id_fournisseur NOT NULL`.
- **Rattachement fournisseur** : `UTILISATEUR.id_fournisseur` est obligatoire pour le rôle `Fournisseur` et `NULL` sinon. Garanti par la contrainte `ck_utilisateur_fournisseur`.
- **Un panier par professionnel** : `PANIER.id_professionnel` est unique.
- **Au plus un paiement et une livraison par commande** : `uq_paiement_commande` et `uq_livraison_commande`.
- **Mot de passe** : colonne `mot_de_passe_hash` uniquement, jamais de mot de passe en clair (NF01).
- **Suppressions** : les produits et catégories utilisés ne peuvent pas être supprimés (`ON DELETE RESTRICT`). Les `actif` servent à désactiver (F21, F23). Les paniers et lignes de panier suivent le compte (`CASCADE`).

## Contraintes non exprimées en SQL

Ces règles sont à contrôler dans l'application, dans une transaction :

- Une commande contient **au moins une ligne**.
- Chaque **laboratoire a au moins un compte** Fournisseur : créer le fournisseur et son premier compte dans la même transaction.
- Un compte Fournisseur **ne gère que les produits de son laboratoire** (contrôle des droits par `id_fournisseur`).
- Le **stock ne se décrémente qu'une fois** par commande (RG17) et le total de commande correspond à la somme des lignes.

## Vérification

Le script n'a pas encore été exécuté sur un serveur MySQL. À faire avant la remise :

```bash
mysql -u root -p < database/schema.sql
```
