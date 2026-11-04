import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Calcule où placer la pastille glissante : sous l'onglet survolé, sinon sous l'onglet de la page en cours.
export default function useSlidingCursor(activeIndex) {
  const itemRefs = useRef([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [cursor, setCursor] = useState({ left: 0, width: 0, visible: false });

  const highlightedIndex = hoveredIndex ?? activeIndex;

  // Compte les changements de page : chaque nouvelle valeur relance l'animation de la gélule.
  // On ne compte pas le premier affichage, sinon la gélule s'animerait dès l'arrivée sur le site.
  const [pageChangeCount, setPageChangeCount] = useState(0);
  const previousActiveIndex = useRef(activeIndex);

  useEffect(() => {
    if (previousActiveIndex.current !== activeIndex) {
      previousActiveIndex.current = activeIndex;
      setPageChangeCount((count) => count + 1);
    }
  }, [activeIndex]);

  // useLayoutEffect : on mesure avant que l'écran ne s'affiche, la pastille n'apparaît jamais au mauvais endroit.
  useLayoutEffect(() => {
    let isMounted = true;

    function placeCursor() {
      if (!isMounted) return;
      const item = itemRefs.current[highlightedIndex];
      if (!item) {
        // Page sans onglet (ex. : panier) : on cache la pastille.
        setCursor((previous) => ({ ...previous, visible: false }));
        return;
      }
      setCursor({ left: item.offsetLeft, width: item.offsetWidth, visible: true });
    }

    placeCursor();
    // On remesure si la fenêtre change de taille ou quand la police Manrope finit de charger (les mots changent de largeur).
    window.addEventListener('resize', placeCursor);
    document.fonts.ready.then(placeCursor);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', placeCursor);
    };
  }, [highlightedIndex]);

  // Accolades obligatoires : avec React 19, une fonction ref qui renvoie une valeur est prise pour un nettoyage.
  function setItemRef(index) {
    return (element) => {
      itemRefs.current[index] = element;
    };
  }

  return {
    setItemRef,
    highlightedIndex,
    pageChangeCount,
    cursorStyle: {
      transform: `translateX(${cursor.left}px)`,
      width: `${cursor.width}px`,
      opacity: cursor.visible ? 1 : 0,
    },
    highlight: setHoveredIndex,
    resetHighlight: () => setHoveredIndex(null),
  };
}
