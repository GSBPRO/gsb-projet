import { useEffect, useState } from 'react';
import PageLoader from '../loader/PageLoader.jsx';
import useAuth from '../auth/useAuth.js';
import useReadyWithTimeout from '../loader/useReadyWithTimeout.js';
import HomeHero from './HomeHero.jsx';
import HomeVideoBand from './HomeVideoBand.jsx';

// 4 secondes au maximum : même si la 3D ne se charge pas, la page finit toujours par s'afficher.
const MAX_LOADING_MS = 4000;
// Durée minimale de l'écran de chargement à la première arrivée : le temps que la molécule
// de points se forme entièrement (environ 2,3 s) puis « respire » un instant.
const FIRST_VISIT_MIN_MS = 2800;

// Gardé en dehors du composant : vrai dès que l'écran de chargement a été montré une fois.
// Les visites suivantes de l'accueil n'imposent plus d'attente.
let hasShownLoader = false;

// Accueil du professionnel de santé : un écran de chargement, le temps que la molécule 3D soit prête.
export default function HomePage() {
  const { user } = useAuth();
  // Fonction passée à useState : la durée est choisie une seule fois, au premier affichage.
  const [minLoadingMs] = useState(() => (hasShownLoader ? 0 : FIRST_VISIT_MIN_MS));
  const [isReady, markReady] = useReadyWithTimeout(MAX_LOADING_MS, minLoadingMs);

  useEffect(() => {
    hasShownLoader = true;
  }, []);

  return (
    <>
      {/* Première arrivée : on sait que le chargement dure, le loader s'affiche donc tout de suite. */}
      <PageLoader isVisible={!isReady} showImmediately={minLoadingMs > 0} />
      <HomeVideoBand />
      <HomeHero userName={`${user.title} ${user.lastName}`} onMoleculeReady={markReady} isRevealed={isReady} />
    </>
  );
}
