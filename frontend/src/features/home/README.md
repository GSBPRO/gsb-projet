# Page d'accueil (`features/home`)

Les couches, de l'arrière vers l'avant : `background` → `particles` → `pills` → texte (`HeroContent`).

| Fichier ou dossier | Rôle |
|---|---|
| `HomePage.jsx` | affiche l'écran de chargement, puis l'accueil avec son apparition |
| `HomeHero.jsx` + `.css` | assemble les couches sur toute la largeur de l'écran |
| `HeroContent.jsx` + `.css` | le texte, le bouton et l'emplacement de la molécule 3D |
| `background/` | le paysage glacé : image (`images/`), zoom, souris (`useMouseParallax`), eau qui ondule (`WaterRipple`) |
| `particles/` | les points de lumière qui montent (`LightParticles` + `useLightParticles`) |
| `pills/` | les gélules qui tombent, s'empilent (`usePillPile`) et sautent au survol (`usePillHover`) |
| `molecule/` | la molécule de verre 3D : composant, chargement à part, branchement React, scène Three.js et forme |
