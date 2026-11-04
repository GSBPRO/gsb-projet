# Connexion (`features/auth`)

Connexion **fictive** pour l'instant : elle sera remplacée par l'API Express à la fin du front.

| Fichier | Rôle |
|---|---|
| `LoginPage.jsx` + `.css` | l'écran de connexion (formulaire, œil du mot de passe, bouton goutte) |
| `useLoginForm.js` | la logique du formulaire : valeurs, vérification, envoi, redirection |
| `validators.js` | vérifie le format d'un e-mail (aide l'utilisateur, ne protège rien) |
| `authService.js` | vérifie les identifiants et garde la session (sera remplacé par l'API) |
| `mockUsers.js` | le compte de démo (à supprimer avec la connexion fictive) |
| `AuthContext.jsx` | garde l'utilisateur connecté pour toute l'application |
| `useAuth.js` | raccourci pour lire l'utilisateur connecté |
| `ProtectedRoute.jsx` | renvoie vers la connexion si on n'est pas connecté |
