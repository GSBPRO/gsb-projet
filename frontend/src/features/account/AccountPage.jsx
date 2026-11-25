import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import PasswordForm from '../auth/PasswordForm.jsx';
import { roleLabel } from '../auth/roles.js';
import useAuth from '../auth/useAuth.js';
import useProfileForm from './useProfileForm.js';
import './AccountPage.css';

// Mon compte : consulter et modifier ses informations (F05) et changer son mot de passe.
// Identique pour les trois profils. L'e-mail et le rôle sont affichés mais pas modifiables (RG01).
export default function AccountPage() {
  const { user } = useAuth();
  const { values, errors, message, isSubmitting, handleChange, handleSubmit } = useProfileForm();
  // false au départ ; passe à true quand le mot de passe a été changé, pour afficher le message de succès.
  const [passwordChanged, setPasswordChanged] = useState(false);

  return (
    <div className="account-page">
      <PageHeader title="Mon compte" subtitle="Vos informations et votre mot de passe." />

      <div className="account-page__grid">
        <section className="account-page__card" aria-labelledby="profile-title">
          <h2 id="profile-title">Mes informations</h2>
          <dl>
            <div>
              <dt>Nom</dt>
              <dd>
                {user.title} {user.firstName} {user.lastName}
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Profil</dt>
              <dd>{roleLabel(user.role)}</dd>
            </div>
          </dl>
          <p className="muted account-page__note">
            Pour modifier votre nom ou votre email, contactez un administrateur GSB.
          </p>

          {/* noValidate : on affiche NOS messages d'erreur plutôt que les bulles du navigateur. */}
          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Fonction"
              name="profession"
              maxLength={80}
              value={values.profession} // champ « contrôlé » : sa valeur vient de l'état React, pas du navigateur
              onChange={handleChange}
              error={errors.profession}
            />
            <Input
              label="Téléphone"
              type="tel"
              name="phone"
              autoComplete="tel"
              maxLength={20}
              value={values.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            {/* « a && b » : on affiche b seulement si a n'est pas vide. role="status" : lu par les lecteurs d'écran. */}
            {message.text && (
              <p className={`account-page__message account-page__message--${message.type}`} role="status">
                {message.text}
              </p>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </form>
        </section>

        <section className="account-page__card" aria-labelledby="password-title">
          <h2 id="password-title">Changer mon mot de passe</h2>
          {/* () => ... : une fonction qu'on donne au formulaire, il l'appellera lui-même une fois le mot de passe changé. */}
          <PasswordForm onDone={() => setPasswordChanged(true)} />
          {passwordChanged && (
            <p className="account-page__message account-page__message--success" role="status">
              Votre mot de passe a été changé.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
