# Connexion (`features/auth`)

Connexion **fictive** pour l'instant : elle sera remplacée par l'API Express à la fin du front.

| Fichier | Rôle |
|---|---|
| `LoginPage.jsx` + `.css` | l'écran de connexion (formulaire, œil du mot de passe, bouton goutte) |
| `useLoginForm.js` | la logique du formulaire : valeurs, vérification, envoi, redirection |
| `validators.js` | vérifie le format d'un e-mail (aide l'utilisateur, ne protège rien) |
| `authService.js` | vérifie les identifiants et garde la session (sera remplacé par l'API) |
| `mockUsers.js` | les comptes de démo : un par profil, dont un à première connexion (à supprimer avec la connexion fictive) |
| `roles.js` | les trois profils (Professionnel, Fournisseur, Administrateur), leur page d'accueil et leur libellé |
| `ChangePasswordPage.jsx` | la page de première connexion : mot de passe à changer avant tout (F04, RG04) |
| `PasswordForm.jsx` + `.css`, `usePasswordForm.js` | le formulaire de changement de mot de passe (aussi utilisé dans « Mon compte ») |
| `AuthContext.jsx` | garde l'utilisateur connecté pour toute l'application |
| `useAuth.js` | raccourci pour lire l'utilisateur connecté |
| `ProtectedRoute.jsx` | renvoie vers la connexion si on n'est pas connecté, vers le changement de mot de passe s'il est provisoire, vers son accueil si le profil ne convient pas |

**Comptes de démo** : voir `mockUsers.js`. Les changements faits pendant la démo (mot de passe, profil, comptes créés) restent en mémoire jusqu'à l'actualisation.
