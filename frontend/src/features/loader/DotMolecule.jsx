import { MOLECULE_DOTS } from './moleculeDots.js';
import './DotMolecule.css';

// Molécule faite de petits points qui arrivent de partout et s'assemblent. Purement décoratif.
export default function DotMolecule() {
  return (
    <svg className="dot-molecule" viewBox="0 0 240 200" aria-hidden="true">
      {MOLECULE_DOTS.map((dot, index) => (
        <circle
          key={index}
          className={`dot-molecule__dot ${dot.isAtom ? 'dot-molecule__dot--atom' : ''}`}
          cx={dot.x}
          cy={dot.y}
          r={dot.radius}
          // Les variables CSS transmettent à l'animation le point de départ et le retard de chaque point.
          style={{
            '--from-x': `${dot.fromX}px`,
            '--from-y': `${dot.fromY}px`,
            '--delay': `${dot.delay}s`,
          }}
        />
      ))}
    </svg>
  );
}
