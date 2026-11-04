import DotMolecule from './DotMolecule.jsx';
import './PageLoader.css';

// Écran de chargement minimaliste : fond uni et une molécule de petits points qui s'assemble.
// isVisible=false : il s'efface en fondu, puis devient invisible et non cliquable.
// showImmediately : visible dès le premier instant (sinon il attend 200 ms, pour ne pas clignoter
// quand le chargement est très court).
export default function PageLoader({ isVisible, showImmediately = false }) {
  const classes = [
    'page-loader',
    showImmediately ? 'page-loader--immediate' : '',
    isVisible ? '' : 'page-loader--hidden',
  ].join(' ');

  return (
    <div className={classes} aria-hidden={!isVisible}>
      <DotMolecule />
      {/* Texte pour les lecteurs d'écran (role="status" : annoncé sans interrompre), invisible à l'écran */}
      <p className="page-loader__sr" role="status">
        {isVisible ? 'Chargement de la page' : ''}
      </p>
    </div>
  );
}
