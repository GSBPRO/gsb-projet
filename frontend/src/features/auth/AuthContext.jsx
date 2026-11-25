import { createContext, useState } from 'react';
import * as authService from './authService.js';

// Le « contexte » est une boîte partagée : tout composant de l'appli peut y lire l'utilisateur connecté
// sans qu'on le passe de composant en composant. null = valeur par défaut hors de <AuthProvider>.
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

  // Tout ce qui est dans « value » devient lisible via useAuth() par les composants enfants.
  return <AuthContext.Provider value={{ user, login, logout, changePassword, updateProfile }}>{children}</AuthContext.Provider>;
}
