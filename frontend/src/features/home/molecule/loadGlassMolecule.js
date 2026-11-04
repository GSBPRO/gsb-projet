// Une seule fonction pour charger le composant 3D (et Three.js avec lui).
// - React.lazy l'utilise pour afficher la molécule sur l'accueil ;
// - la page de connexion l'appelle en avance : le téléchargement se fait pendant qu'on tape son mot de passe.
// Le navigateur ne télécharge le fichier qu'une fois : le deuxième appel réutilise le premier.
export default function loadGlassMolecule() {
  return import('./GlassMolecule.jsx');
}
