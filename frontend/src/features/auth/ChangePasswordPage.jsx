import { Navigate, useNavigate } from 'react-router-dom';
import LiquidBackground from '../../components/effects/LiquidBackground.jsx';
import Logo from '../../components/ui/Logo.jsx';
import { homePathFor } from './roles.js';
import PasswordForm from './PasswordForm.jsx';
import useAuth from './useAuth.js';
import './LoginPage.css';

// Page affichée à la première connexion : le mot de passe provisoire doit être changé avant tout (F04, RG04).
// Elle réutilise le décor de la connexion. Aucune autre page n'est accessible tant que ce n'est pas fait.
export default function ChangePasswordPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }
  // Rien à changer (ou déjà fait) : on va à sa page d'accueil.
  if (!user.mustChangePassword) {
    return <Navigate to={homePathFor(user.role)} replace />;
  }

  return (
    <div className="login">
      <LiquidBackground />
      <main className="login__content">
        <header className="login__header">
          <Logo />
          <p className="login__eyebrow">Première connexion</p>
          <h1 className="login__title">
            Choisissez votre
            <br />
            mot de passe.
          </h1>
        </header>
        <PasswordForm onDone={() => navigate(homePathFor(user.role), { replace: true })} submitLabel="Enregistrer et continuer" />
        <footer className="login__footer">
          <button
            type="button"
            className="login__link"
            onClick={() => {
              logout();
              navigate('/connexion', { replace: true });
            }}
          >
            Se déconnecter
          </button>
        </footer>
      </main>
    </div>
  );
}
