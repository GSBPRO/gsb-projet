# Feuille de route — développement

Plan étape par étape pour passer de la conception au code. **On commence par le front**, avec des données fictives (mock) : l'interface est testable sans attendre l'API. Le back-end arrive ensuite et remplace les mocks sans toucher aux composants.

Principe : chaque étape se termine par quelque chose qui tourne dans le navigateur.

Références : [cahier des charges](Cahier_des_charges_GSB.docx), [MPD](MPD.md), [maquettes](maquettes/), [prototype](maquettes/GSB_Canva_Prototype_interactif.html).

---

## Phase A — Front-end (mock)

### Étape 0 — Mise en place du projet
- [ ] Compléter `gsb-front/package.json` : React, React DOM, `react-router-dom`, Vite (bundler et serveur de dev)
- [ ] Ajouter les scripts `dev`, `build`, `preview`
- [ ] Vérifier que la page d'accueil s'affiche avec `npm run dev`
- [ ] Convention de nommage : fichiers de composants en `PascalCase.jsx` (renommer `header.jsx`, `footer.jsx`, `sidebar.jsx`, `logo.jsx`, `badje.jsx`, `Empystate.jsx` → `Badge.jsx`, `EmptyState.jsx`, etc.) et `catégorie.js` → `categorie.js`

### Étape 1 — Design system
Objectif : des briques réutilisables avant les écrans.
- [ ] `styles/variable.css` : couleurs, espacements, typographie (reprendre la charte des maquettes)
- [ ] `styles/global.css` et `styles/responsive.css` : reset, mise en page, points de rupture mobile / tablette / ordinateur (NF07)
- [ ] `components/ui/` : `button`, `input`, `alert`, `badge`, `loader`, `modal`, `EmptyState`
- [ ] `components/common/ConfirmDialog.jsx` (réutilise `modal`)

### Étape 2 — Structure et navigation
- [ ] `layouts/PublicLayout.jsx` : header + contenu + footer, sans menu compte
- [ ] `layouts/ProfessionalLayout.jsx`, `SupplierLayout.jsx`, `AdminLayout.jsx` : header + sidebar selon le rôle
- [ ] `components/common/header.jsx`, `sidebar.jsx`, `footer.jsx`, `Breadcrumb.jsx`, `PageHeader.jsx`
- [ ] `routes/AppRouter.jsx` : toutes les routes déclarées, pages vides au début
- [ ] `routes/ProtectedRoute.jsx` : redirection vers la connexion si non connecté, et vers la bonne page si le rôle ne correspond pas (NF02, côté client)

### Étape 3 — Authentification (mock)
- [ ] `data/users.js` : 3 comptes fictifs (Professionnel, Fournisseur, Administrateur) dont un avec `doit_changer_mdp = true`
- [ ] `services/authService.js` : `login`, `logout`, `changePassword`, avec une latence simulée
- [ ] `context/AuthContext.jsx` : utilisateur courant, rôle, persistance de session (`sessionStorage`, pour la démo)
- [ ] Pages : connexion (F03), déconnexion (F06), changement de mot de passe obligatoire (F04, RG04). Tant que le mot de passe n'est pas changé, aucune autre page n'est accessible.
- [ ] Aucun lien d'inscription sur la page de connexion (F02)
- [ ] Messages d'erreur génériques, sans révéler si le compte existe (NF04)
- [ ] `utils/validators.js` : e-mail, mot de passe (règles de longueur et de complexité)

### Étape 4 — Catalogue (mock)
- [ ] `data/categorie.js`, `data/product.js` : catégories et produits fictifs (au moins 2 fournisseurs)
- [ ] `services/productService.js` : liste, détail, par catégorie
- [ ] Catalogue réservé aux utilisateurs connectés, redirection sinon (F07)
- [ ] Page catalogue : produits classés par catégorie (F08)
- [ ] Fiche produit : nom, description, image, prix HT, TVA, TTC, stock disponible (F09)
- [ ] `utils/formatPrice.js` : formatage en euros
- [ ] Recherche par nom ou partie du nom (F10), filtre par catégorie et disponibilité (F11, moyenne)
- [ ] N'afficher que les produits actifs et validés (F12)

### Étape 5 — Panier (mock)
- [ ] `context/CartContext.jsx` : ajout, retrait, quantité
- [ ] Panier : prix unitaires, totaux HT, TVA et TTC (F13, F14, F15)
- [ ] Contrôle du stock simulé avant validation (F16)
- [ ] Le panier reste en place d'une session à l'autre (persistance locale)

### Étape 6 — Commandes (mock)
- [ ] `services/orderService.js` : création, liste, détail
- [ ] `utils/orderStatus.js` : libellés et couleurs des statuts (En attente, Validée, Annulée)
- [ ] Parcours de validation : adresse de livraison, paiement simulé (succès ou échec, sans donnée bancaire, RG18)
- [ ] Référence unique et date sur chaque commande, identique dans la confirmation et l'historique (F18)
- [ ] Les prix sont figés dans les lignes de commande (F19)
- [ ] Historique et détail : seulement ses propres commandes (F20)
- [ ] Suivi de livraison fictif : En préparation, Expédiée, Livrée (F36, F37, moyenne)

### Étape 7 — Espace personnel
- [ ] Consultation et modification des informations autorisées du profil (F05, moyenne)
- [ ] Changement de mot de passe depuis le profil

### Étape 8 — Espace administrateur (mock)
- [ ] `services/stockService.js` : ajustement de stock avec motif, trace conservée (F26, F27)
- [ ] Gestion des comptes : création, modification, activation, désactivation (F01, F21)
- [ ] Gestion des catégories : ajout, renommage, désactivation (F22)
- [ ] Gestion des produits : ajout, modification, activation, désactivation, suppression sans historique (F23, F27)
- [ ] Validation ou refus des produits proposés par les fournisseurs (F31)
- [ ] Consultation de toutes les commandes avec filtre (F24) et mise à jour des statuts (F25)
- [ ] Stock disponible visible pour chaque produit (F33)

### Étape 9 — Espace fournisseur (mock)
- [ ] Liste de **ses** produits uniquement (F28), jamais ceux d'un autre fournisseur
- [ ] Proposition d'un produit avec informations et image, statut En attente (F29)
- [ ] Modification de ses produits ; une modification importante les remet en attente (F30, moyenne)
- [ ] Statut de chaque proposition : En attente, Accepté, Refusé (F32, moyenne)

### Étape 10 — Qualité du front
- [ ] Vérifier la responsivité sur ordinateur, tablette et smartphone (NF07)
- [ ] Libellés de formulaire, textes alternatifs, navigation au clavier (NF08)
- [ ] Test sur Chrome, Firefox et Edge (NF09)
- [ ] Validation côté client des formulaires (NF03, la validation serveur viendra avec l'API)

---

## Phase B — Back-end et branchement

Une fois le front validé sur mocks :

1. **Contrat d'API** : écrire la liste des routes (méthode, URL, entrée, sortie, rôle requis) dans `docs/API.md`. C'est le lien entre front et back.
2. **Squelette Express** : `backend/` avec routes, contrôleurs, services et accès aux données séparés (NF10).
3. **Base de données** : exécuter `database/schema.sql` sur un MySQL de test et ajouter un jeu de données de démonstration.
4. **Authentification serveur** : hachage des mots de passe, sessions ou JWT, middleware de rôle sur chaque route (NF01, NF02).
5. **Branchement** : remplacer le contenu de chaque `services/*.js` par des appels `fetch` vers l'API. Les composants ne changent pas.
6. **Journalisation** des erreurs et des opérations administratives, sans secret (NF11).

---

## Phase C — Tests et livraison

- [ ] Tests fonctionnels des parcours : connexion, panier, commande, administration, fournisseur
- [ ] Tests de sécurité : accès direct à une URL protégée, contrôle des rôles côté serveur, injection SQL
- [ ] Mesure des temps de réponse des pages principales (NF06, moins de 3 secondes)
- [ ] Jeu de données de démonstration et scénario de soutenance
- [ ] Documentation d'installation dans le README

---

## Ordre recommandé cette semaine

1. Étape 0 (projet qui démarre)
2. Étape 1 (design system)
3. Étape 2 (navigation)
4. Étape 3 (connexion, pour débloquer toutes les autres pages)
5. Étape 4 (catalogue, le premier écran visible par le client)

Une fois ces cinq étapes faites, le front a déjà une démonstration visible.
