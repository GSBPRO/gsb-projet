import { useRef } from 'react';
import lake768 from './images/lake-768.webp';
import lake1280 from './images/lake-1280.webp';
import lake1920 from './images/lake-1920.webp';
import useMouseParallax from './useMouseParallax.js';
import WaterRipple from './WaterRipple.jsx';
import './HeroBackground.css';

// Le navigateur choisit la taille adaptée à l'écran : 13 Ko sur mobile, 57 Ko sur grand écran.
const IMAGE_PROPS = {
  src: lake1280,
  srcSet: `${lake768} 768w, ${lake1280} 1280w, ${lake1920} 1920w`,
  sizes: '100vw',
};

// Fond de l'accueil : le paysage de lac glacé, qui zoome lentement, suit la souris et dont l'eau ondule.
export default function HeroBackground() {
  const frameRef = useRef(null);
  useMouseParallax(frameRef, 24);

  return (
    <div className="hero-bg" aria-hidden="true">
      {/* Deux couches pour deux mouvements : le cadre suit la souris (JavaScript),
          les images à l'intérieur zooment lentement (CSS). Sur un seul élément, l'un écraserait l'autre. */}
      <div ref={frameRef} className="hero-bg__frame">
        {/* Chargée en priorité car c'est la première chose visible : pas de lazy loading ici. */}
        <img className="hero-bg__image" alt="" fetchPriority="high" decoding="async" {...IMAGE_PROPS} />
        <WaterRipple imageProps={IMAGE_PROPS} />
      </div>
      <span className="hero-bg__veil" />
    </div>
  );
}
