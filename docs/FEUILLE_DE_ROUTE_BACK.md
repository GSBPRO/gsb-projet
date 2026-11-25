# Feuille de route — back-end GSB (Node.js + Express + MySQL)

Créée le 25/11/2026. Remise du projet : **31/12/2026**.
Référence : `docs/Cahier_des_charges_GSB.docx` (F01-F37, RG01-RG20, NF01-NF13) et les règles de `FRYDAY.md`.

Chaque étape est **petite et testable**. On ne passe à la suivante qu'après :
1. le test de l'étape réussi ;
2. `npm audit` sans vulnérabilité, et le serveur qui démarre sans erreur ;
3. un commit avec un message clair.

Pour chaque étape, on suit la méthode FRYDAY : ce qu'on fait et pourquoi → le code → l'explication → les failles évitées → le test → le message de commit.

---

## 0. Décisions validées (25/11/2026)

| Sujet | Choix | Pourquoi |
|---|---|---|
| Session | `express-session`, sessions stockées dans MySQL, cookie `HttpOnly` + `SameSite` | Déconnexion immédiate (F06), compte désactivé coupé tout de suite (RG03), aucun jeton lisible par le JavaScript |
| Accès aux données | `mysql2` + requêtes SQL écrites à la main, **toujours paramétrées** (`?`) | SQL maîtrisé et explicable, pas d'injection SQL, transactions claires (NF12) |
| Civilité | Nouvelle colonne `civilite` dans `UTILISATEUR` | Affichée pour tous les comptes |
| Profession | Reste dans `PROFESSIONNEL_SANTE` (professionnels uniquement) ; retirée du front pour admin et fournisseur | NF05 / RGPD : ne collecter que le nécessaire |
| Numéro RPPS / ADELI | Ajouté au formulaire admin de création de compte professionnel ; format et unicité vérifiés par le serveur | La base l'exige ; c'est ce qui prouve qu'on est un professionnel de santé |
| Emplacement | Dossier `backend/` à côté de `frontend/`, même dépôt | Cahier des charges §10 : un dépôt commun |

## Architecture imposée (cahier des charges §8 et NF10)

```
Navigateur (React)  →  routes  →  middlewares (connecté ? bon rôle ?)  →  contrôleurs  →  services  →  accès aux données (SQL)  →  MySQL
```

| Couche | Rôle | Ne fait JAMAIS |
|---|---|---|
| `routes/` | Associe une URL + une méthode HTTP à un contrôleur et à ses middlewares | De logique |
| `middlewares/` | Vérifie la session, le rôle, limite les tentatives, gère les erreurs | D'accès direct aux tables métier |
| `controllers/` | Lit la requête, valide les entrées, appelle le service, renvoie le JSON | De SQL |
| `services/` | Applique les règles de gestion (RG), ouvre les transactions | De lecture de `req` / `res` |
| `repositories/` | Exécute les requêtes SQL paramétrées | De règle métier |

---

## Phase 1 — Base de données

| # | Étape | Exigences | Test |
|---|---|---|---|
| 1.1 | Démarrer MySQL avec XAMPP (`C:\xampp`), créer la base `gsb`, importer `database/schema.sql` | Livrable « Base de données » | Les 13 tables existent (`SHOW TABLES`) |
| 1.2 | Script `database/migrations/001_ajustements.sql` pour mettre la base d'accord avec le front (voir la liste ci-dessous) | RG06, F26, F09 | Le script passe sans erreur et les nouvelles colonnes existent |
| 1.3 | Jeu de données de démo `database/seed.sql` : fournisseurs, catégories, les 40 produits du front, un compte de chaque rôle | Livrable « jeu de données », §13 | Les comptes et produits de démo sont présents |
| 1.4 | Mots de passe de démo hachés avec bcrypt par un petit script (jamais en clair dans le seed) | NF01 | La colonne `mot_de_passe_hash` commence par `$2b$` |
| 1.5 | Procédure d'export / restauration (`mysqldump` / import) écrite dans le README | NF13 | Exporter, vider la base, restaurer : les données reviennent |

**Écarts entre la base et le front, à corriger à l'étape 1.2 :**
- `UTILISATEUR` : ajouter `civilite` (Dr, M., Mme).
- `PRODUIT` : `CHECK (prix_ht >= 0)` laisse passer un prix nul, alors que RG06 exige un prix **positif** → passer à `> 0`.
- `PRODUIT` : le front affiche une marque et un format (« Flacon de 100 ml ») qui n'existent pas en base → ajouter `marque` et `format`.
- Galeries de 5 images : `PRODUIT` n'a qu'un seul `image_url` → nouvelle table `IMAGE_PRODUIT` (produit, chemin, miniature, libellé, ordre).
- `MOUVEMENT_STOCK` : le front garde qui a fait l'ajustement (traçabilité) → ajouter `id_utilisateur`.

## Phase 2 — Socle Express

| # | Étape | Exigences | Test |
|---|---|---|---|
| 2.1 | Créer `backend/` (`npm init`, Express), les dossiers de l'architecture, une route `GET /api/health` | NF10 | `GET /api/health` répond `{ "status": "ok" }` |
| 2.2 | `.env` (secrets) + `.env.example` (sans valeurs) + `.gitignore` | §8 : secrets hors de Git | `git status` ne montre jamais `.env` |
| 2.3 | Connexion MySQL avec un pool `mysql2` dans `config/database.js` | — | `/api/health` indique aussi que la base répond |
| 2.4 | Gestion d'erreurs centralisée : réponses JSON propres, aucun détail technique envoyé au navigateur | NF11 | Une route inexistante renvoie un 404 en JSON |
| 2.5 | Journal (logger) des erreurs et des actions admin, sans mot de passe ni secret | NF11 | Une erreur apparaît dans le journal, sans donnée sensible |
| 2.6 | Sécurité de base : `helmet` (en-têtes), taille maximale du JSON, CORS limité au front | §8 | Une requête venant d'une autre origine est refusée |
| 2.7 | Proxy Vite `/api` → Express : le front et l'API semblent sur la même adresse, ce qui permet `SameSite=Strict` | §8 | `fetch('/api/health')` depuis le front fonctionne |

## Phase 3 — Authentification et profil (le socle de sécurité)

| # | Étape | Exigences | Test |
|---|---|---|---|
| 3.1 | `express-session` + stockage des sessions dans MySQL ; cookie `HttpOnly`, `SameSite`, durée limitée | §8 | Après connexion, le cookie est invisible depuis la console JS (`document.cookie`) |
| 3.2 | `POST /api/auth/login` : bcrypt, compte actif obligatoire, **message neutre**, nouvel identifiant de session à la connexion (contre la fixation de session) | F03, RG03, NF01, NF04 | Bon mot de passe → 200 ; mauvais mot de passe ou e-mail inconnu → même message |
| 3.3 | Limitation des tentatives de connexion (`express-rate-limit`) | §8 | Au-delà de N essais → 429 « Trop de tentatives » |
| 3.4 | `GET /api/auth/me` et `POST /api/auth/logout` | F06 | Après déconnexion, `/me` renvoie 401 |
| 3.5 | Middlewares `requireAuth`, `requireRole(...)`, `requirePasswordChanged` | NF02, F04, F07, RG04 | Un professionnel qui appelle une route admin → 403 ; un mot de passe provisoire bloque tout sauf le changement |
| 3.6 | `PUT /api/auth/password` : ancien mot de passe obligatoire, règles de robustesse, nouveau hash | F04, NF01, NF03 | Ancien mot de passe faux → refus ; sinon `doit_changer_mdp` passe à faux |
| 3.7 | `GET` / `PUT /api/me` : seulement téléphone et profession (liste blanche) | F05, NF05 | Envoyer `type_compte` dans le corps ne change rien |
| 3.8 | **Front** : brancher `authService.js` ; ajouter l'état « vérification de la session » dans `AuthContext` et `ProtectedRoute` ; retirer le `sessionStorage` | F07 | Actualiser la page en étant connecté ne renvoie plus à `/connexion` |

À partir de la fin de la phase 3, **toutes** les routes métier passent par `requireAuth` + `requireRole`. L'identité vient de la session, jamais d'un `userId` envoyé par le navigateur.

## Phase 4 — Catalogue

| # | Étape | Exigences | Test |
|---|---|---|---|
| 4.1 | `GET /api/categories` (actives seulement) | F08 | Une catégorie désactivée n'apparaît pas |
| 4.2 | `GET /api/catalogue` avec recherche `q`, filtres `categorie` et `stock` ; seulement les produits actifs **et** acceptés **et** dans une catégorie active | F10, F11, F12, RG08 | Un produit « En attente » n'apparaît jamais |
| 4.3 | `GET /api/catalogue/:id` : fiche complète avec galerie ; prix TTC calculé par le serveur | F09, RG07 | Le TTC renvoyé = HT × (1 + TVA / 100), arrondi au centime |
| 4.4 | **Front** : brancher `productService.js` | — | Le catalogue s'affiche à partir de MySQL |

## Phase 5 — Panier

| # | Étape | Exigences | Test |
|---|---|---|---|
| 5.1 | `GET /api/cart` : le panier du professionnel connecté, avec les totaux HT, TVA et TTC calculés par le serveur | F15, RG10 | Les totaux concordent avec les lignes |
| 5.2 | `PUT /api/cart/items/:productId` (quantité) et `DELETE /api/cart/items/:productId` | F13, F14, RG08, RG09 | Quantité 0 ou négative → refus ; produit non vendable → refus |
| 5.3 | **Front** : brancher `cartService.js` | — | Le panier survit à une déconnexion / reconnexion |

## Phase 6 — Commande et paiement simulé (partie critique)

| # | Étape | Exigences | Test |
|---|---|---|---|
| 6.1 | Calcul des montants dans un module à part, avec des tests unitaires | RG07, RG20 | Les tests des calculs passent (arrondis au centime) |
| 6.2 | `POST /api/orders` dans **une seule transaction** : verrouiller les produits (`SELECT … FOR UPDATE`) → vérifier le stock → créer la commande avec une référence unique → copier libellé et prix dans chaque ligne → baisser le stock → écrire les mouvements de stock → enregistrer le paiement simulé → créer la livraison « En préparation » → historique du statut → vider le panier → `COMMIT` (ou `ROLLBACK` au moindre problème) | F16-F19, F34, NF12, RG11, RG12, RG17, RG18 | Stock suffisant → commande créée, stock baissé, panier vide ; stock insuffisant → rien n'est créé ni modifié |
| 6.3 | Aucune donnée de carte reçue ni stockée : le paiement simulé n'enregistre qu'un statut | F17, RG18 | La table `PAIEMENT_SIMULE` ne contient aucun numéro de carte |
| 6.4 | `GET /api/orders` et `GET /api/orders/:id` : seulement **ses** commandes | F20, RG13 | Demander la commande d'un autre professionnel → 404 |
| 6.5 | **Front** : brancher `orderService.js` ; afficher le statut de livraison | F37 | Confirmation et historique affichent la même référence |

## Phase 7 — Administration des comptes

| # | Étape | Exigences | Test |
|---|---|---|---|
| 7.1 | `GET /api/admin/users` (liste, filtres) | F21 | Seul un admin y accède |
| 7.2 | `POST /api/admin/users` : mot de passe provisoire haché, `doit_changer_mdp = vrai`, e-mail unique, RPPS / ADELI pour un professionnel, laboratoire pour un fournisseur | F01, RG01, RG02, NF01 | Le nouveau compte se connecte puis doit changer son mot de passe |
| 7.3 | `PUT /api/admin/users/:id` et activation / désactivation (pas son propre compte) | F21, RG03 | Un compte désactivé est déconnecté et ne peut plus se connecter |
| 7.4 | `DELETE /api/admin/users/:id` : seulement si aucune commande, sinon on propose la désactivation | F21, F27, RG19 | Un compte avec commandes ne peut pas être supprimé |
| 7.5 | **Front** : brancher `adminUserService.js` ; ajouter le champ RPPS / ADELI ; retirer la profession pour admin et fournisseur ; garder la civilité | Décisions du 25/11 | Le formulaire et l'API acceptent les mêmes champs |

## Phase 8 — Administration du catalogue et des stocks

| # | Étape | Exigences | Test |
|---|---|---|---|
| 8.1 | Catégories : ajouter, renommer, désactiver (pas de suppression si des produits y sont rattachés) | F22 | Une catégorie utilisée ne peut pas être supprimée |
| 8.2 | Produits : ajouter, modifier, activer / désactiver, supprimer seulement sans historique de commande | F23, F27, RG05, RG06, RG19 | Prix ≤ 0 ou TVA invalide → refus |
| 8.3 | Envoi d'images (`multer`) : types autorisés (webp, png, jpg), taille maximale, nom de fichier généré par le serveur | F29, NF03 | Un fichier `.exe` renommé en `.png` est refusé |
| 8.4 | Ajustement de stock avec motif, dans une transaction, avec trace de l'admin | F26, F33 | Le stock et le mouvement sont enregistrés ensemble |
| 8.5 | **Front** : brancher `adminCatalogueService.js` et `productManagementService.js` | — | Les écrans admin produits / catégories / stock fonctionnent |

## Phase 9 — Commandes et livraisons côté administrateur

| # | Étape | Exigences | Test |
|---|---|---|---|
| 9.1 | `GET /api/admin/orders` (filtres) et détail complet | F24 | L'admin voit toutes les commandes |
| 9.2 | Changement de statut : seulement les transitions autorisées, horodatées dans `HISTORIQUE_STATUT` | F25, RG16 | Une transition interdite est refusée |
| 9.3 | Annulation avant expédition : stock recrédité **une seule fois**, dans une transaction | F35, RG17 | Annuler deux fois ne recrédite qu'une fois |
| 9.4 | Statut de livraison : En préparation → Expédiée → Livrée | F36, F37 | Le professionnel voit le dernier statut enregistré |
| 9.5 | **Front** : brancher les écrans admin des commandes | — | Les statuts affichés correspondent à la base |

## Phase 10 — Espace fournisseur

| # | Étape | Exigences | Test |
|---|---|---|---|
| 10.1 | `GET /api/supplier/products` : seulement les produits de **son** laboratoire | F28, RG14 | Il ne voit jamais les produits d'un autre fournisseur |
| 10.2 | Proposer un produit avec image : statut « En attente » | F29, RG15 | Le produit n'apparaît pas dans le catalogue |
| 10.3 | Modifier ses produits ; une modification importante (prix, nom, description, image) le remet « En attente » | F30 | Après modification du prix, le produit disparaît du catalogue jusqu'à validation |
| 10.4 | Admin : accepter ou refuser une proposition | F31, F32 | Seul un produit accepté et actif devient visible |
| 10.5 | **Front** : brancher l'espace fournisseur et la page de validation admin | — | Le parcours complet fonctionne |

## Phase 11 — Tests (cahier des charges §11)

| # | Étape | Exigences | Test |
|---|---|---|---|
| 11.1 | Tests unitaires (`node:test`) : calculs, quantités, transitions de statut | §11 | `npm test` passe |
| 11.2 | Tests API (`supertest`) : connexion, accès interdit, commande, gestion de produit | §11, NF02 | Chaque route protégée refuse un rôle non autorisé |
| 11.3 | Les 8 scénarios de recette prioritaires du cahier des charges, joués à la main et notés | §11 | Tous les résultats sont conformes |
| 11.4 | Tests de sécurité : injection SQL, mots de passe, entrées invalides, routes protégées sans session | §11 | Aucune faille trouvée, ou bien corrigée |
| 11.5 | Navigateurs Chrome, Firefox et Edge ; temps de réponse < 3 s | NF06, NF09 | Les parcours principaux passent partout |

## Phase 12 — Finition et livraison

| # | Étape | Exigences |
|---|---|---|
| 12.1 | Supprimer les données fictives (`mock*.js`) du front une fois tout branché | OBJ06 |
| 12.2 | Revue sécurité + RGPD + qualité + accessibilité : ce qui est OK et ce qui reste à corriger | FRYDAY « fin de projet » |
| 12.3 | Registre des données personnelles complété (tableau ci-dessous) ; mentions légales et politique de confidentialité | NF05, RGPD |
| 12.4 | `npm audit` front et back ; dépendances à jour | FRYDAY |
| 12.5 | README : installation, `.env`, lancement, comptes de test, liste des routes, sauvegarde / restauration | Livrable « Documentation », NF13 |
| 12.6 | Lighthouse (performance, accessibilité, SEO, bonnes pratiques) | FRYDAY |
| 12.7 | Gantt et tableau GitHub Projects à jour | Livrable « Gestion de projet » |
| 12.8 | Scénario de démonstration + plan de secours local ; 10 questions du jury avec leurs réponses | §13, FRYDAY |

---

## Données personnelles (à compléter pendant les phases 3 et 7)

| Donnée | Pourquoi | Combien de temps | Qui y accède |
|---|---|---|---|
| E-mail | Identifiant de connexion | Tant que le compte existe | La personne, les admins |
| Nom, prénom, civilité | Affichage, commandes | Tant que le compte existe | La personne, les admins |
| Téléphone | Contact pour une commande | Tant que le compte existe | La personne, les admins |
| Profession, RPPS / ADELI (professionnels) | Prouver qu'on est un professionnel de santé | Tant que le compte existe | La personne, les admins |
| Adresse de livraison | Livraison (fictive) | Avec la commande — *à décider* | La personne, les admins |
| Session (identifiant) | Rester connecté | Durée de la session — *à décider* | Serveur uniquement |
| Journal (logs) | Erreurs et actions admin (NF11) | *À décider* | Les admins / l'équipe |

## Points encore ouverts

- Durées de conservation : sessions, journaux, comptes désactivés.
- Images : stockées sur le disque du serveur (recommandé) ou en base.
- Répartition des phases entre Kelian et Rezki, à reporter dans GitHub Projects.
- Branche de travail du back (une branche par phase, cahier des charges §10).

## Ordre et priorités

Le cahier des charges (§13) demande de faire d'abord le parcours **connexion → catalogue → panier → commande → administration**. Les phases 1 à 7 sont donc prioritaires. Les fonctions de priorité « Moyenne » (F05, F11, F26, F30, F32, F35, F36, F37) peuvent être finalisées après, si le temps manque.
