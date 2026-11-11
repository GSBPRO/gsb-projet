import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth.js';
import useCart from '../cart/useCart.js';
import { ADDRESS_MAX, ADDRESS_MIN, createOrder, OrderError } from './orderService.js';

// Toute la logique de la validation de commande : valeurs, erreurs, envoi, redirection.
// Il y a deux sortes d'erreurs : celle d'un champ (adresse) et celle de la commande entière (stock, paiement).
export default function useCheckoutForm() {
  const { user } = useAuth();
  const { items, clear } = useCart();
  const navigate = useNavigate();

  const [values, setValues] = useState({ address: '', simulateFailure: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [stockIssues, setStockIssues] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Une fois la commande créée, le panier se vide : sans ce drapeau, la page croirait que le panier
  // est vide et renverrait vers /panier au lieu d'afficher la confirmation.
  const [isPlaced, setIsPlaced] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
  }

  // Vérification pour aider l'utilisateur : le service refait le même contrôle.
  function validate() {
    const length = values.address.trim().length;
    if (length < ADDRESS_MIN || length > ADDRESS_MAX) {
      return { address: `Saisissez l’adresse complète de livraison (${ADDRESS_MIN} à ${ADDRESS_MAX} caractères).` };
    }
    return {};
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return; // un double clic ne doit pas créer deux commandes

    const found = validate();
    setErrors(found);
    setFormError('');
    setStockIssues([]);
    if (Object.keys(found).length > 0) return;

    setIsSubmitting(true);
    try {
      const order = await createOrder(user.id, {
        items,
        address: values.address,
        simulateFailure: values.simulateFailure,
      });
      setIsPlaced(true);
      navigate(`/commande/confirmation/${order.id}`, { replace: true });
      clear();
    } catch (error) {
      if (error instanceof OrderError && error.code === 'ADDRESS') {
        setErrors({ address: error.message });
      } else if (error instanceof OrderError) {
        setFormError(error.message);
        setStockIssues(error.details);
      } else {
        // Erreur inattendue : message clair, le détail technique ne sert pas à l'utilisateur.
        setFormError('La commande n’a pas pu être enregistrée. Réessayez dans un instant.');
      }
      setIsSubmitting(false);
    }
  }

  return { values, errors, formError, stockIssues, isSubmitting, isPlaced, handleChange, handleSubmit };
}
