import { useId } from 'react';
import './Input.css';

// Champ avec son label et son message d'erreur reliés, pour les lecteurs d'écran.
export default function Input({ label, error = '', required = false, endAdornment = null, ...rest }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <div className="field__control">
        <input
          id={id}
          className={`field__input ${error ? 'field__input--error' : ''}`}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        {endAdornment}
      </div>
      {error && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}
