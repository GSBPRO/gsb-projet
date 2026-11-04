import { useEffect } from 'react';

// Distance (en px) à partir de laquelle la souris fait sauter une gélule.
const HOVER_RADIUS = 90;

// Fait sauter les gélules posées quand la souris passe près d'elles.
// On écoute la souris sur toute la fenêtre plutôt que sur les gélules : elles restent
// en « pointer-events: none » et ne bloquent donc jamais un clic sur le texte ou le bouton.
export default function usePillHover(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;

    function handlePointerMove(event) {
      // Un seul calcul par image affichée, même si la souris envoie beaucoup d'événements.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => hopPillsNear(container, event.clientX, event.clientY));
    }

    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, [containerRef]);
}

function hopPillsNear(container, clientX, clientY) {
  const rect = container.getBoundingClientRect();
  const pointerX = clientX - rect.left;
  const pointerY = clientY - rect.top;
  const now = performance.now();

  container.querySelectorAll('[data-pill]').forEach((slot) => {
    if (slot.dataset.hopping === 'true') return; // déjà en l'air
    if (now < Number(slot.dataset.landedAt)) return; // encore en train de tomber

    const dx = Number(slot.dataset.restX) - pointerX;
    const dy = Number(slot.dataset.restY) - pointerY;
    const distance = Math.hypot(dx, dy);
    if (distance > HOVER_RADIUS) return;

    // Plus la souris est proche, plus le saut est fort (de 0 à 1).
    hop(slot, 1 - distance / HOVER_RADIUS, dx);
  });
}

// Saut : montée qui ralentit, redescente qui accélère (gravité), petit rebond, retour à sa place.
function hop(slot, strength, dx) {
  const height = 160 + strength * 200 + Math.random() * 60; // de 160 à 420 px
  const sideKick = Math.sign(dx || 1) * (20 + Math.random() * 50); // s'écarte de la souris
  // Plus le saut est haut, plus il dure : la chute garde l'air d'obéir à la gravité.
  const duration = 600 + height * 2;

  slot.dataset.hopping = 'true';

  const jump = slot.animate(
    [
      { transform: 'translate(0, 0)', easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)' },
      { transform: `translate(${sideKick}px, ${-height}px)`, offset: 0.42, easing: 'cubic-bezier(0.6, 0, 0.9, 0.6)' },
      { transform: 'translate(0, 0)', offset: 0.84, easing: 'ease-out' },
      { transform: 'translate(0, -8px)', offset: 0.92, easing: 'ease-in' },
      { transform: 'translate(0, 0)' },
    ],
    { duration },
  );

  // Un tour complet sur elle-même pendant le saut. « composite: add » ajoute cette rotation
  // à celle de la gélule posée, au lieu de la remplacer. 360° : elle finit dans la même position.
  const pill = slot.firstElementChild;
  const direction = Math.random() < 0.5 ? -1 : 1;
  pill.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${direction * 360}deg)` }], {
    duration: duration * 0.84,
    easing: 'ease-in-out',
    composite: 'add',
  });

  jump.onfinish = () => {
    slot.dataset.hopping = 'false';
  };
}
