import { Link } from 'react-router-dom';
import QuantityStepper from '../../components/ui/QuantityStepper.jsx';
import { formatPrice, lineAmounts, priceWithTax } from '../../utils/price.js';
import ProductImage from '../catalogue/ProductImage.jsx';
import StockBadge from '../catalogue/StockBadge.jsx';
import { MAX_QUANTITY } from './cartService.js';
import './CartLine.css';

// Une ligne du panier : le produit, son prix unitaire, la quantité modifiable et le total de la ligne.
export default function CartLine({ product, laboratory, quantity, onQuantityChange, onRemove }) {
  const unitTtc = priceWithTax(product.priceHt, product.vatRate);
  const { ttc } = lineAmounts(product.priceHt, product.vatRate, quantity);
  const maxQuantity = Math.max(1, Math.min(MAX_QUANTITY, product.stock));

  return (
    <li className="cart-line">
      <Link to={`/catalogue/${product.id}`} className="cart-line__image" aria-label={`${product.name} : voir la fiche`}>
        <ProductImage product={product} laboratoryColor={laboratory?.color} />
      </Link>

      <div className="cart-line__info">
        <Link to={`/catalogue/${product.id}`} className="cart-line__name">
          {product.name}
        </Link>
        <p className="cart-line__format">
          {product.format} · {laboratory?.name}
        </p>
        <p className="cart-line__unit">{formatPrice(unitTtc)} TTC l’unité</p>
        <StockBadge stock={product.stock} />
        {quantity > product.stock && (
          <p className="cart-line__issue">
            {product.stock === 0
              ? 'Ce produit est en rupture de stock : retirez-le pour continuer.'
              : `Seulement ${product.stock} disponible${product.stock > 1 ? 's' : ''} : réduisez la quantité.`}
          </p>
        )}
      </div>

      <div className="cart-line__controls">
        <QuantityStepper
          value={quantity}
          max={maxQuantity}
          onChange={(value) => onQuantityChange(product.id, value)}
          label={`Quantité de ${product.name}`}
        />
        <p className="cart-line__total">{formatPrice(ttc)} TTC</p>
        <button type="button" className="cart-line__remove" onClick={() => onRemove(product.id)}>
          Supprimer<span className="visually-hidden"> {product.name} du panier</span>
        </button>
      </div>
    </li>
  );
}
