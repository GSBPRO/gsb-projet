import { useCallback, useEffect, useState } from 'react';

// État « prêt » qu'on déclenche soi-même (markReady), encadré par deux durées :
// - minWaitMs : durée minimale, pour que l'écran de chargement ait le temps d'être vu ;
// - maxWaitMs : durée maximale de sécurité, la page ne reste jamais bloquée.
export default function useReadyWithTimeout(maxWaitMs, minWaitMs = 0) {
  const [isMarkedReady, setIsMarkedReady] = useState(false);
  const [hasWaitedMinimum, setHasWaitedMinimum] = useState(minWaitMs === 0);

  // useCallback : la fonction garde la même identité à chaque rendu (pas de travail refait inutilement).
  const markReady = useCallback(() => setIsMarkedReady(true), []);

  useEffect(() => {
    const maxTimer = setTimeout(markReady, maxWaitMs);
    const minTimer = setTimeout(() => setHasWaitedMinimum(true), minWaitMs);
    return () => {
      clearTimeout(maxTimer);
      clearTimeout(minTimer);
    };
  }, [markReady, maxWaitMs, minWaitMs]);

  // Prêt seulement quand le contenu est prêt ET que la durée minimale est passée.
  return [isMarkedReady && hasWaitedMinimum, markReady];
}
