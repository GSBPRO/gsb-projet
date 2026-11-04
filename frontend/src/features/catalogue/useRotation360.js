import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 36;
// Nombre de pixels de glissement pour passer d'une vue à la suivante.
const PIXELS_PER_FRAME = 14;

// Chemin d'une vue : vue_000.webp à vue_035.webp.
function framePath(folder, index) {
  return `${folder}vue_${String(index).padStart(3, '0')}.webp`;
}

// Fait tourner un produit à 360° : on glisse horizontalement (souris ou doigt) ou on utilise les flèches.
// Les 36 vues ne sont téléchargées qu'à l'ouverture de la fiche (jamais dans les cartes du catalogue).
export default function useRotation360(folder) {
  const [frame, setFrame] = useState(0);
  const drag = useRef(null);

  useEffect(() => {
    for (let index = 0; index < FRAME_COUNT; index += 1) {
      new Image().src = framePath(folder, index);
    }
  }, [folder]);

  function rotateBy(steps) {
    setFrame((current) => (current + steps + FRAME_COUNT) % FRAME_COUNT);
  }

  const handlers = {
    onPointerDown(event) {
      drag.current = { x: event.clientX, startFrame: frame };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove(event) {
      if (!drag.current) return;
      const steps = Math.round((event.clientX - drag.current.x) / PIXELS_PER_FRAME);
      setFrame((drag.current.startFrame - steps + FRAME_COUNT * 100) % FRAME_COUNT);
    },
    onPointerUp() {
      drag.current = null;
    },
    onKeyDown(event) {
      if (event.key === 'ArrowLeft') rotateBy(-1);
      if (event.key === 'ArrowRight') rotateBy(1);
    },
  };

  return { src: framePath(folder, frame), rotateBy, handlers };
}
