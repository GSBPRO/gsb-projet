# Organisation du code du front GSB

**Règle :** ce qui sert à une seule fonctionnalité est rangé dans son dossier `features/…`.
Ce qui sert à plusieurs fonctionnalités est rangé dans `components/`.

| Dossier | Contenu |
|---|---|
| `features/auth/` | la connexion (page, formulaire, session, protection des pages) |
| `features/layout/` | l'espace professionnel : en-tête, onglets à gélule, mise en page |
| `features/home/` | la page d'accueil et ses effets (fond, particules, gélules, molécule 3D) |
| `features/loader/` | l'écran de chargement (molécule de petits points) |
| `components/ui/` | les briques réutilisées partout : bouton, champ, logo, apparition animée |
| `components/icons/` | les icônes SVG |
| `components/effects/` | le fond liquide, utilisé par la connexion et le loader |
| `pages/` | les pages simples sans fonctionnalité propre (introuvable, bientôt disponible) |
| `mocks/` | les outils pour les données fictives, en attendant l'API |
| `styles/` | les couleurs GSB (`tokens.css`) et le style de base (`global.css`) |
| `App.jsx` | la liste des adresses du site et la page affichée pour chacune |
| `main.jsx` | le démarrage de l'application |

Dans chaque fichier, les imports sont toujours dans le même ordre :
bibliothèques → éléments d'autres dossiers du projet → fichiers du même dossier → CSS.
