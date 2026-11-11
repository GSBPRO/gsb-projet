# Où on en est — front (mis à jour le 11/11/2026)

Le front tourne sur des **données fictives** (aucun back-end). Lancer : `cd frontend && npm install && npm run dev`, puis http://localhost:5173.

Comptes de démonstration (un par profil, voir `frontend/src/features/auth/mockUsers.js`) :

| Profil | Email | Mot de passe |
|---|---|---|
| Professionnel | lina.martin@gsb-demo.fr | Demo2026! |
| Professionnel (1re connexion : doit changer son mot de passe) | paul.durand@gsb-demo.fr | Premiere2026! |
| Fournisseur (Laboratoire Aster) | marc.dubois@aster-demo.fr | Fournisseur2026! |
| Administrateur | admin@gsb-demo.fr | Admin2026! |

Le détail des étapes prévues est dans [`FEUILLE_DE_ROUTE_CODE.md`](FEUILLE_DE_ROUTE_CODE.md). Le code est rangé par fonctionnalité (`frontend/src/features/…`, voir `frontend/src/README.md`).

## Fait

| Étape | Contenu | Où |
|---|---|---|
| 3 | Connexion, session, pages protégées par rôle, déconnexion, changement de mot de passe obligatoire à la 1re connexion (F04, RG04) | `features/auth/` |
| 2 | En-tête et navigation adaptés au profil | `features/layout/` |
| — | Accueil (fond animé, molécule 3D) et écran de chargement | `features/home/`, `features/loader/` |
| 4 | Catalogue : catégories, recherche, filtres, tri, page produit (F08 à F12) | `features/catalogue/` |
| 5 | Panier complet (F13 à F16) | `features/cart/` |
| 6 | Commandes : validation, confirmation avec référence (F18), historique (F20), détail, suivi de livraison fictif (F36, F37) | `features/orders/` |
| 7 | Mon compte : profil (F05) et changement de mot de passe | `features/account/` |
| 8 | Espace administrateur : commandes et statuts (F24, F25), produits et stock visible (F23, F33), ajustement de stock motivé avec historique (F26, F27), validation des produits (F31), catégories (F22), comptes (F01, F21) | `features/admin/` |
| 9 | Espace fournisseur : ses produits (F28), proposition avec image (F29), modification qui remet en attente (F30), statuts (F32) | `features/supplier/` |

## Reste à faire

**Étape 10 — Qualité** (à faire à la main, voir aussi les points de sécurité ci-dessous)
- [ ] Tester sur Chrome, Firefox et Edge (NF09)
- [ ] Vérifier l'affichage sur smartphone et tablette sur chaque nouvelle page (NF07)
- [ ] Passer la navigation au clavier sur les nouvelles pages (NF08)
- [ ] Lighthouse, mentions légales, politique de confidentialité, bandeau cookies (voir `FRYDAY.md`, fin de projet)

**Design des produits** : les rendus 3D de `frontend/public/produits/` sont jugés peu réalistes et reprennent des noms de marques réelles (Doliprane, Nurofen…). À refaire avant la soutenance. Rien de décidé.

## Points à connaître
- **Démo seulement** : le catalogue modifié (produits, catégories, stock) et les commandes sont gardés dans le `localStorage` du navigateur ; les comptes et mots de passe modifiés restent **en mémoire** et reviennent à l'état initial à l'actualisation.
- **Sécurité** : tous les contrôles du front (rôle, propriétaire d'une commande, produits d'un fournisseur, stock, prix) se contournent depuis le navigateur. Le serveur devra refaire chacun d'eux (NF02, NF03, RG17) et stocker les mots de passe hachés (NF01).
- **Règles de gestion déjà codées côté front** : stock décrémenté une seule fois à la commande et remis si elle est annulée ; une commande annulée est définitive ; un produit présent dans une commande ne se supprime pas (il se désactive) ; un administrateur ne peut pas désactiver son propre compte.
- **Données fictives** : noms, prix, stocks et laboratoires des 40 produits sont inventés (`mockCatalogue.js`).

## À faire à la fin de chaque étape
`npm run build` et `npm audit`.

## Backend (Phase B) : pas commencé
Contrat d'API (`docs/API.md`), squelette Express, base MySQL (`database/schema.sql` pas encore exécuté), authentification serveur. Chaque `*Service.js` du front sera remplacé par des appels `fetch` vers l'API sans changer les composants.
