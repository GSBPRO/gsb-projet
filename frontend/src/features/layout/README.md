# Mise en page (`features/layout`)

Ce qui entoure toutes les pages connectées : professionnel, fournisseur et administrateur (chacun voit ses onglets).

| Fichier | Rôle |
|---|---|
| `AppLayout.jsx` + `.css` | la mise en page commune aux trois profils : l'en-tête, puis la page en cours |
| `navLinks.js` | les onglets de l'en-tête selon le profil |
| `Header.jsx` + `.css` | l'en-tête : logo, onglets, menu du catalogue (avec voile), panier, utilisateur, déconnexion |
| `SlideTabs.jsx` + `.css` | les onglets avec la gélule animée au changement de page |
| `useSlidingCursor.js` | calcule où placer la gélule et quand relancer son animation |
| `useMenuToggle.js` | ouvre / ferme le menu du catalogue, le referme au changement de page et rend le focus à l'onglet |
