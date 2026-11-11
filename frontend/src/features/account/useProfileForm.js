import { useState } from 'react';
import useAuth from '../auth/useAuth.js';
import { isValidPhone } from '../auth/validators.js';

// Logique du formulaire de profil (F05) : seuls le téléphone et la fonction sont modifiables.
export default function useProfileForm() {
  const { user, updateProfile } = useAuth();
  const [values, setValues] = useState({ phone: user.phone ?? '', profession: user.profession ?? '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setMessage({ type: '', text: '' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const found = {};
    if (!isValidPhone(values.phone)) found.phone = 'Saisissez un numéro valide (chiffres, espaces, + . -).';
    if (values.profession.trim().length > 80) found.profession = '80 caractères maximum.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setIsSubmitting(true);
    try {
      await updateProfile(values);
      setMessage({ type: 'success', text: 'Vos informations ont été enregistrées.' });
    } catch {
      setMessage({ type: 'error', text: 'Vos informations n’ont pas pu être enregistrées. Réessayez dans un instant.' });
    }
    setIsSubmitting(false);
  }

  return { values, errors, message, isSubmitting, handleChange, handleSubmit };
}
