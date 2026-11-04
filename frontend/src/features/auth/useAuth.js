import { useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';

// Raccourci pour lire l'utilisateur connecté et les actions login / logout.
export default function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error('useAuth doit être utilisé à l’intérieur de <AuthProvider>.');
  }
  return auth;
}
