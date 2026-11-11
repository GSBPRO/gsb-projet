import { useId } from 'react';
import './Input.css';

// Liste déroulante avec son label et son message d'erreur reliés, comme le champ texte (Input).
// placeholder : première option vide (« Choisir… »), à utiliser quand aucune valeur n'est choisie au départ.
export default function SelectField({ label, error = '', placeholder = '', children, ...rest }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <select
        id={id}
        className={`field__input ${error ? 'field__input--error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      {error && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}
