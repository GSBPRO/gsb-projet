import { Link, Navigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { cartTotals, formatPrice, formatVatRate, lineAmounts } from '../../utils/price.js';
import useCart from '../cart/useCart.js';
import useCatalogue from '../catalogue/useCatalogue.js';
import { ADDRESS_MAX } from './orderService.js';
import useCheckoutForm from './useCheckoutForm.js';
import './CheckoutPage.css';

// Validation de la commande : récapitulatif, adresse de livraison et paiement simulé (F17, F18, RG18).
// Aucune donnée bancaire n'est demandée, même en démonstration.
export default function CheckoutPage() {
  const { status, data, reload } = useCatalogue();
  const { items } = useCart();
  const { values, errors, formError, stockIssues, isSubmitting, isPlaced, handleChange, handleSubmit } =
    useCheckoutForm();

  if (status === 'loading') {
    return (
      <div className="checkout-page" aria-busy="true">
        <h1 className="checkout-page__title">Valider ma commande</h1>
        <p className="checkout-page__message">Chargement…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="checkout-page">
        <h1 className="checkout-page__title">Valider ma commande</h1>
        <div className="checkout-page__message" role="alert">
          <p>La page n’a pas pu être chargée.</p>
          <Button onClick={reload}>Réessayer</Button>
        </div>
      </div>
    );
  }

  const lines = items
    .map((item) => ({ ...item, product: data.products.find((product) => product.id === item.productId) }))
    .filter((line) => line.product);

  // Rien à commander : retour au panier. Sauf juste après la commande (le panier vient d'être vidé).
  if (lines.length === 0 && !isPlaced) {
    return <Navigate to="/panier" replace />;
  }

  const totals = cartTotals(
    lines.map((line) => ({ priceHt: line.product.priceHt, vatRate: line.product.vatRate, quantity: line.quantity })),
  );

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Valider ma commande</h1>

      <div className="checkout-page__layout">
        <form className="checkout-page__form" onSubmit={handleSubmit} noValidate>
          <section aria-labelledby="delivery-title">
            <h2 id="delivery-title">Livraison</h2>
            <Input
              multiline
              rows={4}
              label="Adresse de livraison"
              name="address"
              autoComplete="street-address"
              placeholder={'Établissement, numéro et rue\nCode postal et ville'}
              maxLength={ADDRESS_MAX}
              required
              value={values.address}
              onChange={handleChange}
              error={errors.address}
            />
          </section>

          <section aria-labelledby="payment-title">
            <h2 id="payment-title">Paiement</h2>
            <p className="checkout-page__note">
              Paiement simulé : aucune donnée bancaire n’est demandée ni conservée.
            </p>
            <label className="checkout-page__demo">
              <input type="checkbox" name="simulateFailure" checked={values.simulateFailure} onChange={handleChange} />
              <span>Mode démonstration : simuler un échec du paiement</span>
            </label>
          </section>

          {formError && (
            <div className="checkout-page__error" role="alert">
              <p>{formError}</p>
              {stockIssues.length > 0 && (
                <>
                  <ul>
                    {stockIssues.map((issue) => (
                      <li key={issue.productId}>
                        {issue.name} : {issue.available === 0 ? 'rupture de stock' : `${issue.available} disponible${issue.available > 1 ? 's' : ''}`}
                      </li>
                    ))}
                  </ul>
                  <Link to="/panier">Modifier mon panier</Link>
                </>
              )}
            </div>
          )}

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Paiement en cours…' : `Payer ${formatPrice(totals.ttc)}`}
          </Button>
        </form>

        <aside className="checkout-page__summary" aria-labelledby="order-summary-title">
          <h2 id="order-summary-title">Votre commande</h2>
          <ul>
            {lines.map((line) => (
              <li key={line.productId}>
                <span>
                  {line.quantity} × {line.product.name}
                </span>
                <span>{formatPrice(lineAmounts(line.product.priceHt, line.product.vatRate, line.quantity).ttc)}</span>
              </li>
            ))}
          </ul>
          <dl>
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
            <div className="checkout-page__grand-total">
              <dt>Total TTC</dt>
              <dd>{formatPrice(totals.ttc)}</dd>
            </div>
          </dl>
          <Link to="/panier">Modifier mon panier</Link>
        </aside>
      </div>
    </div>
  );
}
