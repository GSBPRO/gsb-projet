import { NavLink, useLocation } from 'react-router-dom';
import useSlidingCursor from './useSlidingCursor.js';
import './SlideTabs.css';

// Navigation en onglets avec une pastille qui glisse sous l'onglet survolé.
// links : [{ to: '/accueil', label: 'Accueil' }, { to: '/catalogue', label: 'Catalogue', menuId: 'catalogue-menu' }]
// Un onglet avec « menuId » ouvre un menu au lieu de changer de page.
// openMenuId : le menu ouvert (ou null) ; onToggleMenu : ouvre / ferme ce menu.
export default function SlideTabs({ links, label, openMenuId = null, onToggleMenu }) {
  const { pathname } = useLocation();
  const activeIndex = links.findIndex((link) => pathname.startsWith(link.to));
  const { setItemRef, highlightedIndex, pageChangeCount, cursorStyle, highlight, resetHighlight } =
    useSlidingCursor(activeIndex);
  const hasChangedPage = pageChangeCount > 0;

  return (
    <nav aria-label={label} className="slide-tabs" onMouseLeave={resetHighlight}>
      {/* La gélule est décorative : l'onglet actif est annoncé par aria-current. */}
      <span className="slide-tabs__cursor" style={cursorStyle} aria-hidden="true">
        {/* key change à chaque changement de page : React recrée l'élément, ce qui relance l'animation CSS. */}
        <span key={pageChangeCount} className={`capsule ${hasChangedPage ? 'capsule--hop' : ''}`}>
          <span className="capsule__half capsule__half--left" />
          <span className="capsule__half capsule__half--right" />
          {hasChangedPage && <span className="capsule__cross">+</span>}
        </span>
      </span>
      <ul className="slide-tabs__list">
        {links.map((link, index) => {
          const className = `slide-tabs__link ${index === highlightedIndex ? 'is-highlighted' : ''}`;
          const handlers = {
            onMouseEnter: () => highlight(index),
            onFocus: () => highlight(index),
            onBlur: resetHighlight,
          };

          return (
            <li key={link.to} ref={setItemRef(index)}>
              {link.menuId ? (
                // Bouton qui ouvre un menu : aria-expanded dit s'il est ouvert, aria-controls quel menu il pilote.
                <button
                  type="button"
                  className={`${className} slide-tabs__link--button`}
                  aria-expanded={openMenuId === link.menuId}
                  aria-controls={link.menuId}
                  aria-current={index === activeIndex ? 'page' : undefined}
                  onClick={() => onToggleMenu?.(link.menuId)}
                  {...handlers}
                >
                  {link.label}
                  <span className="slide-tabs__chevron" aria-hidden="true" />
                </button>
              ) : (
                <NavLink to={link.to} className={className} {...handlers}>
                  {link.label}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
