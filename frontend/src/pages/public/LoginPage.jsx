import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Logo from '../../components/layout/Logo.jsx';
import loadGlassMolecule from '../../components/home/loadGlassMolecule.js';
import EyeIcon from '../../components/icons/EyeIcon.jsx';
import LiquidBackground from '../../components/login/LiquidBackground.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import useAuth from '../../hooks/useAuth.js';
import useLoginForm from '../../hooks/useLoginForm.js';
import './LoginPage.css';

// Écran de connexion : l'affichage est ici, la logique est dans useLoginForm.
export default function LoginPage() {
  const { user } = useAuth();
  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);

  // Préchargement : la molécule 3D de l'accueil se télécharge pendant qu'on tape son mot de passe.
  useEffect(() => {
    loadGlassMolecule();
  }, []);

  // Déjà connecté : inutile de revoir le formulaire.
  if (user) {
    return <Navigate to="/accueil" replace />;
  }

  return (
    <div className="login">
      <LiquidBackground />

      <main className="login__content">
        <header className="login__header">
          <Logo />
          <p className="login__eyebrow">Espace réservé aux professionnels de santé</p>
          <h1 className="login__title">
            Accès
            <br />
            professionnel.
          </h1>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Email professionnel"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="nom@etablissement.fr"
            required
            value={values.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            required
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            endAdornment={
              <button
                type="button"
                className="field__adornment"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                aria-pressed={showPassword}
              >
                <EyeIcon />
              </button>
            }
          />

          {/* role="alert" : le message est lu tout de suite par les lecteurs d'écran */}
          {formError && (
            <p className="login__error" role="alert">
              {formError}
            </p>
          )}

          {/* La goutte derrière le bouton se déforme au survol grâce au filtre « liquide ». */}
          <div className="login__submit">
            <span className="login__drop" aria-hidden="true" />
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Connexion…' : 'Se connecter'}
            </Button>
          </div>
        </form>

        <footer className="login__footer">
          <p>Mot de passe oublié ? Contactez votre administrateur GSB.</p>
        </footer>
      </main>
    </div>
  );
}
