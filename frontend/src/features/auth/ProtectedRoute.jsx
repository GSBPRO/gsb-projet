import { Navigate, Outlet } from 'react-router-dom';
import { homePathFor } from './roles.js';
import useAuth from './useAuth.js';

// Bloque les pages réservées aux personnes connectées (F07) et, avec « roles », à certains profils (NF02).
// - pas connecté : retour à la connexion ;
// - mot de passe provisoire : on force le changement avant toute autre page (F04, RG04) ;
// - mauvais profil : retour à la page d'accueil de son profil.
// Sans enfant, la route sert de garde pour toutes les pages imbriquées (<Outlet />).
// Ce contrôle n'est qu'un confort d'affichage : le serveur devra aussi vérifier chaque requête (NF02).
export default function ProtectedRoute({ children = <Outlet />, roles = null }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }
  if (user.mustChangePassword) {
    return <Navigate to="/mot-de-passe" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homePathFor(user.role)} replace />;
  }
  return children;
}
