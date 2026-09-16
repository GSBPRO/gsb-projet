# GSB Projet — Plateforme e-commerce Galaxy Swiss Bourdin

Application web permettant au laboratoire pharmaceutique **GSB** de proposer à ses
professionnels de santé (médecins, pharmaciens...) un catalogue de médicaments,
un système de commande en ligne et un espace d'administration.

Sujet de labo : voir `docs/sujet.pdf` (à ajouter) — synthèse ci-dessous.

## Stack imposée

| Couche | Techno |
|---|---|
| Front-end | React |
| Back-end | Node.js + API REST |
| Base de données | SGBD relationnel (MCD/MLD/MPD — méthode Merise) |
| Gestion de projet | GitHub Issues + Projects |

## Calendrier

Début : 16 septembre 2026 — Remise : **31 décembre 2026** (3,5 mois).

## Feuille de route (6 phases)

Le détail de chaque phase (tâches, sous-tâches, critères de fin) est dans les
[Milestones](../../milestones) et les [Issues](../../issues) du dépôt. Ce découpage reprend
exactement celui du cahier des charges (section "Organisation du projet").

| # | Phase | Part | Échéance |
|---|---|---|---|
| 1 | Analyse | 15% | 02/10/2026 |
| 2 | Conception | 20% | 23/10/2026 |
| 3 | Développement du socle | 20% | 13/11/2026 |
| 4 | Développement métier | 25% | 09/12/2026 |
| 5 | Tests et corrections | 15% | 25/12/2026 |
| 6 | Livraison | 5% | 31/12/2026 |

### 1. Analyse
Recueillir les exigences et besoins.
- Rédiger / finaliser le cahier des charges (`docs/cahier-des-charges.md`)
- Lister les besoins fonctionnels et non fonctionnels
- Identifier les profils utilisateurs (professionnel de santé, fournisseur, administrateur)
- Définir les contraintes techniques et organisationnelles

### 2. Conception
Architecturer et maquettiser.
- Modèle Conceptuel de Données (MCD)
- Modèle Logique de Données (MLD)
- Modèle Physique de Données (MPD) + script SQL
- Maquettes des écrans principaux (catalogue, panier, admin)
- Architecture technique (arborescence front/back, routes API)
- Diagramme de Gantt

### 3. Développement du socle
Authentification, rôles, base MySQL, structure React/Express.
- Setup back-end Node.js + API, setup front-end React
- Authentification sécurisée
- Espace personnel

### 4. Développement métier
Catalogue, panier, commandes, administration, fournisseurs, recherche.
- Catalogue de médicaments, panier et commandes, historique
- Interface d'administration, gestion des fournisseurs
- Recherche et filtrage

### 5. Tests et corrections
Tests fonctionnels, sécurité, intégration, correction des anomalies.

### 6. Livraison
Jeu de données, documentation, démonstration, préparation de la soutenance.

## Fonctionnalités attendues (epics)

1. **Authentification sécurisée** — comptes créés uniquement par l'admin, changement de mot de passe obligatoire à la première connexion
2. **Espace personnel** — consultation/modification des infos utilisateur
3. **Catalogue de médicaments** — par catégories, fiche produit (nom, description, image, prix HT/TTC)
4. **Panier** — ajout/retrait, quantités, récapitulatif HT/TTC, validation → commande
5. **Historique des commandes** — liste + détail
6. **Interface d'administration** — CRUD comptes, CRUD produits, consultation des commandes
7. **Gestion des fournisseurs** — comptes dédiés pour ajouter/gérer leurs produits, sous contrôle admin
8. **Recherche et filtrage** — par catégorie, nom, etc.

## Livrables

- [ ] Code source complet (front + back + script BDD)
- [ ] Cahier des charges
- [ ] Modèles Merise (MCD, MLD, MPD)
- [ ] Diagramme de Gantt
- [ ] Démonstration de l'application

## Structure du dépôt (à venir)

```
docs/           cahier des charges, Merise, Gantt
backend/        API Node.js
frontend/       application React
database/       scripts SQL
```
