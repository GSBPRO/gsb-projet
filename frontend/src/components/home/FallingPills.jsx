import { useRef } from 'react';
import usePillHover from '../../hooks/usePillHover.js';
import usePillPile from '../../hooks/usePillPile.js';
import './FallingPills.css';

// Gélules bleu glacé qui tombent, s'empilent en bas du bandeau et sautent au passage de la souris.
// Purement décoratif.
export default function FallingPills() {
  const containerRef = useRef(null);
  const pills = usePillPile(containerRef);
  usePillHover(containerRef);

  return (
    <div ref={containerRef} className="falling-pills" aria-hidden="true">
      {pills.map((pill) => (
        // Deux éléments : l'emplacement (qui saute) et la gélule (qui tombe et tourne).
        // Séparer les deux permet au saut de toujours aller vers le haut de l'écran,
        // quelle que soit l'orientation de la gélule.
        <span
          key={pill.id}
          className="falling-pills__slot"
          data-pill
          data-rest-x={pill.restX}
          data-rest-y={pill.restY}
          data-landed-at={pill.landedAt}
          style={{ left: `${pill.left}px`, width: `${pill.thickness}px`, height: `${pill.length}px` }}
        >
          <span
            className="falling-pills__pill"
            // Les variables CSS (--…) transmettent les valeurs calculées en JavaScript à l'animation CSS.
            style={{
              animationDuration: `${pill.duration}s`,
              '--land-y': `${pill.landY}px`,
              '--start-rotate': `${pill.startRotate}deg`,
              '--end-rotate': `${pill.endRotate}deg`,
              '--drift': `${pill.drift}px`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
