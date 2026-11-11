import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import ButtonLink from '../../components/ui/ButtonLink.jsx';
import { formatPrice, formatVatRate } from '../../utils/price.js';
import './CartSummary.css';

// Récapitulatif du panier : totaux HT, TVA par taux et TTC (F13 à F15), avertissements de stock (F16)
// et actions (ajuster, vider, passer commande).
export default function CartSummary({ totals, itemCount, stockIssues, onAdjustStock, onClear }) {
  // Vider le panier efface tout : on demande une confirmation, sans fenêtre du navigateur (elles gênent les tests et l'accessibilité).
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const hasStockIssues = stockIssues.length > 0;

  return (
    <aside className="cart-summary" aria-labelledby="cart-summary-title">
      <h2 id="cart-summary-title" className="cart-summary__title">
        Récapitulatif
      </h2>
      <p className="cart-summary__count">
        {itemCount} article{itemCount > 1 ? 's' : ''}
      </p>

      <dl className="cart-summary__totals">
        <div>
          <dt>Total HT</dt>
          <dd>{formatPrice(totals.ht)}</dd>
        </div>
        {totals.vatByRate.map((vat) => (
          <div key={vat.rate}>
            <dt>TVA {formatVatRate(vat.rate)}</dt>
            <dd>{formatPrice(vat.amount)}</dd>
          </div>
        ))}
        <div className="cart-summary__grand-total">
          <dt>Total TTC</dt>
          <dd>{formatPrice(totals.ttc)}</dd>
        </div>
      </dl>

      {hasStockIssues && (
        <div className="cart-summary__alert" role="alert">
          <p>Le stock ne couvre pas toute votre commande :</p>
          <ul>
            {stockIssues.map((issue) => (
              <li key={issue.productId}>
                {issue.name} : {issue.available === 0 ? 'rupture de stock' : `${issue.available} disponible${issue.available > 1 ? 's' : ''}`}
              </li>
            ))}
          </ul>
          <Button variant="secondary" fullWidth onClick={onAdjustStock}>
            Ajuster les quantités au stock
          </Button>
        </div>
      )}

      {/* Un lien ne peut pas être désactivé : tant que le stock pose problème, on affiche un vrai bouton grisé. */}
      {hasStockIssues ? (
        <Button fullWidth disabled title="Corrigez le stock pour continuer">
          Passer commande
        </Button>
      ) : (
        <ButtonLink to="/commande" className="btn--full">
          Passer commande
        </ButtonLink>
      )}

      {isConfirmingClear ? (
        <div className="cart-summary__confirm" role="group" aria-label="Confirmation">
          <p>Vider tout le panier ?</p>
          <div>
            <Button
              variant="secondary"
              onClick={() => {
                onClear();
                setIsConfirmingClear(false);
              }}
            >
              Oui, vider
            </Button>
            <Button variant="secondary" onClick={() => setIsConfirmingClear(false)}>
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <button type="button" className="cart-summary__clear" onClick={() => setIsConfirmingClear(true)}>
          Vider le panier
        </button>
      )}
    </aside>
  );
}
