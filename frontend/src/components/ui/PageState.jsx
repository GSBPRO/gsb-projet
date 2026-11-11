import Button from './Button.jsx';
import './PageState.css';

// Les trois états d'un chargement de données (chargement, erreur, vide) à un seul endroit,
// pour que toutes les pages réagissent de la même façon. Sinon, on affiche les enfants.
// status : 'loading' | 'error' | 'success' ; isEmpty : la liste chargée est vide.
export default function PageState({ status, isEmpty = false, emptyText = 'Rien à afficher pour le moment.', onRetry, children }) {
  if (status === 'loading') {
    return (
      <p className="page-state" aria-busy="true">
        Chargement…
      </p>
    );
  }
  if (status === 'error') {
    return (
      <div className="page-state page-state--error" role="alert">
        <p>Les données n’ont pas pu être chargées.</p>
        {onRetry && <Button onClick={onRetry}>Réessayer</Button>}
      </div>
    );
  }
  if (isEmpty) {
    return <p className="page-state">{emptyText}</p>;
  }
  return children;
}
