import { useMemo } from 'react';

// Tire au hasard la position, la taille et la vitesse des particules de lumière.
export default function useLightParticles(count) {
  // useMemo : tiré une seule fois, sinon les particules sauteraient à chaque rendu.
  return useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const duration = 14 + Math.random() * 14; // 14 à 28 s pour monter
        return {
          id: index,
          left: Math.random() * 100,
          size: 4 + Math.random() * 12, // 4 à 16 px
          duration,
          // Retard négatif : les particules sont déjà réparties dans le ciel au chargement.
          delay: -Math.random() * duration,
          sway: (Math.random() - 0.5) * 60, // balancement gauche/droite
          opacity: 0.35 + Math.random() * 0.5,
        };
      }),
    [count],
  );
}
