import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from '../utils/validators.js';
import useAuth from './useAuth.js';

// Toute la logique du formulaire de connexion : valeurs, erreurs, envoi, redirection.
export default function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  function validate() {
    const found = {};
    if (!isValidEmail(values.email)) {
      found.email = 'Saisissez une adresse email valide, par exemple nom@etablissement.fr.';
    }
    if (!values.password) {
      found.password = 'Saisissez votre mot de passe.';
    }
    return found;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return; // évite un double envoi si on clique deux fois

    const found = validate();
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate('/accueil', { replace: true });
    } catch (error) {
      setFormError(error.message);
      setIsSubmitting(false);
    }
  }

  return { values, errors, formError, isSubmitting, handleChange, handleSubmit };
}
