import { useState } from 'react';
import { AccountError } from './authService.js';
import { passwordError } from './validators.js';
import useAuth from './useAuth.js';

// Logique du formulaire de changement de mot de passe, utilisé à la première connexion et dans « Mon compte ».
// onDone : appelé quand le changement a réussi (redirection ou message).
export default function usePasswordForm(onDone) {
  const { changePassword } = useAuth();
  const [values, setValues] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  function validate() {
    const found = {};
    if (!values.current) found.current = 'Saisissez votre mot de passe actuel.';
    const rule = passwordError(values.next);
    if (rule) found.next = rule;
    if (values.confirm !== values.next) found.confirm = 'Les deux mots de passe ne sont pas identiques.';
    return found;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const found = validate();
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    setIsSubmitting(true);
    try {
      await changePassword(values.current, values.next);
      setValues({ current: '', next: '', confirm: '' });
      onDone?.();
    } catch (error) {
      if (error instanceof AccountError && error.code === 'CURRENT') {
        setErrors({ current: error.message });
      } else if (error instanceof AccountError) {
        setErrors({ next: error.message });
      } else {
        setFormError('Le mot de passe n’a pas pu être changé. Réessayez dans un instant.');
      }
    }
    setIsSubmitting(false);
  }

  return { values, errors, formError, isSubmitting, handleChange, handleSubmit };
}
