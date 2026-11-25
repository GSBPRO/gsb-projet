import { useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';

// Raccourci pour lire l'utilisateur connecté et les actions login / logout.
export default function useAuth() {
  const auth = useContext(AuthContext); // lit la valeur donnée par <AuthProvider>
  // Si elle est vide, le composant est hors du Provider : on signale l'oubli tout de suite avec un message clair.
  if (!auth) {
    throw new Error('useAuth doit être utilisé à l’intérieur de <AuthProvider>.');
  }
  return auth;
}
