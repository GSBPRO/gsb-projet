# Mon compte (`features/account`)

L'espace personnel, commun aux trois profils (professionnel, fournisseur, administrateur) : consulter et modifier ses informations (F05) et changer son mot de passe.

| Fichier | Rôle |
|---|---|
| `AccountPage.jsx` + `.css` | la page `/compte` : informations en lecture, formulaire de profil, changement de mot de passe |
| `useProfileForm.js` | la logique du formulaire de profil : valeurs, vérification, envoi |

Le formulaire de mot de passe (`PasswordForm`) vit dans `features/auth/` car il sert aussi à la première connexion.

## À savoir
- Seuls la fonction et le téléphone sont modifiables. L'email, le nom et le rôle sont gérés par l'administrateur (RG01) : `authService.updateProfile` ne retient que ces deux champs.
- Pour changer son mot de passe, il faut redonner l'ancien.
- En démonstration, les modifications restent en mémoire jusqu'à l'actualisation de la page. **Le serveur devra refaire chaque contrôle** et stocker le mot de passe haché (NF01).

## Données personnelles (RGPD)
| Donnée | Pourquoi | Combien de temps | Qui y accède |
|---|---|---|---|
| Téléphone, fonction | joindre l'utilisateur, contexte professionnel | tant que le compte est actif (à définir avec le serveur) | l'utilisateur et l'administrateur |
