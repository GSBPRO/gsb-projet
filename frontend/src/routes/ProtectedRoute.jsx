import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

// Bloque les pages réservées aux personnes connectées (F07).
// Ce contrôle n'est qu'un confort d'affichage : le serveur devra aussi vérifier chaque requête (NF02).
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }
  return children;
}
