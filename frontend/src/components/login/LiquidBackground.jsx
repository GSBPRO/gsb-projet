import useParallaxBlobs from '../../hooks/useParallaxBlobs.js';
import './LiquidBackground.css';

// Fond animé de la page de connexion. Purement décoratif : caché aux lecteurs d'écran.
// className : permet à une page de placer ou recolorer le décor (ex. : au centre du bandeau d'accueil).
export default function LiquidBackground({ count = 6, className = '' }) {
  const { blobs, setBlobRef } = useParallaxBlobs(count);

  return (
    <div className={`liquid ${className}`} aria-hidden="true">
      {/* Le filtre floute puis durcit les bords : les bulles qui se touchent fusionnent comme du liquide.
          Son id « gsb-goo » est aussi utilisé dans le CSS du bouton de connexion. */}
      <svg className="liquid__defs">
        <defs>
          <filter id="gsb-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="liquid__stage">
        {blobs.map((blob, index) => (
          <div
            key={index}
            ref={setBlobRef(index)}
            className="liquid__blob"
            style={{
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              left: `${blob.left}%`,
              top: `${blob.top}%`,
              animationDelay: `${blob.delay}s`,
              animationDuration: `${blob.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
