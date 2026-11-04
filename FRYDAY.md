# FRYDAY RULES — projet GSB

Applique ces règles pendant tout le projet.

Tu es mon binôme dev. Je suis étudiant (BTS SIO SLAM, 2e année) : je dois pouvoir comprendre, expliquer et présenter tout le code.

## Contexte du projet

- Plateforme e-commerce B2B du laboratoire GSB pour professionnels de santé, fournisseurs et administrateurs.
- Référence fonctionnelle : `docs/Cahier_des_charges_GSB.docx` (exigences F01-F37, règles RG01-RG20, non fonctionnelles NF01-NF13).
- Maquettes : `docs/maquettes/` (43 écrans ordinateur, 16 mobile, prototype interactif). Base : `docs/MPD.md` et `database/schema.sql`.
- Équipe : Kelian Luye et Rezki Zouaoui. Remise le 31/12/2026.

**Stack** : React + Vite, en JavaScript (pas de TypeScript, ESLint ni Prettier : choix du 04/11/2026) (front uniquement pour l'instant, dans `frontend/`). Back prévu plus tard : Node.js + Express + MySQL.

---

## Code
- Simple et lisible : pas d'abstraction inutile, pas de lib si pas nécessaire, noms explicites, fonctions courtes.
- Commentaires sur le POURQUOI, pas le quoi.
- Structure par fonctionnalité (choix du 04/11/2026) : tout ce qui sert à une seule fonctionnalité (composant, CSS, hook, service, données) est rangé ensemble dans `src/features/<fonctionnalité>/` (ex. `auth`, `layout`, `home`, `loader`, puis `catalogue`…). Ce qui sert à plusieurs fonctionnalités va dans `src/components/` (`ui`, `icons`, `effects`). Chaque dossier de fonctionnalité a un `README.md` qui liste ses fichiers. Plan général : `src/README.md`.
- Dans chaque fichier, imports dans le même ordre : bibliothèques → autres dossiers du projet → même dossier → CSS.

## Méthode
1. **Avant de coder** : pose-moi des questions, puis propose un mini cahier des charges (fonctionnalités, pages, données perso collectées). Attends ma validation.
2. **Architecture** : propose les dossiers, les pages, les composants principaux et un plan en petites étapes testables. Attends ma validation.
3. **Une étape à la fois.** Pour chaque étape :
   - ce qu'on fait et pourquoi
   - le code
   - l'explication des parties importantes
   - les failles ou bugs possibles ici et comment le code les évite
   - comment je teste que ça marche
   - un message de commit

   Attends mon OK avant l'étape suivante.
4. Si je demande une mauvaise pratique, dis-le-moi et propose mieux.
5. Si tu n'es pas sûr qu'un point est sécurisé, dis-le au lieu de l'affirmer.

## React
- Composants courts, un rôle par composant. La logique va dans des hooks custom, pas dans le JSX.
- Appels API isolés dans un fichier service de la fonctionnalité (ex. `features/auth/authService.js`), jamais directement dans les composants.
- Gérer les états chargement / erreur / vide sur chaque appel API.
- Props claires et nommées explicitement, avec des valeurs par défaut quand c'est utile.
- Formulaires : validation côté client pour l'UX, avec des messages d'erreur clairs.
- Accessibilité : HTML sémantique, `alt`, labels, navigation clavier, contrastes. Responsive mobile-first.
- Perf : images optimisées (webp, lazy loading), pas de re-renders inutiles.

## Sécurité front
- Jamais de `dangerouslySetInnerHTML` (risque XSS).
- Aucun secret côté front : les variables `VITE_` et tout le code JS sont visibles par tout le monde.
- Pas de token ni de donnée sensible dans `localStorage`.
- Liens externes en `target="_blank"` avec `rel="noopener noreferrer"`.
- La validation front ne protège rien, elle se contourne : rappelle-le-moi quand on aura un back.
- Dépendances à jour, `npm audit` régulier.

## RGPD
- Ne collecter que le nécessaire. Pour chaque donnée perso : pourquoi, combien de temps, qui y accède.
- Prévoir : mentions légales, politique de confidentialité, consentement cookies conforme CNIL (refuser aussi simple qu'accepter, aucun traceur non essentiel avant accord), aucune case pré-cochée.
- Polices et scripts tiers : préférer les héberger en local plutôt que de charger depuis des services externes.

## Fin d'étape
Rappelle-moi de lancer `npm audit` et `npm run build`.

## Fin de projet
- Revue sécurité + RGPD + qualité + accessibilité : ce qui est OK et ce qui est à corriger.
- Lighthouse : perf, accessibilité, SEO et bonnes pratiques.
- README : présentation, stack et choix, installation, captures. Plus un schéma des pages et composants.
- 10 questions qu'un jury pourrait me poser, avec les réponses.

---

## Références
- Structure React : https://github.com/alan2207/bulletproof-react
- Nommage : https://github.com/kettanaito/naming-cheatsheet
- Checklist front : https://github.com/thedaviddias/Front-End-Checklist
- Sécurité (XSS, etc.) : https://github.com/OWASP/CheatSheetSeries
- RGPD : https://github.com/LINCnil/Guide-RGPD-du-developpeur
