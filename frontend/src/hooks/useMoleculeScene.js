import { useEffect, useRef } from 'react';
import { createMoleculeScene } from '../three/createMoleculeScene.js';

// Branche la scène 3D dans React : création, taille, souris, animation, pause et nettoyage.
// onReady : appelé une fois, quand la première image de la molécule est affichée (ou si la 3D est impossible).
export default function useMoleculeScene(containerRef, onReady) {
  // On garde la dernière version de onReady dans une ref : si le parent passe une nouvelle fonction,
  // on ne recrée pas toute la scène 3D pour autant.
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let moleculeScene;
    try {
      moleculeScene = createMoleculeScene(container);
    } catch {
      // WebGL indisponible (vieux navigateur, carte graphique désactivée) : on n'affiche rien, la page reste utilisable.
      onReadyRef.current?.();
      return undefined;
    }

    const pointer = { x: 0, y: 0 };
    function handlePointerMove(event) {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    }

    // Pause quand la molécule n'est pas à l'écran : pas de calcul 3D inutile.
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    moleculeScene.resize();
    window.addEventListener('resize', moleculeScene.resize);

    let frame = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      // Moins d'animations demandées : une seule image, fixe.
      moleculeScene.update(0, pointer);
    } else {
      window.addEventListener('pointermove', handlePointerMove);
      const loop = (timestamp) => {
        frame = requestAnimationFrame(loop);
        if (isVisible) moleculeScene.update(timestamp / 1000, pointer);
      };
      frame = requestAnimationFrame(loop);
    }

    // Une image plus tard, la première vue de la molécule est à l'écran : on prévient la page.
    const readyFrame = requestAnimationFrame(() => requestAnimationFrame(() => onReadyRef.current?.()));

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(readyFrame);
      observer.disconnect();
      window.removeEventListener('resize', moleculeScene.resize);
      window.removeEventListener('pointermove', handlePointerMove);
      moleculeScene.dispose();
    };
  }, [containerRef]);
}
