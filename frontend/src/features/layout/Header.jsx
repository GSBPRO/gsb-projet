import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth.js';
import CartIcon from '../../components/icons/CartIcon.jsx';
import LogoutIcon from '../../components/icons/LogoutIcon.jsx';
import Logo from '../../components/ui/Logo.jsx';
import SlideTabs from './SlideTabs.jsx';
import './Header.css';

const NAV_LINKS = [
  { to: '/accueil', label: 'Accueil' },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/commandes', label: 'Mes commandes' },
];

// En-tête de l'espace professionnel : logo, onglets, panier, compte, déconnexion.
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  function handleLogout() {
    logout();
    navigate('/connexion', { replace: true });
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/accueil" className="header__logo" aria-label="GSB, retour à l'accueil">
          <Logo />
        </Link>

        <div className="header__nav">
          <SlideTabs links={NAV_LINKS} label="Navigation principale" />
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
    </header>
  );
}
