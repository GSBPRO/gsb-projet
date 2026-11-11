import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import usePasswordForm from './usePasswordForm.js';
import './PasswordForm.css';

// Formulaire « changer mon mot de passe » : même composant à la première connexion et dans « Mon compte ».
export default function PasswordForm({ onDone, submitLabel = 'Changer le mot de passe' }) {
  const { values, errors, formError, isSubmitting, handleChange, handleSubmit } = usePasswordForm(onDone);

  return (
    <form className="password-form" onSubmit={handleSubmit} noValidate>
      <Input
        label="Mot de passe actuel"
        type="password"
        name="current"
        autoComplete="current-password"
        required
        value={values.current}
        onChange={handleChange}
        error={errors.current}
      />
      <Input
        label="Nouveau mot de passe"
        type="password"
        name="next"
        autoComplete="new-password"
        required
        value={values.next}
        onChange={handleChange}
        error={errors.next}
      />
      <p className="password-form__hint">8 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.</p>
      <Input
        label="Confirmer le nouveau mot de passe"
        type="password"
        name="confirm"
        autoComplete="new-password"
        required
        value={values.confirm}
        onChange={handleChange}
        error={errors.confirm}
      />
      {formError && (
        <p className="password-form__error" role="alert">
          {formError}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement…' : submitLabel}
      </Button>
    </form>
  );
}
