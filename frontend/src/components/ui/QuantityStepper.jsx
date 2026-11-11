import './QuantityStepper.css';

// Choix d'une quantité avec « − » et « + », partagé par la fiche produit et le panier.
// Pas de champ de saisie libre : impossible de taper une valeur absurde (0, négative, 1e9…).
export default function QuantityStepper({ value, max, onChange, disabled = false, label = 'Quantité' }) {
  return (
    <div className="quantity-stepper" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= 1}
        aria-label={`Diminuer : ${label}`}
      >
        −
      </button>
      {/* aria-live : le nouveau nombre est annoncé par les lecteurs d'écran. */}
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label={`Augmenter : ${label}`}
      >
        +
      </button>
    </div>
  );
}
