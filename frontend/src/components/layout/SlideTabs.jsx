import { NavLink, useLocation } from 'react-router-dom';
import useSlidingCursor from '../../hooks/useSlidingCursor.js';
import './SlideTabs.css';

// Navigation en onglets avec une pastille qui glisse sous l'onglet survolé.
// links : [{ to: '/accueil', label: 'Accueil' }, ...]
export default function SlideTabs({ links, label }) {
  const { pathname } = useLocation();
  const activeIndex = links.findIndex((link) => pathname.startsWith(link.to));
  const { setItemRef, highlightedIndex, pageChangeCount, cursorStyle, highlight, resetHighlight } =
    useSlidingCursor(activeIndex);
  const hasChangedPage = pageChangeCount > 0;

  return (
    <nav aria-label={label} className="slide-tabs" onMouseLeave={resetHighlight}>
      {/* La gélule est décorative : l'onglet actif est annoncé par aria-current (ajouté par NavLink). */}
      <span className="slide-tabs__cursor" style={cursorStyle} aria-hidden="true">
        {/* key change à chaque changement de page : React recrée l'élément, ce qui relance l'animation CSS. */}
        <span key={pageChangeCount} className={`capsule ${hasChangedPage ? 'capsule--hop' : ''}`}>
          <span className="capsule__half capsule__half--left" />
          <span className="capsule__half capsule__half--right" />
          {hasChangedPage && <span className="capsule__cross">+</span>}
        </span>
      </span>
      <ul className="slide-tabs__list">
        {links.map((link, index) => (
          <li key={link.to} ref={setItemRef(index)}>
            <NavLink
              to={link.to}
              className={`slide-tabs__link ${index === highlightedIndex ? 'is-highlighted' : ''}`}
              onMouseEnter={() => highlight(index)}
              onFocus={() => highlight(index)}
              onBlur={resetHighlight}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
