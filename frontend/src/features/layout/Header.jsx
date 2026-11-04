import { Link, useNavigate } from 'react-router-dom';
import CartIcon from '../../components/icons/CartIcon.jsx';
import LogoutIcon from '../../components/icons/LogoutIcon.jsx';
import Logo from '../../components/ui/Logo.jsx';
import useAuth from '../auth/useAuth.js';
import CatalogueMenu from '../catalogue/CatalogueMenu.jsx';
import SlideTabs from './SlideTabs.jsx';
import useMenuToggle from './useMenuToggle.js';
import './Header.css';

const CATALOGUE_MENU_ID = 'catalogue-menu';

const NAV_LINKS = [
  { to: '/accueil', label: 'Accueil' },
  { to: '/catalogue', label: 'Catalogue', menuId: CATALOGUE_MENU_ID },
  { to: '/commandes', label: 'Mes commandes' },
];

// En-tête de l'espace professionnel : logo, onglets (dont le menu du catalogue), panier, compte, déconnexion.
// overHero : l'en-tête est posé sur un bandeau sombre (logo et texte en blanc).
export default function Header({ overHero = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { openMenuId, toggleMenu, closeMenu } = useMenuToggle();
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  function handleLogout() {
    logout();
    navigate('/connexion', { replace: true });
  }

  return (
    <header className={`header${overHero ? ' header--over-hero' : ''}`}>
      <div className="header__inner">
        <Link to="/accueil" className="header__logo" aria-label="GSB, retour à l'accueil">
          <Logo variant={overHero ? 'light' : 'dark'} />
        </Link>

        <div className="header__nav">
          <SlideTabs
            links={NAV_LINKS}
            label="Navigation principale"
            openMenuId={openMenuId}
            onToggleMenu={toggleMenu}
          />
        </div>

        <div className="header__actions">
          <Link to="/panier" className="header__icon-btn" aria-label="Panier">
            <CartIcon />
          </Link>

          <Link to="/compte" className="header__user">
            <span className="header__avatar" aria-hidden="true">
              {initials}
            </span>
            <span className="header__user-text">
              <strong>
                {user.title} {user.firstName} {user.lastName}
              </strong>
              <span>Professionnel de santé</span>
            </span>
          </Link>

          <button type="button" className="header__icon-btn" onClick={handleLogout} aria-label="Se déconnecter">
            <LogoutIcon />
          </button>
        </div>
      </div>

      {openMenuId === CATALOGUE_MENU_ID && (
        <>
          {/* Voile sur la page : un clic dessus (donc en dehors du menu) referme le menu. */}
          <div className="header__backdrop" onClick={closeMenu} aria-hidden="true" />
          <CatalogueMenu id={CATALOGUE_MENU_ID} onClose={closeMenu} />
        </>
      )}
    </header>
  );
}
