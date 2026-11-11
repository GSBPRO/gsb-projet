import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import useCatalogue from '../catalogue/useCatalogue.js';
import { cartTotals } from '../../utils/price.js';
import CartLine from './CartLine.jsx';
import CartSummary from './CartSummary.jsx';
import { findStockIssues } from './cartService.js';
import useCart from './useCart.js';
import './CartPage.css';

// Page « Mon panier » : les produits choisis, leur quantité, la suppression.
// Les prix et le stock viennent du catalogue (jamais du panier enregistré dans le navigateur).
export default function CartPage() {
  const { status, data, reload } = useCatalogue();
  const { items, setQuantity, removeItem, clear, replaceItems } = useCart();

  if (status === 'loading') {
    return (
      <div className="cart-page" aria-busy="true">
        <h1 className="cart-page__title">Mon panier</h1>
        <p className="cart-page__message">Chargement du panier…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="cart-page">
        <h1 className="cart-page__title">Mon panier</h1>
        <div className="cart-page__message" role="alert">
          <p>Le panier n’a pas pu être chargé.</p>
          <Button onClick={reload}>Réessayer</Button>
        </div>
      </div>
    );
  }

  // On associe chaque ligne enregistrée à son produit. Un produit qui n'existe plus (ou n'est plus vendable)
  // est simplement ignoré : on n'affiche jamais de ligne sans prix.
  const lines = items
    .map((item) => ({ ...item, product: data.products.find((product) => product.id === item.productId) }))
    .filter((line) => line.product);

  if (lines.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="cart-page__title">Mon panier</h1>
        <div className="cart-page__message">
          <p>Votre panier est vide.</p>
          <Link to="/catalogue">Parcourir le catalogue</Link>
        </div>
      </div>
    );
  }

  const laboratoriesById = new Map(data.laboratories.map((lab) => [lab.id, lab]));

  const totals = cartTotals(
    lines.map((line) => ({ priceHt: line.product.priceHt, vatRate: line.product.vatRate, quantity: line.quantity })),
  );
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const stockIssues = findStockIssues(lines);

  // Ramène chaque ligne au stock disponible et retire les produits en rupture.
  // Un seul appel à replaceItems : plusieurs appels de suite se marcheraient dessus.
  function handleAdjustStock() {
    const adjusted = lines
      .map((line) => ({ productId: line.productId, quantity: Math.min(line.quantity, line.product.stock) }))
      .filter((line) => line.quantity > 0);
    replaceItems(adjusted);
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Mon panier</h1>
      <div className="cart-page__layout">
        <ul className="cart-page__lines">
          {lines.map((line) => (
            <CartLine
              key={line.productId}
              product={line.product}
              laboratory={laboratoriesById.get(line.product.laboratoryId)}
              quantity={line.quantity}
              onQuantityChange={setQuantity}
              onRemove={removeItem}
            />
          ))}
        </ul>
        <CartSummary
          totals={totals}
          itemCount={itemCount}
          stockIssues={stockIssues}
          onAdjustStock={handleAdjustStock}
          onClear={clear}
        />
      </div>
    </div>
  );
}
