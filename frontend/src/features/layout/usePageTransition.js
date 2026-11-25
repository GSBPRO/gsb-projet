import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Prépare la transition entre deux pages.
// - key : change à chaque nouvelle page ; React recrée alors le bloc de la page, ce qui relance l'animation CSS.
//   On se base sur le chemin seulement : changer un filtre du catalogue (?categorie=2) ne rejoue pas l'animation.
// - shouldAnimate : faux au tout premier affichage (l'accueil a déjà son écran de chargement),
//   vrai pour toutes les navigations suivantes.
export default function usePageTransition() {
  const { pathname } = useLocation();
  const hasNavigated = useRef(false);
  const shouldAnimate = hasNavigated.current;

  useEffect(() => {
    // Nouvelle page : on repart du haut, sinon on arriverait au milieu de la page suivante.
    if (hasNavigated.current) window.scrollTo({ top: 0, behavior: 'instant' });
    hasNavigated.current = true;
  }, [pathname]);

  return { key: pathname, shouldAnimate };
}
