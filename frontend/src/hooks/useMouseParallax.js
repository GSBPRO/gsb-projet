import { useEffect } from 'react';

// Décale légèrement un élément dans le sens inverse de la souris : effet de profondeur,
// comme si on regardait le paysage à travers une fenêtre.
// strength : décalage maximal en pixels.
export default function useMouseParallax(elementRef, strength = 20) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;

    function handlePointerMove(event) {
      // Un seul calcul par image affichée, même si la souris envoie beaucoup d'événements.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Position de la souris entre -0,5 (bord gauche / haut) et +0,5 (bord droit / bas).
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        element.style.transform = `translate3d(${-x * strength}px, ${-y * strength}px, 0)`;
      });
    }

    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, [elementRef, strength]);
}
