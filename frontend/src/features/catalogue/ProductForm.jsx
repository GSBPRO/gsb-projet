import { useId } from 'react';
import Button from '../../components/ui/Button.jsx';
import ButtonLink from '../../components/ui/ButtonLink.jsx';
import Input from '../../components/ui/Input.jsx';
import SelectField from '../../components/ui/SelectField.jsx';
import { LIMITS, VAT_RATES } from './productManagementService.js';
import useProductForm from './useProductForm.js';
import './ProductForm.css';

// Formulaire produit partagé : l'administrateur (avec le choix du fournisseur) et le fournisseur (sa proposition).
// Props : initial (valeurs de départ), categories, laboratories (si fourni, on affiche le choix du fournisseur),
// showStock (stock de départ, à la création seulement), requireImage, onSubmit, cancelTo, submitLabel.
export default function ProductForm({
  initial = {},
  categories,
  laboratories = null,
  showStock = false,
  requireImage = false,
  onSubmit,
  cancelTo,
  submitLabel,
}) {
  const { values, errors, formError, isSubmitting, handleChange, handleImageChange, handleSubmit } = useProductForm(
    initial,
    onSubmit,
    { requireImage, validateStock: showStock },
  );
  const imageId = useId();

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <Input label="Nom du produit" name="name" required maxLength={LIMITS.name} value={values.name} onChange={handleChange} error={errors.name} />
      <Input label="Conditionnement" name="format" required maxLength={LIMITS.format} placeholder="Boîte de 16 comprimés" value={values.format} onChange={handleChange} error={errors.format} />
      <Input multiline rows={4} label="Description" name="description" required maxLength={LIMITS.description} value={values.description} onChange={handleChange} error={errors.description} />

      <div className="product-form__row">
        <SelectField label="Catégorie" name="categoryId" value={values.categoryId} onChange={handleChange} error={errors.categoryId} placeholder="Choisir…">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>
        {laboratories && (
          <SelectField label="Fournisseur" name="laboratoryId" value={values.laboratoryId} onChange={handleChange} error={errors.laboratoryId} placeholder="Choisir…">
            {laboratories.map((laboratory) => (
              <option key={laboratory.id} value={laboratory.id}>
                {laboratory.name}
              </option>
            ))}
          </SelectField>
        )}
      </div>

      <div className="product-form__row">
        <Input label="Prix HT (€)" name="priceHt" type="number" min="0" step="0.01" required value={values.priceHt} onChange={handleChange} error={errors.priceHt} />
        <SelectField label="TVA" name="vatRate" value={values.vatRate} onChange={handleChange} error={errors.vatRate}>
          {VAT_RATES.map((rate) => (
            <option key={rate} value={rate}>
              {rate.toLocaleString('fr-FR')} %
            </option>
          ))}
        </SelectField>
        {showStock && (
          <Input label="Stock de départ" name="stock" type="number" min="0" step="1" required value={values.stock} onChange={handleChange} error={errors.stock} />
        )}
      </div>

      <div className="field">
        <label htmlFor={imageId} className="field__label">
          Image{requireImage && <span aria-hidden="true"> *</span>}
        </label>
        <input id={imageId} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} aria-invalid={errors.image ? 'true' : 'false'} />
        <p className="product-form__hint">JPEG, PNG ou WebP, 3 Mo maximum.</p>
        {values.image && <img className="product-form__preview" src={values.image} alt="Aperçu du produit" />}
        {errors.image && <p className="field__error">{errors.image}</p>}
      </div>

      {formError && (
        <p className="product-form__error" role="alert">
          {formError}
        </p>
      )}

      <div className="product-form__actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement…' : submitLabel}
        </Button>
        <ButtonLink to={cancelTo} variant="secondary">
          Annuler
        </ButtonLink>
      </div>
    </form>
  );
}
