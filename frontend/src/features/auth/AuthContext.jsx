import { createContext, useState } from 'react';
import * as authService from './authService.js';

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

  // Après un changement de mot de passe ou de profil, on remplace l'utilisateur gardé en mémoire.
  async function changePassword(currentPassword, newPassword) {
    setUser(await authService.changePassword(user.id, currentPassword, newPassword));
  }

  async function updateProfile(fields) {
    setUser(await authService.updateProfile(user.id, fields));
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout, changePassword, updateProfile }}>{children}</AuthContext.Provider>;
}
