import { useEffect, useMemo, useRef } from 'react';

// Crée des bulles décoratives et les fait suivre légèrement la souris (effet de profondeur).
export default function useParallaxBlobs(count) {
  // Tirées au hasard une seule fois : sinon les bulles changeraient de place à chaque rendu.
  const blobs = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        size: Math.random() * 200 + 150,
        left: Math.random() * 80 + 10,
        top: Math.random() * 80 + 10,
        delay: Math.random() * -20,
        duration: Math.random() * 15 + 15,
      })),
    [count],
  );

  const blobRefs = useRef([]);

  useEffect(() => {
    // Pas d'effet de souris si l'utilisateur a demandé moins d'animations à son système.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;

    function handlePointerMove(event) {
      // Une mise à jour par image affichée au maximum, pour ne pas ralentir la page.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;

        blobRefs.current.forEach((blob, index) => {
          if (!blob) return;
          const speed = (index + 1) * 20;
          // On bouge les marges et pas « transform », déjà utilisé par l'animation CSS.
          blob.style.marginLeft = `${x * speed}px`;
          blob.style.marginTop = `${y * speed}px`;
        });
      });
    }

    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Accolades obligatoires : avec React 19, une fonction ref qui renvoie une valeur est prise pour un nettoyage.
  function setBlobRef(index) {
    return (element) => {
      blobRefs.current[index] = element;
    };
  }

  return { blobs, setBlobRef };
}
