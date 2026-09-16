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
| Gestion de projet | GitHub Issues + Projects (remplace Trello/Jira) |

## Feuille de route (4 phases)

Le détail de chaque phase (tâches, sous-tâches, critères de fin) est dans les
[Milestones](../../milestones) et les [Issues](../../issues) du dépôt.

### 1. Analyse
Recueillir les exigences et besoins.
- Rédiger / finaliser le cahier des charges (`docs/cahier-des-charges.md`)
- Lister les besoins fonctionnels et non fonctionnels
- Identifier les profils utilisateurs (visiteur médical, pharmacien/médecin, fournisseur, administrateur)
- Définir les contraintes techniques et organisationnelles

### 2. Conception
Architecturer et maquettiser.
- Modèle Conceptuel de Données (MCD)
- Modèle Logique de Données (MLD)
- Modèle Physique de Données (MPD) + script SQL
- Maquettes des écrans principaux (catalogue, panier, admin)
- Architecture technique (arborescence front/back, routes API)
- Diagramme de Gantt

### 3. Développement
Coder, tester, intégrer.
- Back-end : API Node.js (auth, produits, panier, commandes, administration, fournisseurs)
- Front-end : React (catalogue, panier, espace perso, admin)
- Base de données : mise en place du schéma + jeu de données de test
- Tests fonctionnels

### 4. Production
Déployer et surveiller.
- Déploiement de l'application
- Démonstration fonctionnelle
- Documentation finale et livrables

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
