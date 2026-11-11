import { Link, useNavigate } from 'react-router-dom';
import CartIcon from '../../components/icons/CartIcon.jsx';
import LogoutIcon from '../../components/icons/LogoutIcon.jsx';
import Logo from '../../components/ui/Logo.jsx';
import { homePathFor, roleLabel, ROLES } from '../auth/roles.js';
import useAuth from '../auth/useAuth.js';
import useCart from '../cart/useCart.js';
import CatalogueMenu from '../catalogue/CatalogueMenu.jsx';
import { CATALOGUE_MENU_ID, navLinksFor } from './navLinks.js';
import SlideTabs from './SlideTabs.jsx';
import useMenuToggle from './useMenuToggle.js';
import './Header.css';

// En-tête de l'espace connecté : logo, onglets du profil, panier (professionnel seulement), compte, déconnexion.
// overHero : l'en-tête est posé sur un bandeau sombre (logo et texte en blanc).
export default function Header({ overHero = false }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const { openMenuId, toggleMenu, closeMenu } = useMenuToggle();
  const isProfessional = user.role === ROLES.professional;
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  function handleLogout() {
    logout();
    navigate('/connexion', { replace: true });
  }

  return (
    <header className={`header${overHero ? ' header--over-hero' : ''}`}>
      <div className="header__inner">
        <Link to={homePathFor(user.role)} className="header__logo" aria-label="GSB, retour à l'accueil">
          <Logo variant={overHero ? 'light' : 'dark'} />
        </Link>

        <div className="header__nav">
          <SlideTabs
            links={navLinksFor(user.role)}
            label="Navigation principale"
            openMenuId={openMenuId}
            onToggleMenu={toggleMenu}
          />
        </div>

        <div className="header__actions">
          {isProfessional && (
          <Link
            to="/panier"
            className="header__icon-btn header__cart"
            aria-label={itemCount > 0 ? `Panier, ${itemCount} article${itemCount > 1 ? 's' : ''}` : 'Panier'}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="header__cart-count" aria-hidden="true">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
          )}

          <Link to="/compte" className="header__user">
            <span className="header__avatar" aria-hidden="true">
              {initials}
            </span>
            <span className="header__user-text">
              <strong>
                {user.title} {user.firstName} {user.lastName}
              </strong>
              <span>{roleLabel(user.role)}</span>
            </span>
          </Link>

          <button type="button" className="header__icon-btn" onClick={handleLogout} aria-label="Se déconnecter">
            <LogoutIcon />
          </button>
        </div>
      </div>

      {isProfessional && openMenuId === CATALOGUE_MENU_ID && (
        <>
          {/* Voile sur la page : un clic dessus (donc en dehors du menu) referme le menu. */}
          <div className="header__backdrop" onClick={closeMenu} aria-hidden="true" />
          <CatalogueMenu id={CATALOGUE_MENU_ID} onClose={closeMenu} />
        </>
      )}
    </header>
  );
}
