import { useRef } from 'react';
import useMoleculeScene from './useMoleculeScene.js';
import './GlassMolecule.css';

// Molécule de verre en vraie 3D (Three.js). Purement décorative : cachée aux lecteurs d'écran.
// Ce composant est chargé à part (React.lazy dans HeroContent) : Three.js ne ralentit pas l'arrivée sur la page.
// onReady : prévient la page quand la molécule est affichée (pour retirer l'écran de chargement).
export default function GlassMolecule({ onReady }) {
  const stageRef = useRef(null);
  useMoleculeScene(stageRef, onReady);

  return (
    // La boîte réserve la place dans la page ; la scène (le dessin 3D) déborde largement autour,
    // avec un fond transparent : la molécule peut tourner sans jamais toucher un bord.
    <div className="glass-molecule" aria-hidden="true">
      <div ref={stageRef} className="glass-molecule__stage" />
    </div>
  );
}
