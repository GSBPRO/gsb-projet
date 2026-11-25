import { useState } from 'react';
import useAuth from '../auth/useAuth.js';
import { isValidPhone } from '../auth/validators.js';

// Logique du formulaire de profil (F05) : seuls le téléphone et la fonction sont modifiables.
export default function useProfileForm() {
  const { user, updateProfile } = useAuth();
  // « ?? '' » : si le champ n'existe pas encore (compte sans téléphone), on met un texte vide pour que le champ reste contrôlé.
  const [values, setValues] = useState({ phone: user.phone ?? '', profession: user.profession ?? '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange (event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value })); // on garde les anciennes valeurs, on change seulement le champ modifié
    setMessage({ type: '', text: '' }); // l'ancien message n'a plus de sens dès qu'on retape
  }

  // Appelée au clic sur « Enregistrer ». async : la fonction attend une réponse (le futur serveur) avec « await ».
  async function handleSubmit(event) {
    event.preventDefault(); // évite le rechargement de la page
    if (isSubmitting) return;

    const found = {}; // boîte vide où l'on range les erreurs trouvées dans le formulaire
    if (!isValidPhone(values.phone)) found.phone = 'Saisissez un numéro valide (chiffres, espaces, + . -).';
    if (values.profession.trim().length > 80) found.profession = '80 caractères maximum.';
    setErrors(found);
    if (Object.keys(found).length > 0) return; // au moins une erreur : on n'envoie rien

    setIsSubmitting(true); // désactive le bouton pendant l'envoi
    try {
      await updateProfile(values);
      setMessage({ type: 'success', text: 'Vos informations ont été enregistrées.' });
    } catch {
      setMessage({ type: 'error', text: 'Vos informations n’ont pas pu être enregistrées. Réessayez dans un instant.' });
    }
    setIsSubmitting(false); // après le try/catch : le bouton se réactive dans les deux cas, succès ou échec
  }

  return { values, errors, message, isSubmitting, handleChange, handleSubmit };
}
