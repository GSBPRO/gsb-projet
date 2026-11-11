# Où on en est — front (mis à jour le 11/11/2026)

Le front tourne sur des **données fictives** (aucun back-end). Lancer : `cd frontend && npm install && npm run dev`, puis http://localhost:5173.
Compte de démonstration : voir `frontend/src/features/auth/mockUsers.js`.

Le détail des étapes prévues est dans [`FEUILLE_DE_ROUTE_CODE.md`](FEUILLE_DE_ROUTE_CODE.md). Le code est rangé par fonctionnalité (`frontend/src/features/…`, voir `frontend/src/README.md`).

## Fait

| Étape | Contenu | Où |
|---|---|---|
| 3 | Connexion, session, pages protégées, déconnexion | `features/auth/` |
| 2 (partiel) | En-tête, navigation, mise en page de l'espace professionnel | `features/layout/` |
| — | Accueil (fond animé, molécule 3D) et écran de chargement | `features/home/`, `features/loader/` |
| 4 | Catalogue : 40 produits fictifs, catégories (F08), recherche (F10), filtres et tri (F11), pleine largeur | `features/catalogue/` |
| 4 | Page produit `/catalogue/:id` : miniatures, vue 360°, prix HT / TVA / TTC, stock (F09) | `features/catalogue/ProductPage.jsx` |
| 5 | Panier complet : ajout depuis la fiche, quantités, suppression, totaux HT / TVA / TTC, contrôle de stock, vidage, compteur dans l'en-tête (F13 à F16) | `features/cart/` |
| 6 (début) | Socle des commandes : création avec prix figés, référence unique, liste, détail, statuts | `features/orders/orderService.js`, `orderStatus.js`, `useOrders.js` |
| 6 (début) | Page de validation `/commande` : adresse de livraison, paiement simulé (succès ou échec, sans donnée bancaire) | `features/orders/CheckoutPage.jsx` |

## Reste à faire

**Étape 6 — Commandes (en cours), prochaine à faire**
- [ ] Page de confirmation après paiement (aujourd'hui : page provisoire « Commande confirmée »), avec la référence (F18)
- [ ] Historique `/commandes` : liste de ses propres commandes (F20), état vide, badge de statut
- [ ] Détail `/commandes/:id` : lignes, totaux, adresse, statut ; une commande d'un autre compte donne « introuvable »
- [ ] Suivi de livraison fictif (F36, F37, moyenne) : prévu en dernier, à part

**Étape 7 — Espace personnel** : profil (F05), changement de mot de passe. `/compte` est encore une page « bientôt disponible ».
**Mot de passe à changer à la première connexion (F04, RG04)** : le champ `mustChangePassword` existe mais n'est pas utilisé.
**Étape 8 — Espace administrateur** : comptes, catégories, produits, stock, validation des produits, commandes.
**Étape 9 — Espace fournisseur** : ses produits, proposition de produit, statuts.
**Comptes de démonstration** : un seul compte (professionnel) ; il faut un administrateur et un fournisseur pour les étapes 8 et 9.
**Étape 10 — Qualité** : responsive complet, accessibilité clavier, tests Chrome / Firefox / Edge.

## Points à connaître
- **Design des produits** : les rendus 3D de `frontend/public/produits/` (40 produits, vue 360°) sont jugés peu réalistes et reprennent des noms de marques réelles (Doliprane, Nurofen…). À refaire avant la soutenance : images générées avec des packagings génériques, ou meilleurs rendus Blender. Rien de décidé.
- **Données fictives** : noms, prix, stocks et laboratoires des 40 produits sont inventés (`mockCatalogue.js`). Le stock ne baisse pas après une commande (pas de base de données).
- **Stockage navigateur** : le panier et les commandes sont dans le `localStorage`, un jeu par utilisateur (clés `gsb.cart.<id>`, `gsb.orders.<id>`). Pas de prix dans le panier ; les commandes gardent leurs prix figés.
- **Sécurité** : tous les contrôles du front (stock, prix, propriétaire d'une commande) se contournent depuis le navigateur. Le serveur devra refaire chaque contrôle (RG17 : stock décrémenté une seule fois).
- **Bouton « Ajouter au panier »** et **« Passer commande »** sont actifs ; le panier n'est pas encore relié au compte côté serveur.

## À faire à la fin de chaque étape
`npm run build` et `npm audit` (dernier passage : build OK, 0 vulnérabilité).

## Backend (Phase B) : pas commencé
Contrat d'API, squelette Express, base MySQL (`database/schema.sql` pas encore exécuté), authentification serveur.
