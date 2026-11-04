import { useEffect } from 'react';

// Incline légèrement un élément vers la souris (effet 3D au survol d'une carte produit).
// maxAngle : inclinaison maximale en degrés.
export default function useTilt(elementRef, maxAngle = 6) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    // Pas d'effet si l'ordinateur demande moins d'animations, ni sur écran tactile (pas de survol).
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover)').matches;
    if (reduceMotion || !canHover) return undefined;

    function handlePointerMove(event) {
      const rect = element.getBoundingClientRect();
      // Position de la souris dans la carte, entre -0,5 et +0,5.
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.transform = `perspective(800px) rotateX(${-y * maxAngle}deg) rotateY(${x * maxAngle}deg)`;
    }

    function handlePointerLeave() {
      element.style.transform = '';
    }

    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [elementRef, maxAngle]);
}
