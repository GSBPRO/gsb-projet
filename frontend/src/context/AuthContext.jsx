import { createContext, useState } from 'react';
import * as authService from '../services/authService.js';

export const AuthContext = createContext(null);

// Garde l'utilisateur connecté pour toute l'application.
// Au chargement, on retrouve la session de l'onglet : une actualisation ne déconnecte plus.
export function AuthProvider({ children }) {
  // Fonction passée à useState : la session n'est lue qu'une fois, au premier affichage.
  const [user, setUser] = useState(() => authService.restoreSession());

  async function login(email, password) {
    const loggedUser = await authService.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
