# Où on en est — front (mis à jour le 16/11/2026)

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
| 4 — visuels | 40 galeries de 5 visuels : 7 galeries existantes conservées, 2 séries antérieures réutilisées et 31 nouvelles séries intégrées ; WebP et miniatures de 240 px pour les nouvelles galeries | `features/catalogue/productGalleries.js`, `productGalleryData.js`, `public/produits/` |
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

**Visuels du catalogue — livraison du 16/11/2026** : chaque fiche possède maintenant cinq images. Les sept premières galeries restent identiques à celles fournies dans le projet. Rhinaris et Phytosun reprennent leurs séries déjà créées ; les 31 autres séries sont nouvelles. Les nouveaux visuels sont des reconstitutions par IA, pas des photographies officielles des fabricants. Les sources et les formats retenus sont recensés dans [`visuels-catalogue.json`](visuels-catalogue.json). Les 165 prompts des 33 séries intégrées sont versionnés dans [`visuels/prompts/`](visuels/prompts/) ; les prompts originaux des sept galeries historiques ne sont pas disponibles. Les originaux PNG et l’archive globale restent dans le dossier de livraison local ; la boutique utilise les WebP optimisés versionnés dans le dépôt. Les anciens fichiers sont conservés, mais leurs rotations 360° ne sont plus proposées sur les fiches dont l’emballage a changé.

Les formats et descriptions des nouvelles galeries correspondent aux produits représentés. Lors du chargement d’un ancien catalogue enregistré, seuls les anciens visuels livrés et les textes encore identiques aux valeurs initiales sont remplacés : les prix, stocks, mouvements et photos importées restent conservés. Une photo remplacée dans le formulaire invalide immédiatement son ancienne miniature.

Contrôles du 16/11 : 40 produits, sept premières galeries identiques aux données initiales, 330 fichiers WebP et miniatures vérifiés, migration et remplacement de photo contrôlés en mémoire, compilation Vite réussie et `npm audit` sans vulnérabilité détectée. Les fiches Paracétamol, Zyrtec, Pilbox, masques et CeraVe ont été vérifiées dans le navigateur ; le cadrage des images sur petit écran a été corrigé. La vérification complète sur trois navigateurs, Lighthouse et les parcours non concernés restent à faire. Vite signale toujours le module 3D de l’accueil au-dessus de 500 ko ; cette étape ne modifie pas ce module.

## Points à connaître
- **Démo seulement** : le catalogue modifié (produits, catégories, stock) et les commandes sont gardés dans le `localStorage` du navigateur ; les comptes et mots de passe modifiés restent **en mémoire** et reviennent à l'état initial à l'actualisation.
- **Sécurité** : tous les contrôles du front (rôle, propriétaire d'une commande, produits d'un fournisseur, stock, prix) se contournent depuis le navigateur. Le serveur devra refaire chacun d'eux (NF02, NF03, RG17) et stocker les mots de passe hachés (NF01).
- **Règles de gestion déjà codées côté front** : stock décrémenté une seule fois à la commande et remis si elle est annulée ; une commande annulée est définitive ; un produit présent dans une commande ne se supprime pas (il se désactive) ; un administrateur ne peut pas désactiver son propre compte.
- **Données fictives** : noms, prix, stocks et laboratoires des 40 produits sont inventés (`mockCatalogue.js`).

## À faire à la fin de chaque étape
`npm run build` et `npm audit`.

## Backend (Phase B) : pas commencé
Contrat d'API (`docs/API.md`), squelette Express, base MySQL (`database/schema.sql` pas encore exécuté), authentification serveur. Chaque `*Service.js` du front sera remplacé par des appels `fetch` vers l'API sans changer les composants.
