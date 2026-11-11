# Catalogue (`features/catalogue`)

Les produits actifs et validés, avec recherche (F10), catégories (F08), filtres (F11) et tri.
Données **fictives** pour l'instant : `productService.js` sera branché sur l'API Express.

| Fichier | Rôle |
|---|---|
| `CataloguePage.jsx` + `.css` | la page : charge les données et assemble les morceaux ci-dessous |
| `CatalogueBanner.jsx` + `.css` | le bandeau glacé en haut de la page |
| `CatalogueMenu.jsx` + `.css` | le méga-menu qui se déplie sous l'onglet « Catalogue » de l'en-tête |
| `catalogueMenuCards.js` | construit les cartes du menu (une par catégorie + « En stock ») avec leur lien filtré |
| `CatalogueFilters.jsx` + `.css` | les filtres : laboratoire, uniquement en stock, tout effacer |
| `CatalogueToolbar.jsx` + `.css` | le titre, le nombre de produits, la recherche et le tri |
| `CategoryChips.jsx` + `.css` | les catégories en pastilles cliquables |
| `ProductGrid.jsx` + `.css` | la grille, et les états chargement / erreur / aucun résultat |
| `ProductCard.jsx` + `.css` | la carte d'un produit (prix HT et TTC, stock) ; elle mène à la page du produit |
| `ProductPage.jsx` + `.css` | la page détail `/catalogue/:id` : miniatures, grande image (vue 360°), infos et prix |
| `ProductImage.jsx` + `.css` | la photo du produit, ou une image provisoire en attendant |
| `StockBadge.jsx` + `.css` | « En stock », « Plus que X en stock » ou « Rupture de stock » |
| `ProductCardSkeleton.jsx` + `.css` | la carte « fantôme » pendant le chargement |
| `useCatalogue.js` | charge le catalogue et suit son état (chargement, erreur, succès) |
| `useCatalogueFilters.js` | la logique de la recherche, des filtres et du tri |
| `useTilt.js` | incline une carte vers la souris |
| `productService.js` | renvoie les produits vendables (actifs et validés) ; futur appel à l'API |
| `mockCatalogue.js` | les catégories, laboratoires et produits fictifs |

La page lit aussi les filtres dans l'adresse : `/catalogue?categorie=2` ou `/catalogue?stock=1`.
Les données sont gardées en mémoire après le premier chargement (menu et page partagent la même réponse).

Le calcul du prix TTC et l'affichage en euros sont dans `src/utils/price.js`, partagé avec le futur panier.
