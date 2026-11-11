import { useState } from 'react';
import { ImageError, readProductImage } from './imageUpload.js';
import { ProductError, validateProduct } from './productManagementService.js';

// Logique du formulaire produit (admin et fournisseur) : valeurs, vérification, image, envoi.
// onSubmit(values) : appelle le service ; il peut lever une ProductError (champs en erreur).
// options : { requireImage, validateStock } ; initial : les valeurs de départ (modification) ou {}.
export default function useProductForm(initial, onSubmit, options) {
  const [values, setValues] = useState({
    name: initial.name ?? '',
    format: initial.format ?? '',
    description: initial.description ?? '',
    categoryId: initial.categoryId ?? '',
    laboratoryId: initial.laboratoryId ?? '',
    priceHt: initial.priceHt ?? '',
    vatRate: initial.vatRate ?? 20,
    stock: initial.stock ?? 0,
    image: initial.image ?? '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  async function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const image = await readProductImage(file);
      setValues((previous) => ({ ...previous, image }));
      setErrors((previous) => ({ ...previous, image: '' }));
    } catch (error) {
      setErrors((previous) => ({ ...previous, image: error instanceof ImageError ? error.message : 'Image illisible.' }));
    }
    // Permet de rechoisir le même fichier après une erreur.
    event.target.value = '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const found = validateProduct(values, options);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      if (error instanceof ProductError && error.code === 'VALIDATION') {
        setErrors(error.fields);
      } else {
        setFormError('Le produit n’a pas pu être enregistré. Réessayez dans un instant.');
      }
    }
    setIsSubmitting(false);
  }

  return { values, errors, formError, isSubmitting, handleChange, handleImageChange, handleSubmit };
}
