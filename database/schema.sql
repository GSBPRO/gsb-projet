-- ============================================================================
-- GSB — Plateforme e-commerce Galaxy Swiss Bourdin
-- Modèle Physique de Données (MPD) — MySQL 8.0+
-- Dérivé du MLD (docs/GSB_Dictionnaire_de_donnees.drawio, page 03 — MLD)
-- 13 tables. Moteur InnoDB, jeu de caractères utf8mb4.
-- ============================================================================

DROP DATABASE IF EXISTS gsb;
CREATE DATABASE gsb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gsb;

-- ----------------------------------------------------------------------------
-- 1. FOURNISSEUR (laboratoire)
-- ----------------------------------------------------------------------------
CREATE TABLE FOURNISSEUR (
    id_fournisseur  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    raison_sociale  VARCHAR(150) NOT NULL,
    email_contact   VARCHAR(255) NOT NULL,
    telephone       VARCHAR(20),
    adresse         VARCHAR(255),
    actif           BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_fournisseur_email UNIQUE (email_contact)
) ENGINE = InnoDB;

-- ----------------------------------------------------------------------------
-- 2. UTILISATEUR (compte de connexion)
--    id_fournisseur : obligatoire pour le rôle Fournisseur, NULL sinon.
-- ----------------------------------------------------------------------------
CREATE TABLE UTILISATEUR (
    id_utilisateur     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email              VARCHAR(255) NOT NULL,
    mot_de_passe_hash  VARCHAR(255) NOT NULL,            -- jamais de mot de passe en clair (NF01)
    nom                VARCHAR(100) NOT NULL,
    prenom             VARCHAR(100) NOT NULL,
    telephone          VARCHAR(20),
    type_compte        ENUM('Professionnel', 'Administrateur', 'Fournisseur') NOT NULL,
    actif              BOOLEAN NOT NULL DEFAULT TRUE,
    doit_changer_mdp   BOOLEAN NOT NULL DEFAULT TRUE,    -- mot de passe temporaire (F04)
    date_creation      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_fournisseur     BIGINT UNSIGNED NULL,
    CONSTRAINT uq_utilisateur_email UNIQUE (email),
    CONSTRAINT fk_utilisateur_fournisseur
        FOREIGN KEY (id_fournisseur) REFERENCES FOURNISSEUR (id_fournisseur)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    -- Fournisseur <=> id_fournisseur renseigné (RG01, contrainte MLD)
    CONSTRAINT ck_utilisateur_fournisseur
        CHECK ((type_compte = 'Fournisseur') = (id_fournisseur IS NOT NULL))
) ENGINE = InnoDB;

CREATE INDEX idx_utilisateur_fournisseur ON UTILISATEUR (id_fournisseur);

-- ----------------------------------------------------------------------------
-- 3. PROFESSIONNEL_SANTE (profil lié à un compte Professionnel)
-- ----------------------------------------------------------------------------
CREATE TABLE PROFESSIONNEL_SANTE (
    id_professionnel      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur        BIGINT UNSIGNED NOT NULL,
    type_profession       VARCHAR(100) NOT NULL,         -- médecin, pharmacien, etc.
    numero_professionnel  VARCHAR(50) NOT NULL,          -- RPPS, ADELI...
    adresse               VARCHAR(255),
    ville                 VARCHAR(100),
    code_postal           VARCHAR(10),
    CONSTRAINT uq_professionnel_utilisateur UNIQUE (id_utilisateur),
    CONSTRAINT uq_professionnel_numero UNIQUE (numero_professionnel),
    CONSTRAINT fk_professionnel_utilisateur
        FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR (id_utilisateur)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ----------------------------------------------------------------------------
-- 4. CATEGORIE
-- ----------------------------------------------------------------------------
CREATE TABLE CATEGORIE (
    id_categorie  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(100) NOT NULL,
    description   TEXT,
    actif         BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_categorie_nom UNIQUE (nom)
) ENGINE = InnoDB;

-- ----------------------------------------------------------------------------
-- 5. PRODUIT
--    Un produit a exactement un fournisseur (NOT NULL) et une catégorie.
--    Le prix TTC n'est pas stocké : il est calculé à l'affichage (RG07).
-- ----------------------------------------------------------------------------
CREATE TABLE PRODUIT (
    id_produit          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_categorie        BIGINT UNSIGNED NOT NULL,
    id_fournisseur      BIGINT UNSIGNED NOT NULL,
    nom                 VARCHAR(150) NOT NULL,
    description         TEXT,
    image_url           VARCHAR(500),
    prix_ht             DECIMAL(10,2) NOT NULL,
    taux_tva            DECIMAL(5,2) NOT NULL,
    stock_disponible    INT NOT NULL DEFAULT 0,
    statut_validation   ENUM('En attente', 'Accepté', 'Refusé') NOT NULL DEFAULT 'En attente',
    actif               BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_produit_categorie
        FOREIGN KEY (id_categorie) REFERENCES CATEGORIE (id_categorie)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_produit_fournisseur
        FOREIGN KEY (id_fournisseur) REFERENCES FOURNISSEUR (id_fournisseur)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_produit_prix CHECK (prix_ht >= 0),
    CONSTRAINT ck_produit_tva CHECK (taux_tva >= 0 AND taux_tva <= 100),       -- RG06
    CONSTRAINT ck_produit_stock CHECK (stock_disponible >= 0)                  -- RG06
) ENGINE = InnoDB;

CREATE INDEX idx_produit_categorie ON PRODUIT (id_categorie);
CREATE INDEX idx_produit_fournisseur ON PRODUIT (id_fournisseur);
CREATE INDEX idx_produit_nom ON PRODUIT (nom);   -- recherche par nom (F12)

-- ----------------------------------------------------------------------------
-- 6. PANIER (un panier persistant par professionnel)
-- ----------------------------------------------------------------------------
CREATE TABLE PANIER (
    id_panier          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_professionnel   BIGINT UNSIGNED NOT NULL,
    date_creation      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_panier_professionnel UNIQUE (id_professionnel),
    CONSTRAINT fk_panier_professionnel
        FOREIGN KEY (id_professionnel) REFERENCES PROFESSIONNEL_SANTE (id_professionnel)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ----------------------------------------------------------------------------
-- 7. PANIER_PRODUIT (association Panier <-> Produit)
-- ----------------------------------------------------------------------------
CREATE TABLE PANIER_PRODUIT (
    id_panier   BIGINT UNSIGNED NOT NULL,
    id_produit  BIGINT UNSIGNED NOT NULL,
    quantite    INT NOT NULL,
    date_ajout  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_panier, id_produit),
    CONSTRAINT fk_panier_produit_panier
        FOREIGN KEY (id_panier) REFERENCES PANIER (id_panier)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_panier_produit_produit
        FOREIGN KEY (id_produit) REFERENCES PRODUIT (id_produit)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_panier_produit_quantite CHECK (quantite > 0)
) ENGINE = InnoDB;

CREATE INDEX idx_panier_produit_produit ON PANIER_PRODUIT (id_produit);

-- ----------------------------------------------------------------------------
-- 8. COMMANDE
--    Au moins une ligne par commande : contrôlé par l'application (transaction),
--    non exprimable en contrainte MySQL.
-- ----------------------------------------------------------------------------
CREATE TABLE COMMANDE (
    id_commande        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_professionnel   BIGINT UNSIGNED NOT NULL,
    reference_commande VARCHAR(50) NOT NULL,
    date_commande      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut             ENUM('En attente', 'Validée', 'Annulée') NOT NULL DEFAULT 'En attente',
    total_ht           DECIMAL(10,2) NOT NULL,
    total_tva          DECIMAL(10,2) NOT NULL,
    total_ttc          DECIMAL(10,2) NOT NULL,
    adresse_livraison  VARCHAR(255) NOT NULL,
    CONSTRAINT uq_commande_reference UNIQUE (reference_commande),
    CONSTRAINT fk_commande_professionnel
        FOREIGN KEY (id_professionnel) REFERENCES PROFESSIONNEL_SANTE (id_professionnel)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_commande_totaux CHECK (total_ht >= 0 AND total_tva >= 0 AND total_ttc >= 0)
) ENGINE = InnoDB;

CREATE INDEX idx_commande_professionnel ON COMMANDE (id_professionnel);
CREATE INDEX idx_commande_date ON COMMANDE (date_commande);

-- ----------------------------------------------------------------------------
-- 9. LIGNE_COMMANDE (association Commande <-> Produit)
--    Nom, prix HT, TVA et prix TTC sont figés à la date d'achat (RG08).
-- ----------------------------------------------------------------------------
CREATE TABLE LIGNE_COMMANDE (
    id_commande       BIGINT UNSIGNED NOT NULL,
    id_produit        BIGINT UNSIGNED NOT NULL,
    nom_produit       VARCHAR(150) NOT NULL,
    quantite          INT NOT NULL,
    prix_ht_unitaire  DECIMAL(10,2) NOT NULL,
    taux_tva          DECIMAL(5,2) NOT NULL,
    prix_ttc_unitaire DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_commande, id_produit),
    CONSTRAINT fk_ligne_commande
        FOREIGN KEY (id_commande) REFERENCES COMMANDE (id_commande)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ligne_produit
        FOREIGN KEY (id_produit) REFERENCES PRODUIT (id_produit)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_ligne_quantite CHECK (quantite > 0),
    CONSTRAINT ck_ligne_prix CHECK (prix_ht_unitaire >= 0 AND prix_ttc_unitaire >= 0)
) ENGINE = InnoDB;

CREATE INDEX idx_ligne_produit ON LIGNE_COMMANDE (id_produit);

-- ----------------------------------------------------------------------------
-- 10. HISTORIQUE_STATUT (suivi des changements de statut de commande)
-- ----------------------------------------------------------------------------
CREATE TABLE HISTORIQUE_STATUT (
    id_historique  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_commande    BIGINT UNSIGNED NOT NULL,
    statut         ENUM('En attente', 'Validée', 'Annulée') NOT NULL,
    date_statut    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    commentaire    VARCHAR(255),
    CONSTRAINT fk_historique_commande
        FOREIGN KEY (id_commande) REFERENCES COMMANDE (id_commande)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE INDEX idx_historique_commande ON HISTORIQUE_STATUT (id_commande);

-- ----------------------------------------------------------------------------
-- 11. PAIEMENT_SIMULE (extension : aucune transaction réelle, RG18)
--     Au plus un paiement par commande.
-- ----------------------------------------------------------------------------
CREATE TABLE PAIEMENT_SIMULE (
    id_paiement          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_commande          BIGINT UNSIGNED NOT NULL,
    reference_simulation VARCHAR(80) NOT NULL,
    statut               ENUM('Réussi', 'Échoué') NOT NULL,
    date_paiement        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_paiement_commande UNIQUE (id_commande),
    CONSTRAINT uq_paiement_reference UNIQUE (reference_simulation),
    CONSTRAINT fk_paiement_commande
        FOREIGN KEY (id_commande) REFERENCES COMMANDE (id_commande)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ----------------------------------------------------------------------------
-- 12. LIVRAISON_FICTIVE (extension : suivi simulé)
--     Au plus une livraison par commande.
-- ----------------------------------------------------------------------------
CREATE TABLE LIVRAISON_FICTIVE (
    id_livraison        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_commande         BIGINT UNSIGNED NOT NULL,
    numero_suivi_fictif VARCHAR(80) NOT NULL,
    statut              ENUM('En préparation', 'Expédiée', 'Livrée') NOT NULL DEFAULT 'En préparation',
    date_expedition     DATETIME NULL,
    date_livraison      DATETIME NULL,
    CONSTRAINT uq_livraison_commande UNIQUE (id_commande),
    CONSTRAINT uq_livraison_suivi UNIQUE (numero_suivi_fictif),
    CONSTRAINT fk_livraison_commande
        FOREIGN KEY (id_commande) REFERENCES COMMANDE (id_commande)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ----------------------------------------------------------------------------
-- 13. MOUVEMENT_STOCK (extension : traçabilité du stock simulé, F27)
--     variation positive (entrée) ou négative (sortie).
-- ----------------------------------------------------------------------------
CREATE TABLE MOUVEMENT_STOCK (
    id_mouvement   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_produit     BIGINT UNSIGNED NOT NULL,
    variation      INT NOT NULL,
    motif          VARCHAR(150) NOT NULL,
    date_mouvement DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_mouvement_variation CHECK (variation <> 0),
    CONSTRAINT fk_mouvement_produit
        FOREIGN KEY (id_produit) REFERENCES PRODUIT (id_produit)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE INDEX idx_mouvement_produit ON MOUVEMENT_STOCK (id_produit);
