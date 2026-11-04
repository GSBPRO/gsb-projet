import './WaterRipple.css';

// Fait onduler la partie « lac » du paysage.
// Principe : une deuxième copie de l'image, déformée par un filtre SVG, n'est visible que sur le bas (l'eau).
// imageProps : les mêmes src / srcSet que l'image de fond, pour que les deux se superposent exactement.
export default function WaterRipple({ imageProps }) {
  return (
    <>
      <svg className="water-ripple__defs" aria-hidden="true">
        <filter id="gsb-water">
          {/* Bruit aléatoire « étiré » à l'horizontale, qui évolue lentement : ce sont les vaguelettes. */}
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.06" numOctaves="2" seed="4" result="noise">
            <animate
              attributeName="baseFrequency"
              dur="14s"
              values="0.008 0.06; 0.012 0.08; 0.008 0.06"
              repeatCount="indefinite"
            />
          </feTurbulence>
          {/* Déplace chaque pixel de l'image selon le bruit : l'image semble vue à travers l'eau. */}
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* alt vide : copie décorative de l'image de fond */}
      <img className="water-ripple" alt="" {...imageProps} />
    </>
  );
}
