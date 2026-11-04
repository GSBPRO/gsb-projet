# Espace professionnel (`features/layout`)

Ce qui entoure toutes les pages du professionnel de santé.

| Fichier | Rôle |
|---|---|
| `ProLayout.jsx` + `.css` | la mise en page commune : l'en-tête, puis la page en cours |
| `Header.jsx` + `.css` | l'en-tête : logo, onglets, menu du catalogue (avec voile), panier, utilisateur, déconnexion |
| `SlideTabs.jsx` + `.css` | les onglets avec la gélule animée au changement de page |
| `useSlidingCursor.js` | calcule où placer la gélule et quand relancer son animation |
| `useMenuToggle.js` | ouvre / ferme le menu du catalogue, le referme au changement de page et rend le focus à l'onglet |
