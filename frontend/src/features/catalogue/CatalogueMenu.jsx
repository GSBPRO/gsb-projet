import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import ArrowUpRightIcon from '../../components/icons/ArrowUpRightIcon.jsx';
import { buildCatalogueMenuCards } from './catalogueMenuCards.js';
import useCatalogue from './useCatalogue.js';
import './CatalogueMenu.css';

// Les points forts du catalogue, affichés façon fiche technique (01 / …).
const HIGHLIGHTS = [
  'Produits validés par GSB',
  'Prix HT et TTC détaillés',
  'Stock en temps réel',
  'Livraison suivie',
  'Réservé aux professionnels',
];

// Méga-menu qui se déplie sous l'en-tête quand on clique sur « Catalogue ».
// onClose : appelé pour fermer le menu (touche Échap). Le clic à l'extérieur est géré par l'en-tête.
export default function CatalogueMenu({ id, onClose }) {
  const { status, data } = useCatalogue();
  const panelRef = useRef(null);
  const cards = useMemo(() => (data ? buildCatalogueMenuCards(data) : []), [data]);

  // À l'ouverture, on place le focus dans le menu : au clavier, on continue directement dedans.
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  // Échap ferme le menu, comme toutes les fenêtres qui s'ouvrent par-dessus la page.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div id={id} ref={panelRef} tabIndex={-1} className="catalogue-menu" role="region" aria-label="Menu du catalogue">
      <div className="catalogue-menu__top">
        <p className="catalogue-menu__title">Catalogue GSB</p>
        <ol className="catalogue-menu__highlights">
          {HIGHLIGHTS.map((highlight, index) => (
            <li key={highlight}>
              <span className="catalogue-menu__number">{String(index + 1).padStart(2, '0')} /</span> {highlight}
            </li>
          ))}
        </ol>
      </div>

      {status === 'error' && <p className="catalogue-menu__message">Le catalogue est momentanément indisponible.</p>}

      <ul className="catalogue-menu__cards">
        {status === 'loading' &&
          [0, 1, 2, 3].map((index) => <li key={index} className="catalogue-menu__card catalogue-menu__card--loading" />)}

        {cards.map((card, index) => (
          <li key={card.key} style={{ '--card-index': index }}>
            <Link to={card.to} className="catalogue-menu__card">
              <span className="catalogue-menu__thumb" style={{ '--thumb-color': card.color }} aria-hidden="true">
                <span className="catalogue-menu__capsule" />
              </span>
              <span className="catalogue-menu__text">
                <span className="catalogue-menu__name">{card.title}</span>
                <span className="catalogue-menu__tagline">{card.tagline}</span>
                <span className="catalogue-menu__count">
                  {card.count} produit{card.count > 1 ? 's' : ''}
                </span>
              </span>
              <span className="catalogue-menu__plus" aria-hidden="true">
                +
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link to="/catalogue" className="catalogue-menu__all">
        Voir tout le catalogue
        <ArrowUpRightIcon />
      </Link>
    </div>
  );
}
